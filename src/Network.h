#ifndef Network_h
#define Network_h

#include <Arduino.h>

#define CONNECT_TIMEOUT 20000
#define SSID_SCAN_INTERVAL 30000

class Network {
protected:
  uint32_t lastEmit = 0;
  uint32_t lastMDNS = 0;
  int lastRSSI = 0;
  int lastChannel = 0;
  int linkSpeed = 0;
public:
  // Regroupement des booléens (Gain de place RAM/Alignement)
  bool _connecting = false;
  bool ethStarted = false;
  bool wifiFallback = false;
  bool softAPOpened = false;
  bool openingSoftAP = false;
  bool needsBroadcast = true;

  uint32_t lastWifiScan = 0;
  conn_types_t connType = conn_types_t::unset;
  conn_types_t connTarget = conn_types_t::unset;

  bool connected();
  bool connecting();
  void clearConnecting();
  conn_types_t preferredConnType();

  char ssid[33]; // SSID max 32 car. + \0
  char mac[18];  // MAC max 17 car. + \0

  int channel;
  int strength;
  int disconnected = 0;
  int connectAttempts = 0;
  uint32_t disconnectTime = 0;
  uint32_t connectStart = 0;
  uint32_t connectTime = 0;
  uint32_t connectedAt = 0;

  bool openSoftAP();
  bool connect(conn_types_t ctype);
  bool connectWiFi(const uint8_t *bssid = nullptr, const int32_t channel = -1);
  bool connectWired();
  void setConnected(conn_types_t connType);
  bool getStrongestAP(const char *ssid, uint8_t *bssid, int32_t *channel);
  bool changeAP(const uint8_t *bssid, const int32_t channel);
  void updateHostname();
  bool setup();
  void loop();
  void end();
  void emitSockets();
  void emitSockets(uint8_t num);
  void emitHeap(uint8_t num = 255);
  uint32_t getChipId();
  static void networkEvent(WiFiEvent_t event);
};
#endif
