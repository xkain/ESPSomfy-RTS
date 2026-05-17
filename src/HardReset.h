#ifndef HARD_RESET_H
#define HARD_RESET_H

#include <Arduino.h>
#include <LittleFS.h>
#include <nvs_flash.h>
#include <Preferences.h>
#include <sdkconfig.h>
#include "Somfy.h"

#define MAX_BOOT_CYCLES 4
#define BOOT_TIMEOUT 5000

// --- LOGIQUE DE DÉTECTION HARDWARE ---
// On n'active le GPIO 2 que pour l'ESP32 original (Dual Core classique).
// Pour S2, S3, C3, etc., LED_PIN sera -1 pour éviter tout conflit.
#if defined(CONFIG_IDF_TARGET_ESP32) && !defined(CONFIG_IDF_TARGET_ESP32S2) && !defined(CONFIG_IDF_TARGET_ESP32S3) && !defined(CONFIG_IDF_TARGET_ESP32C3) && !defined(CONFIG_IDF_TARGET_ESP32C6)
#define LED_PIN 2
#else
#define LED_PIN -1
#endif

extern SomfyShadeController somfy;

void performFactoryReset() {
  Serial.println(F("\n!!! INITIALISATION DU FORMATAGE PHYSIQUE !!!"));

  // Clignotement rapide uniquement si la LED est définie
  if (LED_PIN != -1) {
    for (int i = 0; i < 25; i++) {
      digitalWrite(LED_PIN, HIGH); delay(40);
      digitalWrite(LED_PIN, LOW); delay(40);
    }
  }
  somfy.end();

  nvs_flash_erase();
  nvs_flash_init();

  const char* targets[] = {"/shades.cfg", "/shades.cfg.bak", "/controller.backup"};
  for (const char* t : targets) {
    if (LittleFS.exists(t)) {
      if(LittleFS.remove(t)) Serial.printf("Fichier supprimé : %s\n", t);
    }
  }
  Serial.println(F("RESET TOTAL RÉUSSI. Redémarrage dans 2s......"));
  delay(2000);
  ESP.restart();
}
void handlePowerCycleReset() {
  if (LED_PIN != -1) pinMode(LED_PIN, OUTPUT);
  Preferences bootPrefs;
  bootPrefs.begin("boot_counter", false);
  int count = bootPrefs.getInt("count", 0);
  count++;
  Serial.printf("\n--- Compteur de démarrage : %d/%d ---\n", count, MAX_BOOT_CYCLES);
  bootPrefs.putInt("count", count);
  bootPrefs.end();

  Serial.println(F("Fenêtre de reset ouverte (5s)..."));

  // Gestion du délai de 5 secondes
  unsigned long startWait = millis();
  while (millis() - startWait < BOOT_TIMEOUT) {
    if (LED_PIN != -1) {
      digitalWrite(LED_PIN, HIGH); delay(250);
      digitalWrite(LED_PIN, LOW); delay(250);
    } else {
      // Si pas de LED (S3, C3...), on attend juste sans rien faire clignoter
      delay(100);
    }
  }
  bootPrefs.begin("boot_counter", false);
  bootPrefs.putInt("count", 0);
  bootPrefs.end();

  if (count >= MAX_BOOT_CYCLES) {
    performFactoryReset();
  } else {
    if (LED_PIN != -1) digitalWrite(LED_PIN, LOW);
    Serial.println(F("Boot validé."));
  }
}

#endif
