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

// AUTHENTIFICATION DE LA POIGNEE DE MAIN.
//
// Sans elle, le serveur n'authentifie RIEN sur ce canal : sur WStype_CONNECTED il enchaine
// directement delayInit() -> initClients() -> somfy.emitState(num), c'est-a-dire l'etat complet de
// chaque equipement, remoteAddress comprise. Un client peut de plus emettre "join:0" pour rejoindre
// ROOM_EMIT_FRAME et recevoir alors TOUTES les trames RF captees, decodees, avec adresse et code
// tournant. Le modele d'authentification HTTP est donc integralement contournable par le port 8080,
// y compris avec la securite "complete" activee.
//
// MEME NIVEAU QUE /controller ET /shades (checkAuth avec cfg=false), pas plus strict : ces deux
// routes exposent les memes champs. L'objectif est de fermer le contournement, pas de durcir au-dela
// du reste de l'API.
//
// LE JETON ARRIVE PAR L'URL de la poignee de main ("/?apikey=<jeton>") : WStype_CONNECTED recoit
// cUrl en charge utile, chaine de requete comprise. Aucun en-tete personnalise n'est possible ici,
// l'API WebSocket du navigateur n'en accepte pas. Le jeton etant deja transmis en clair dans un
// en-tete HTTP a chaque requete de l'interface, l'exposer dans l'URL de ce meme transport ne change
// pas le modele de menace.
//
// DECONNEXION DIFFEREE. On ne coupe pas la connexion depuis le callback : celui-ci est appele par
// WebSocketsServerCore::handleHeader(), qui continue d'utiliser `client` apres le retour. On marque
// l'emplacement et SocketEmitter::loop() fait le disconnect() au tour suivant. Entre-temps
// l'emplacement ne recoit rien -- il n'est pas inscrit dans newClients (pas de delayInit) et ne peut
// pas rejoindre de salle (cf. WStype_TEXT).
//
// PAS DE SECTION CRITIQUE sur ces deux masques, contrairement a ce qu'exigerait un serveur HTTP
// asynchrone : ici handleClient() et sockServer.loop() sont tous deux appeles depuis la boucle
// Arduino (cf. SomfyController.ino), donc depuis la MEME tache. Un seul ecrivain, aucune course.
//
// COMPATIBILITE CLIENTS TIERS. Ce controle ne mord QUE si la securite complete est active : a
// Security.type == None (defaut d'usine) comme en mode "config seule", la poignee de main passe sans
// cle, exactement comme avant. Un client non-navigateur qui s'authentifie deja en HTTP doit, lui,
// ajouter "?apikey=<jeton>" a l'URL de sa socket lorsque la securite complete est active.
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
// Extrait la valeur du parametre "apikey" de l'URL de poignee de main et la compare au jeton attendu
// pour l'IP du client. Meme calcul deterministe que Web::checkAuth() (HMAC secret+identifiants+IP),
// donc aucune session a memoriser.
static bool socketHandshakeAuthorized(uint8_t num, const uint8_t *payload, size_t length) {
  // Securite desactivee, ou mode "config seule" : la socket ne transporte que de l'etat et du
  // controle, pas de la configuration -- rien a verifier, cf. Web::checkAuth(server, false).
  if(settings.Security.type == security_types::None) return true;
  if((settings.Security.permissions & static_cast<uint8_t>(security_permissions::ConfigOnly)) == 0x01) return true;
  if(!payload || length == 0) return false;

  // payload n'est pas garanti termine par un NUL : on borne explicitement.
  String url((const char *)payload, length);
  int at = url.indexOf("apikey=");
  if(at < 0) return false;
  // Refuse "xapikey=" : le caractere qui precede doit ouvrir un parametre.
  if(at > 0 && url.charAt(at - 1) != '?' && url.charAt(at - 1) != '&') return false;
  int from = at + 7;
  int end = url.indexOf('&', from);
  // PAS de decodage pourcent : le jeton est 64 caracteres hexadecimaux (cf. createAPIToken), donc
  // encodeURIComponent cote client n'echappe jamais rien. Si le format du jeton changeait un jour,
  // il faudrait decoder ici -- sans quoi la comparaison echouerait en silence.
  String key = (end < 0) ? url.substring(from) : url.substring(from, end);

  char expected[65];
  memset(expected, 0x00, sizeof(expected));
  // Echec de calcul et jeton vide refuses explicitement, pour la meme raison que Web::checkAuth() :
  // une URL terminee par "?apikey=" fournit une cle de longueur nulle, qui serait jugee egale a un
  // `expected` reste vide apres un echec d'allocation HMAC. La socket diffuse l'etat complet des
  // equipements, adresse de telecommande comprise -- c'est precisement le canal qu'il ne faut pas
  // ouvrir par defaut de memoire.
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
  // Deconnexions differees des poignees de main refusees (cf. l'en-tete de ce fichier) : on les
  // traite ici, depuis la tache proprietaire de sockServer, et AVANT initClients() pour qu'un
  // emplacement refuse ne puisse rien recevoir.
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
                // Poignee de main refusee : ni "Connected", ni delayInit -- donc aucun etat emis. La
                // coupure est differee a SocketEmitter::loop() (cf. l'en-tete de ce fichier).
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
