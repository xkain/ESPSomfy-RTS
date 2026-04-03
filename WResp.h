#ifndef wresp_h
#define wresp_h

#include <WebServer.h>
#include <WebSocketsServer.h>
// esp_task_wdt.h est intentionnellement ABSENT ici.
// Il est inclus uniquement dans WResp.cpp et Sockets.cpp.
// L'inclure ici le propagerait à tout le projet via la chaîne
// WResp.h → ConfigSettings.h → Somfy.h, ce qui fragmente la heap
// et fait chuter maxBlock de ~106k à ~73k.
//
// NOTE: Somfy.h n'est PAS inclus ici non plus — c'est Somfy.h qui inclut
// WResp.h, pas l'inverse. Supprimer cet include coupe la dépendance
// circulaire de l'original sans le hack de re-entrée.

// ─────────────────────────────────────────────────────────────────────────────
// JsonFormatter
// Classe de base pour la sérialisation JSON vers un buffer char*.
// Deux sous-classes concrètes : JsonResponse (HTTP) et JsonSockEvent (WebSocket).
// ─────────────────────────────────────────────────────────────────────────────
class JsonFormatter {
protected:
  char   *buff        = nullptr;
  size_t  buffSize    = 0;
  bool    _headersSent = false;
  uint8_t _objects    = 0;
  uint8_t _arrays     = 0;
  bool    _nocomma    = true;
  char    _numbuff[25] = {0};

  virtual void _safecat(const char *val, bool escape = false);
  void _appendNumber(const char *name);

public:
  // Utilitaires d'échappement JSON
  void     escapeString(const char *raw, char *escaped);
  uint32_t calcEscapedLength(const char *raw);

  // Structure JSON
  void beginObject(const char *name = nullptr);
  void endObject();
  void beginArray(const char *name = nullptr);
  void endArray();
  void appendElem(const char *name = nullptr);

  // ── addElem sans nom ───────────────────────────────────────────────────
  void addElem(const char *val);
  void addElem(bool     bval);
  void addElem(float    fval);
  void addElem(int8_t   nval);
  void addElem(uint8_t  nval);
  void addElem(int16_t  nval);
  void addElem(uint16_t nval);
  void addElem(int32_t  nval);
  void addElem(uint32_t nval);
  void addElem(int64_t  lval);
  void addElem(uint64_t lval);

  // ── addElem avec nom ───────────────────────────────────────────────────
  void addElem(const char *name, const char *val);
  void addElem(const char *name, bool     bval);
  void addElem(const char *name, float    fval);
  void addElem(const char *name, int8_t   nval);
  void addElem(const char *name, uint8_t  nval);
  void addElem(const char *name, int16_t  nval);
  void addElem(const char *name, uint16_t nval);
  void addElem(const char *name, int32_t  nval);
  void addElem(const char *name, uint32_t nval);
  void addElem(const char *name, int64_t  lval);
  void addElem(const char *name, uint64_t lval);  // nécessaire pour millis() (uptime)
};

// ─────────────────────────────────────────────────────────────────────────────
// JsonResponse — réponse HTTP chunked
// ─────────────────────────────────────────────────────────────────────────────
class JsonResponse : public JsonFormatter {
protected:
  void _safecat(const char *val, bool escape = false) override;

public:
  WebServer *server = nullptr;

  void beginResponse(WebServer *server, char *buff, size_t buffSize);
  void endResponse();
  void send();  // flush le buffer courant vers le client HTTP
};

// ─────────────────────────────────────────────────────────────────────────────
// JsonSockEvent — message WebSocket au format socket.io "42[event,{...}]"
// ─────────────────────────────────────────────────────────────────────────────
class JsonSockEvent : public JsonFormatter {
protected:
  bool _closed = false;
  void _safecat(const char *val, bool escape = false) override;

public:
  WebSocketsServer *server = nullptr;

  void beginEvent(WebSocketsServer *server, const char *evt, char *buff, size_t buffSize);
  void closeEvent();
  void endEvent(uint8_t clientNum = 255);  // 255 = broadcast à tous les clients
};

#endif // wresp_h
