#include "WResp.h"
#include <esp_task_wdt.h>  // esp_task_wdt_reset() — inclus ici et non dans WResp.h
// pour ne pas propager le symbole à tout le projet.

// ─────────────────────────────────────────────
// Macro WDT : reset + yield entre opérations longues.
// Même macro que dans Sockets.cpp pour cohérence.
// ─────────────────────────────────────────────
#define WDT_FEED() do { esp_task_wdt_reset(); yield(); } while(0)

/*********************************************************************
 * JsonSockEvent members
 ********************************************************************/
void JsonSockEvent::beginEvent(WebSocketsServer *server, const char *evt, char *buff, size_t buffSize) {
  this->server   = server;
  this->buff     = buff;
  this->buffSize = buffSize;
  this->_nocomma = true;
  this->_closed  = false;
  snprintf(this->buff, buffSize, "42[%s,", evt);
}

void JsonSockEvent::closeEvent() {
  if(!this->_closed) {
    if(strlen(this->buff) < this->buffSize)
      strcat(this->buff, "]");
    else
      this->buff[this->buffSize - 1] = ']';
  }
  this->_nocomma = true;
  this->_closed  = true;
}

void JsonSockEvent::endEvent(uint8_t num) {
  this->closeEvent();
  WDT_FEED();
  if(num == 255) this->server->broadcastTXT(this->buff);
  else           this->server->sendTXT(num, this->buff);
  WDT_FEED();
}

void JsonSockEvent::_safecat(const char *val, bool escape) {
  size_t len = (escape ? this->calcEscapedLength(val) : strlen(val)) + strlen(this->buff);
  if(escape) len += 2;
  if(len >= this->buffSize) {
    Serial.printf("Socket exceeded buffer size %u - needed %u\n", (unsigned)this->buffSize, (unsigned)len);
    Serial.println(this->buff);
    return;
  }
  if(escape) strcat(this->buff, "\"");
  if(escape) this->escapeString(val, &this->buff[strlen(this->buff)]);
  else       strcat(this->buff, val);
  if(escape) strcat(this->buff, "\"");
}

/*********************************************************************
 * JsonResponse members
 ********************************************************************/
void JsonResponse::beginResponse(WebServer *server, char *buff, size_t buffSize) {
  this->server   = server;
  this->buff     = buff;
  this->buffSize = buffSize;
  this->buff[0]  = 0x00;
  this->_nocomma = true;
  this->_headersSent = false;
  server->setContentLength(CONTENT_LENGTH_UNKNOWN);
}

void JsonResponse::endResponse() {
  if(strlen(this->buff)) this->send();
  WDT_FEED();
  server->sendContent("", 0);
}

void JsonResponse::send() {
  WDT_FEED();
  if(!this->_headersSent) server->send_P(200, "application/json", this->buff);
  else                    server->sendContent(this->buff);
  this->buff[0]      = 0x00;
  this->_headersSent = true;
  WDT_FEED();
}

void JsonResponse::_safecat(const char *val, bool escape) {
  size_t len = (escape ? this->calcEscapedLength(val) : strlen(val)) + strlen(this->buff);
  if(escape) len += 2;
  if(len >= this->buffSize) {
    // Buffer plein : on flush vers le client avant de continuer.
    this->send();
    // Après send(), buff est vidé. On vérifie quand même que la
    // valeur seule tient dans le buffer (cas d'une valeur géante).
    len = (escape ? this->calcEscapedLength(val) : strlen(val));
    if(escape) len += 2;
    if(len >= this->buffSize) {
      Serial.printf("JsonResponse: value too large for buffer (%u > %u), skipping\n",
                    (unsigned)len, (unsigned)this->buffSize);
      return;
    }
  }
  if(escape) strcat(this->buff, "\"");
  if(escape) this->escapeString(val, &this->buff[strlen(this->buff)]);
  else       strcat(this->buff, val);
  if(escape) strcat(this->buff, "\"");
}

/*********************************************************************
 * JsonFormatter members
 ********************************************************************/
void JsonFormatter::beginObject(const char *name) {
  if(name && strlen(name) > 0) this->appendElem(name);
  else if(!this->_nocomma)     this->_safecat(",");
  this->_safecat("{");
  this->_objects++;
  this->_nocomma = true;
}

void JsonFormatter::endObject() {
  this->_safecat("}");
  this->_objects--;
  this->_nocomma = false;
}

void JsonFormatter::beginArray(const char *name) {
  if(name && strlen(name) > 0) this->appendElem(name);
  else if(!this->_nocomma)     this->_safecat(",");
  this->_safecat("[");
  this->_arrays++;
  this->_nocomma = true;
}

void JsonFormatter::endArray() {
  this->_safecat("]");
  this->_arrays--;
  this->_nocomma = false;
}

void JsonFormatter::appendElem(const char *name) {
  if(!this->_nocomma) this->_safecat(",");
  if(name && strlen(name) > 0) {
    this->_safecat(name, true);
    this->_safecat(":");
  }
  this->_nocomma = false;
}

// ── Surcharges sans nom ─────────────────────────────────────────────
void JsonFormatter::addElem(const char *val)      { this->addElem(nullptr, val); }
void JsonFormatter::addElem(bool bval)             { strcpy(this->_numbuff, bval ? "true" : "false"); this->_appendNumber(nullptr); }
void JsonFormatter::addElem(float fval)            { sprintf(this->_numbuff, "%.4f",             fval);                    this->_appendNumber(nullptr); }
void JsonFormatter::addElem(int8_t nval)           { sprintf(this->_numbuff, "%d",               nval);                    this->_appendNumber(nullptr); }
void JsonFormatter::addElem(uint8_t nval)          { sprintf(this->_numbuff, "%u",               nval);                    this->_appendNumber(nullptr); }
void JsonFormatter::addElem(int16_t nval)          { sprintf(this->_numbuff, "%d",               nval);                    this->_appendNumber(nullptr); }
void JsonFormatter::addElem(uint16_t nval)         { sprintf(this->_numbuff, "%u",               nval);                    this->_appendNumber(nullptr); }
void JsonFormatter::addElem(int32_t nval)          { sprintf(this->_numbuff, "%ld",  (long)      nval);                    this->_appendNumber(nullptr); }
void JsonFormatter::addElem(uint32_t nval)         { sprintf(this->_numbuff, "%lu",  (unsigned long)nval);                 this->_appendNumber(nullptr); }
void JsonFormatter::addElem(int64_t lval)          { sprintf(this->_numbuff, "%lld", (long long) lval);                    this->_appendNumber(nullptr); }
void JsonFormatter::addElem(uint64_t lval)         { sprintf(this->_numbuff, "%llu", (unsigned long long)lval);            this->_appendNumber(nullptr); }

// ── Surcharges avec nom ─────────────────────────────────────────────
void JsonFormatter::addElem(const char *name, const char *val) {
  if(!val) return;
  this->appendElem(name);
  this->_safecat(val, true);
}
void JsonFormatter::addElem(const char *name, bool bval)        { strcpy(this->_numbuff, bval ? "true" : "false");          this->_appendNumber(name); }
void JsonFormatter::addElem(const char *name, float fval)       { sprintf(this->_numbuff, "%.4f",             fval);        this->_appendNumber(name); }
void JsonFormatter::addElem(const char *name, int8_t nval)      { sprintf(this->_numbuff, "%d",               nval);        this->_appendNumber(name); }
void JsonFormatter::addElem(const char *name, uint8_t nval)     { sprintf(this->_numbuff, "%u",               nval);        this->_appendNumber(name); }
void JsonFormatter::addElem(const char *name, int16_t nval)     { sprintf(this->_numbuff, "%d",               nval);        this->_appendNumber(name); }
void JsonFormatter::addElem(const char *name, uint16_t nval)    { sprintf(this->_numbuff, "%u",               nval);        this->_appendNumber(name); }
void JsonFormatter::addElem(const char *name, int32_t nval)     { sprintf(this->_numbuff, "%ld",  (long)      nval);        this->_appendNumber(name); }
void JsonFormatter::addElem(const char *name, uint32_t nval)    { sprintf(this->_numbuff, "%lu",  (unsigned long)nval);     this->_appendNumber(name); }
void JsonFormatter::addElem(const char *name, int64_t lval)     { sprintf(this->_numbuff, "%lld", (long long) lval);        this->_appendNumber(name); }
void JsonFormatter::addElem(const char *name, uint64_t lval)    { sprintf(this->_numbuff, "%llu", (unsigned long long)lval);this->_appendNumber(name); }

/*********************************************************************
 * JsonFormatter private helpers
 ********************************************************************/
void JsonFormatter::_appendNumber(const char *name) {
  this->appendElem(name);
  this->_safecat(this->_numbuff);
}

void JsonFormatter::_safecat(const char *val, bool escape) {
  size_t len = (escape ? this->calcEscapedLength(val) : strlen(val)) + strlen(this->buff);
  if(escape) len += 2;
  if(len >= this->buffSize) return;
  if(escape) strcat(this->buff, "\"");
  if(escape) this->escapeString(val, &this->buff[strlen(this->buff)]);
  else       strcat(this->buff, val);
  if(escape) strcat(this->buff, "\"");
}

// BUG ORIGINAL CORRIGÉ : la boucle partait de strlen(raw) (= '\0')
// et s'arrêtait à i > 0, manquant raw[0] et comptant le '\0'.
// Correction : boucle de 0 à strlen(raw)-1 inclus.
uint32_t JsonFormatter::calcEscapedLength(const char *raw) {
  uint32_t len = 0;
  size_t rawLen = strlen(raw);
  for(size_t i = 0; i < rawLen; i++) {
    switch(raw[i]) {
      case '"':
      case '/':
      case '\b':
      case '\f':
      case '\n':
      case '\r':
      case '\t':
      case '\\':
        len += 2;   // caractère échappé = 2 octets
        break;
      default:
        len++;
        break;
    }
  }
  return len;
}

void JsonFormatter::escapeString(const char *raw, char *escaped) {
  size_t rawLen = strlen(raw);
  for(uint32_t i = 0; i < rawLen; i++) {
    switch(raw[i]) {
      case '"':  strcat(escaped, "\\\""); break;
      case '/':  strcat(escaped, "\\/");  break;
      case '\b': strcat(escaped, "\\b");  break;
      case '\f': strcat(escaped, "\\f");  break;
      case '\n': strcat(escaped, "\\n");  break;
      case '\r': strcat(escaped, "\\r");  break;
      case '\t': strcat(escaped, "\\t");  break;
      case '\\': strcat(escaped, "\\\\"); break;
      default: {
        size_t pos = strlen(escaped);
        escaped[pos]     = raw[i];
        escaped[pos + 1] = 0x00;
        break;
      }
    }
  }
}
