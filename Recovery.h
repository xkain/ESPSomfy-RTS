#ifndef RECOVERY_H
#define RECOVERY_H

#include <Arduino.h>
#include <LittleFS.h>
#include <nvs_flash.h>
#include <Preferences.h>
#include <sdkconfig.h>
#include <WiFi.h>
#include "Somfy.h"
#include "ConfigSettings.h"

#define NET_RECOVERY_CYCLES 3
#define FULL_FACTORY_CYCLES 6
#define BOOT_TIMEOUT 5000

#if defined(CONFIG_IDF_TARGET_ESP32) && !defined(CONFIG_IDF_TARGET_ESP32S2) && !defined(CONFIG_IDF_TARGET_ESP32S3) && !defined(CONFIG_IDF_TARGET_ESP32C3) && !defined(CONFIG_IDF_TARGET_ESP32C6)
#define LED_PIN 2
#else
#define LED_PIN -1
#endif

extern ConfigSettings settings;
extern SomfyShadeController somfy;

bool _pendingNetSecuRecovery = false;
bool _pendingFactory = false;

void visualFeedback(int durationMs, int speedMs) {
  if (LED_PIN == -1) { delay(durationMs); return; }
  unsigned long start = millis();
  while (millis() - start < durationMs) {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    delay(speedMs);
  }
}
void handlePowerCycleReset() {
  if (LED_PIN != -1) pinMode(LED_PIN, OUTPUT);

  Preferences p;
  p.begin("rst_logic", false);
  int count = p.getInt("c", 0) + 1;
  p.putInt("c", count);
  p.end();
  Serial.printf("\n[BOOT] Cycle : %d\n", count);
  int flashSpeed = 0; // 0 = Fixe
  if (count == 3) flashSpeed = 150;
  else if (count >= 6) flashSpeed = 50;
  unsigned long startWait = millis();
  while (millis() - startWait < BOOT_TIMEOUT) {
    if (LED_PIN != -1) {
      if (flashSpeed > 0) {
        digitalWrite(LED_PIN, !digitalRead(LED_PIN));
        delay(flashSpeed);
      } else {
        digitalWrite(LED_PIN, HIGH);
        delay(100);
      }
    } else {
      delay(100);
    }
  }
  p.begin("rst_logic", false);
  p.putInt("c", 0);
  p.end();

  if (LED_PIN != -1) digitalWrite(LED_PIN, LOW);
  if (count >= 6) {
    _pendingFactory = true;
    Serial.println(F("Action : Factory Reset programmé."));
  }
  else if (count == 3) {
    _pendingNetSecuRecovery = true;
    Serial.println(F("Action : Network Recovery programmé."));
  }

  Serial.println(F("Boot validé."));
}
void resetAccessAndNetworkConfig() {
  if (!_pendingNetSecuRecovery) return;

  Serial.println(F("\n--- ACTION : RESET RÉSEAU & SÉCURITÉ ---"));
  if (LED_PIN != -1) {
    for (int i = 0; i < 20; i++) { digitalWrite(LED_PIN, !digitalRead(LED_PIN)); delay(50); }
  }

  settings.connType = conn_types_t::unset;
  memset(settings.WIFI.ssid, 0, sizeof(settings.WIFI.ssid));
  memset(settings.WIFI.passphrase, 0, sizeof(settings.WIFI.passphrase));
  settings.IP.dhcp = true;
  settings.Security.type = security_types::None;

  settings.save();
  settings.WIFI.save();
  settings.IP.save();
  settings.Security.save();

  WiFi.disconnect(true, true);
  Serial.println(F("Redémarrage..."));
  delay(1000);
  ESP.restart();
}

void performFactoryReset() {
  Serial.println(F("\n!!! INITIALISATION DU FORMATAGE PHYSIQUE !!!"));
  if (LED_PIN != -1) {
    for (int i = 0; i < 40; i++) { digitalWrite(LED_PIN, !digitalRead(LED_PIN)); delay(30); }
  }
  somfy.end();
  nvs_flash_erase();
  nvs_flash_init();
  const char* targets[] = {"/shades.cfg", "/shades.cfg.bak", "/controller.backup"};
  for (const char* t : targets) {
    if (LittleFS.exists(t)) LittleFS.remove(t);
  }
  Serial.println(F("RESET TOTAL RÉUSSI."));
  delay(2000);
  ESP.restart();
}

#endif
