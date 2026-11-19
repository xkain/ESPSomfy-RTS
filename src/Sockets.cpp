#include <Arduino.h>
#include <ArduinoJson.h>
#include <WebSocketsServer.h>
#include <esp_task_wdt.h>
#include "Sockets.h"
#include "ConfigSettings.h"
#include "Somfy.h"
#include "Network.h"
#include "GitOTA.h"
#include "Web.h"

extern ConfigSettings settings;
extern Network net;
extern SomfyShadeController somfy;
extern SocketEmitter sockEmit;
extern GitUpdater git;
extern Web webServer;  // createAPIToken() pour la poignee de main authentifiee, cf. plus bas


WebSocketsServer sockServer = WebSocketsServer(8080);

#define MAX_SOCK_RESPONSE 2048
static char g_response[MAX_SOCK_RESPONSE];

// HANDSHAKE AUTHENTICATION.
//
// Without it the server authenticates NOTHING on this channel: on WStype_CONNECTED it goes straight
// to delayInit() -> initClients() -> somfy.emitState(num), that is the full state of every shade,
// remoteAddress included. A client can also send "join:0" to join ROOM_EMIT_FRAME and then receive
// EVERY RF frame captured, decoded, with address and rolling code. The HTTP authentication model is
// therefore entirely bypassable through port 8080, including with full security enabled.
//
// SAME LEVEL AS /controller AND /shades (checkAuth with cfg=false), no stricter: those two routes
// expose the same fields. The goal is to close the bypass, not to harden beyond the rest of the API.
//
// THE TOKEN ARRIVES THROUGH THE URL of the handshake ("/?apikey=<token>"): WStype_CONNECTED receives
// cUrl as its payload, query string included. No custom header is possible here, the browser
// WebSocket API accepts none. Since the token is already sent in the clear in an HTTP header on
// every request from the UI, exposing it in the URL of that same transport does not change the
// threat model.
//
// DEFERRED DISCONNECTION. The connection is not cut from the callback: that callback is called by
// WebSocketsServerCore::handleHeader(), which keeps using `client` after it returns. The slot is
// marked and SocketEmitter::loop() does the disconnect() on the next pass. In the meantime the slot
// receives nothing -- it is not registered in newClients (no delayInit) and cannot join a room (see
// WStype_TEXT).
//
// NO CRITICAL SECTION on these two masks, unlike what an asynchronous HTTP server would require:
// here handleClient() and sockServer.loop() are both called from the Arduino loop (see
// SomfyController.ino), hence from the SAME task. A single writer, no race.
//
// THIRD-PARTY CLIENT COMPATIBILITY. This check only bites when full security is enabled: at
// Security.type == None (factory default) as in config-only mode, the handshake passes without a
// key, exactly as before. A non-browser client that already authenticates over HTTP must, for its
// part, add "?apikey=<token>" to its socket URL when full security is enabled.
static uint16_t g_authedClients = 0;      // bit par emplacement : poignee de main validee
static uint16_t g_pendingDisconnect = 0;  // bit par emplacement : a couper au prochain loop()

bool sockClientAuthorized(uint8_t num) {
  if(num >= WEBSOCKETS_SERVER_CLIENT_MAX) return false;
  return (g_authedClients & (1u << num)) != 0;
}
void sockRevokeAllClients() {
  g_pendingDisconnect |= g_authedClients;
  g_authedClients = 0;
}
// Extracts the "apikey" parameter from the handshake URL and compares it with the token expected
// for the client's IP. Same deterministic computation as Web::checkAuth()
// (HMAC secret+credentials+IP), so there is no session to remember.
static bool socketHandshakeAuthorized(uint8_t num, const uint8_t *payload, size_t length) {
  // Security off, or config-only mode: the socket carries state and control only, not
  // configuration -- nothing to check, see Web::checkAuth(server, false).
  if(settings.Security.type == security_types::None) return true;
  if((settings.Security.permissions & static_cast<uint8_t>(security_permissions::ConfigOnly)) == 0x01) return true;
  if(!payload || length == 0) return false;

  // payload is not guaranteed to be NUL-terminated: bound it explicitly.
  String url((const char *)payload, length);
  int at = url.indexOf("apikey=");
  if(at < 0) return false;
  // Refuse "xapikey=" : le caractere qui precede doit ouvrir un parametre.
  if(at > 0 && url.charAt(at - 1) != '?' && url.charAt(at - 1) != '&') return false;
  int from = at + 7;
  int end = url.indexOf('&', from);
  // NO percent-decoding: the token is 64 hexadecimal characters (see createAPIToken), so the
  // client's encodeURIComponent never escapes anything. Should the token format ever change,
  // decoding would be needed here -- otherwise the comparison would fail silently.
  String key = (end < 0) ? url.substring(from) : url.substring(from, end);

  char expected[65];
  memset(expected, 0x00, sizeof(expected));
  // A failed computation and an empty token are refused explicitly, for the same reason as
  // Web::checkAuth(): a URL ending in "?apikey=" supplies a zero-length key, which would be judged
  // equal to an `expected` left empty after a failed HMAC allocation. The socket broadcasts the
  // full shade state, remote address included -- precisely the channel that must not be opened by a
  // shortage of memory.
  if(!webServer.createAPIToken(sockServer.remoteIP(num), expected)) return false;
  if(expected[0] == '\0') return false;
  return key.length() == strlen(expected) && key.equals(expected);
}

bool room_t::isJoined(uint8_t num) {
  for(uint8_t i = 0; i < sizeof(this->clients); i++) { 
    if(this->clients[i] == num) return true; 
  } 
  return false; 
}
bool room_t::join(uint8_t num) {
  if(this->isJoined(num)) return true; 
  for(uint8_t i = 0; i < sizeof(this->clients); i++) { 
    if(this->clients[i] == 255) { 
      this->clients[i] = num; 
      return true; 
    } 
  }
  return false;  
}
bool room_t::leave(uint8_t num) { 
  if(!this->isJoined(num)) return false; 
  for(uint8_t i = 0; i < sizeof(this->clients); i++) { 
    if(this->clients[i] == num) this->clients[i] = 255; 
  } 
  return true;
}
void room_t::clear() {
  memset(this->clients, 255, sizeof(this->clients));
}
uint8_t room_t::activeClients() {
  uint8_t n = 0;
  for(uint8_t i = 0; i < sizeof(this->clients); i++) {
    if(this->clients[i] != 255) n++;
  }
  return n;
}
/*********************************************************************
 * ClientSocketEvent class members
 ********************************************************************/
/*
void ClientSocketEvent::prepareMessage(const char *evt, const char *payload) {
  if(strlen(payload) + 5 >= sizeof(this->msg)) Serial.printf("Socket buffer overflow %d > 2048\n", strlen(payload) + 5 + strlen(evt));
    snprintf(this->msg, sizeof(this->msg), "42[%s,%s]", evt, payload);
}
void ClientSocketEvent::prepareMessage(const char *evt, JsonDocument &doc) {
  memset(this->msg, 0x00, sizeof(this->msg));
  snprintf(this->msg, sizeof(this->msg), "42[%s,", evt);
  serializeJson(doc, &this->msg[strlen(this->msg)], sizeof(this->msg) - strlen(this->msg) - 2);
  strcat(this->msg, "]");
}
*/

/*********************************************************************
 * SocketEmitter class members
 ********************************************************************/
void SocketEmitter::startup() {
  
}
void SocketEmitter::begin() {
  sockServer.begin();
  sockServer.enableHeartbeat(20000, 10000, 3);
  sockServer.onEvent(this->wsEvent);
  Serial.println("Socket Server Started...");
  //settings.printAvailHeap();
}
void SocketEmitter::loop() {
  // Deferred disconnections of refused handshakes (see the header of this file): handled here,
  // from the task that owns sockServer, and BEFORE initClients() so that a refused slot can receive
  // nothing.
  if(g_pendingDisconnect) {
    for(uint8_t num = 0; num < WEBSOCKETS_SERVER_CLIENT_MAX; num++) {
      if(g_pendingDisconnect & (1u << num)) {
        g_pendingDisconnect &= ~(1u << num);
        sockServer.disconnect(num);
      }
    }
  }
  this->initClients();
  sockServer.loop();  
}
JsonSockEvent *SocketEmitter::beginEmit(const char *evt) {
  this->json.beginEvent(&sockServer, evt, g_response, sizeof(g_response));
  return &this->json;
}
void SocketEmitter::endEmit(uint8_t num) { this->json.endEvent(num); sockServer.loop(); }
void SocketEmitter::endEmitRoom(uint8_t room) {
  if(room < SOCK_MAX_ROOMS) {
    room_t *r = &this->rooms[room];
    for(uint8_t i = 0; i < sizeof(r->clients); i++) {
      if(r->clients[i] != 255) this->json.endEvent(r->clients[i]);
    }
  }
}
uint8_t SocketEmitter::activeClients(uint8_t room) {
  if(room < SOCK_MAX_ROOMS) return this->rooms[room].activeClients();
  return 0;
}
void SocketEmitter::initClients() {
  for(uint8_t i = 0; i < sizeof(this->newClients); i++) {
    uint8_t num = this->newClients[i];
    if(num != 255) {
      if(sockServer.clientIsConnected(num)) {
        Serial.printf("Initializing Socket Client %u\n", num);
        esp_task_wdt_reset();
        settings.emitSockets(num);
        somfy.emitState(num);
        git.emitUpdateCheck(num);
        net.emitSockets(num);
        esp_task_wdt_reset();
      }
      this->newClients[i] = 255;
    }
  }
}
void SocketEmitter::delayInit(uint8_t num) {
  for(uint8_t i=0; i < sizeof(this->newClients); i++) {
    if(this->newClients[i] == num) break;
    else if(this->newClients[i] == 255) {
      this->newClients[i] = num;
      break;
    }
  }
}
void SocketEmitter::end() { 
  sockServer.close(); 
  for(uint8_t i = 0; i < SOCK_MAX_ROOMS; i++)
    this->rooms[i].clear();
}
void SocketEmitter::disconnect() { sockServer.disconnect(); }
void SocketEmitter::wsEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length) {
    switch(type) {
        case WStype_ERROR:
            if(length > 0)
              Serial.printf("Socket Error: %s\n", payload);
            else
              Serial.println("Socket Error: \n");
            break;
        case WStype_DISCONNECTED:
            if(length > 0)
              Serial.printf("Socket [%u] Disconnected!\n [%s]", num, payload);
            else
              Serial.printf("Socket [%u] Disconnected!\n", num);
            for(uint8_t i = 0; i < SOCK_MAX_ROOMS; i++) {
              sockEmit.rooms[i].leave(num);
            }
            if(num < WEBSOCKETS_SERVER_CLIENT_MAX) {
              g_authedClients &= ~(1u << num);
              g_pendingDisconnect &= ~(1u << num);
            }
            break;
        case WStype_CONNECTED:
            {
                IPAddress ip = sockServer.remoteIP(num);
                // Handshake refused: no "Connected", no delayInit -- so no state is emitted. The
                // cut is deferred to SocketEmitter::loop() (see the header of this file).
                if(!socketHandshakeAuthorized(num, payload, length)) {
                  Serial.printf("Socket [%u] rejected from %d.%d.%d.%d: missing or invalid apikey\n", num, ip[0], ip[1], ip[2], ip[3]);
                  if(num < WEBSOCKETS_SERVER_CLIENT_MAX) g_pendingDisconnect |= (1u << num);
                  break;
                }
                if(num < WEBSOCKETS_SERVER_CLIENT_MAX) g_authedClients |= (1u << num);
                Serial.printf("Socket [%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
                // Send all the current shade settings to the client.
                sockServer.sendTXT(num, "Connected");
                //sockServer.loop();
                sockEmit.delayInit(num);
            }
            break;
        case WStype_TEXT:
            // ROOM_EMIT_FRAME diffuse TOUTES les trames RF decodees, adresse et code tournant
            // compris : un emplacement dont la poignee de main a ete refusee ne doit pas pouvoir la
            // rejoindre pendant le tour de boucle qui precede sa coupure.
            if(!sockClientAuthorized(num)) break;
            if(strncmp((char *)payload, "join:", 5) == 0) {
              // In this instance the client wants to join a room.  Let's do some
              // work to get the ordinal of the room that the client wants to join.
              uint8_t roomNum = atoi((char *)&payload[5]);
              Serial.printf("Client %u joining room %u\n", num, roomNum);
              if(roomNum < SOCK_MAX_ROOMS) sockEmit.rooms[roomNum].join(num);
            }
            else if(strncmp((char *)payload, "leave:", 6) == 0) {
              uint8_t roomNum = atoi((char *)&payload[6]);
              Serial.printf("Client %u leaving room %u\n", num, roomNum);
              if(roomNum < SOCK_MAX_ROOMS) sockEmit.rooms[roomNum].leave(num);
            }
            else if(length == 4 && memcmp(payload, "ping", 4) == 0) {
              sockServer.sendTXT(num, "pong");
            }
            else {
              Serial.printf("Socket [%u] text: %s\n", num, payload);
            }
            // send message to client
            // webSocket.sendTXT(num, "message here");

            // send data to all connected clients
            // sockServer.broadcastTXT("message here");
            break;
        case WStype_BIN:
            Serial.printf("[%u] get binary length: %u\n", num, length);
            //hexdump(payload, length);

            // send message to client
            // sockServer.sendBIN(num, payload, length);
            break;
        case WStype_PONG:
            //Serial.printf("Pong from %u\n", num);
            break;
        case WStype_PING:
            //Serial.printf("Ping from %u\n", num);
            break;
        default:
            break;
    }  
}
