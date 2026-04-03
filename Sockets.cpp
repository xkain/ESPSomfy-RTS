#include <Arduino.h>
#include <ArduinoJson.h>
#include <WebSocketsServer.h>
#include <esp_task_wdt.h>
#include "Sockets.h"
#include "ConfigSettings.h"
#include "Somfy.h"
#include "Network.h"
#include "GitOTA.h"

extern ConfigSettings settings;
extern Network net;
extern SomfyShadeController somfy;
extern SocketEmitter sockEmit;
extern GitUpdater git;


WebSocketsServer sockServer = WebSocketsServer(8080);

#define MAX_SOCK_RESPONSE 2048
static char g_response[MAX_SOCK_RESPONSE];

// ─────────────────────────────────────────────
// Macro utilitaire : reset WDT + yield pour
// laisser la pile réseau/RTOS respirer.
// À appeler entre chaque opération potentiellement longue.
// ─────────────────────────────────────────────
#define WDT_FEED() do { esp_task_wdt_reset(); yield(); } while(0)

/*********************************************************************
 * room_t members
 ********************************************************************/
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
 * SocketEmitter members
 ********************************************************************/
void SocketEmitter::startup() {
}

void SocketEmitter::begin() {
  sockServer.begin();
  // Heartbeat agressif : détecte les connexions mortes en ~5s max.
  // Ping toutes les 3s, timeout 2s, 2 tentatives avant déconnexion.
  // Impact CPU négligeable (~0.1%) mais libère la heap rapidement
  // en cas de client fantôme.
  sockServer.enableHeartbeat(3000, 2000, 2);
  sockServer.onEvent(this->wsEvent);
  Serial.println("Socket Server Started...");
}

void SocketEmitter::loop() {
  this->initClients();
  WDT_FEED();
  sockServer.loop();
  WDT_FEED();
}

JsonSockEvent *SocketEmitter::beginEmit(const char *evt) {
  this->json.beginEvent(&sockServer, evt, g_response, sizeof(g_response));
  return &this->json;
}

// Chaque endEmit reset le WDT : si on émet vers plusieurs clients
// en rafale (ex. broadcast d'un état), la boucle appelante ne peut
// plus faire expirer le watchdog.
void SocketEmitter::endEmit(uint8_t num) {
  this->json.endEvent(num);
  WDT_FEED();
  sockServer.loop();
  WDT_FEED();
}

void SocketEmitter::endEmitRoom(uint8_t room) {
  if(room < SOCK_MAX_ROOMS) {
    room_t *r = &this->rooms[room];
    for(uint8_t i = 0; i < sizeof(r->clients); i++) {
      if(r->clients[i] != 255) {
        this->json.endEvent(r->clients[i]);
        // Reset WDT après chaque envoi : avec N clients dans la room,
        // la boucle peut durer N × (temps d'envoi). Sans reset ici,
        // c'est un point de crash garanti sur une room peuplée.
        WDT_FEED();
      }
    }
  }
}

uint8_t SocketEmitter::activeClients(uint8_t room) {
  if(room < SOCK_MAX_ROOMS) return this->rooms[room].activeClients();
  return 0;
}

// initClients() est le point le plus sensible du fichier.
// Elle est appelée à chaque loop() et peut enchaîner 4 émissions
// lourdes par client en attente. Chaque opération a son propre
// reset WDT pour ne jamais dépasser le timeout, même si l'une
// d'elles est anormalement lente (réseau dégradé, buffer plein...).
void SocketEmitter::initClients() {
  for(uint8_t i = 0; i < sizeof(this->newClients); i++) {
    uint8_t num = this->newClients[i];
    if(num == 255) continue;

    if(sockServer.clientIsConnected(num)) {
      Serial.printf("Initializing Socket Client %u\n", num);

      WDT_FEED();
      settings.emitSockets(num);

      WDT_FEED();
      somfy.emitState(num);

      WDT_FEED();
      git.emitUpdateCheck(num);

      WDT_FEED();
      net.emitSockets(num);

      WDT_FEED();
      Serial.printf("Socket Client %u initialized\n", num);
    } else {
      Serial.printf("Socket Client %u disconnected before init, skipping\n", num);
    }

    this->newClients[i] = 255;
  }
}

void SocketEmitter::delayInit(uint8_t num) {
  for(uint8_t i = 0; i < sizeof(this->newClients); i++) {
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
        Serial.printf("Socket Error [%u]: %s\n", num, payload);
    else
      Serial.printf("Socket Error [%u]\n", num);
    break;

    case WStype_DISCONNECTED:
      if(length > 0)
        Serial.printf("Socket [%u] Disconnected! [%s]\n", num, payload);
    else
      Serial.printf("Socket [%u] Disconnected!\n", num);
    // Nettoyage des rooms : libère la place pour de nouveaux clients
    // et évite d'envoyer vers un descripteur mort dans endEmitRoom().
    for(uint8_t i = 0; i < SOCK_MAX_ROOMS; i++) {
      sockEmit.rooms[i].leave(num);
    }
    // Annule une éventuelle init en attente pour ce client
    for(uint8_t i = 0; i < sizeof(sockEmit.newClients); i++) {
      if(sockEmit.newClients[i] == num) {
        sockEmit.newClients[i] = 255;
        break;
      }
    }
    break;

    case WStype_CONNECTED: {
      IPAddress ip = sockServer.remoteIP(num);
      Serial.printf("Socket [%u] Connected from %d.%d.%d.%d url: %s\n",
                    num, ip[0], ip[1], ip[2], ip[3], payload);
      sockServer.sendTXT(num, "Connected");
      // L'init est différée : on ne bloque pas le handler d'événement
      // (qui tourne dans la même tâche que la boucle principale).
      sockEmit.delayInit(num);
      break;
    }

    case WStype_TEXT:
      if(strncmp((char *)payload, "join:", 5) == 0) {
        uint8_t roomNum = atoi((char *)&payload[5]);
        Serial.printf("Client %u joining room %u\n", num, roomNum);
        if(roomNum < SOCK_MAX_ROOMS) sockEmit.rooms[roomNum].join(num);
      }
      else if(strncmp((char *)payload, "leave:", 6) == 0) {
        uint8_t roomNum = atoi((char *)&payload[6]);
        Serial.printf("Client %u leaving room %u\n", num, roomNum);
        if(roomNum < SOCK_MAX_ROOMS) sockEmit.rooms[roomNum].leave(num);
      }
      else {
        Serial.printf("Socket [%u] text: %s\n", num, payload);
      }
      break;

    case WStype_BIN:
      Serial.printf("Socket [%u] binary length: %u (ignored)\n", num, length);
      break;

    case WStype_PONG:
      // Pong reçu : la connexion est vivante, rien à faire.
      break;

    case WStype_PING:
      // Ping reçu depuis le client (rare, le serveur fait le heartbeat).
      break;

    default:
      break;
  }
}
