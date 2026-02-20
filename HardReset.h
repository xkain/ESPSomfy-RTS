
#ifndef HARD_RESET_H
#define HARD_RESET_H

#include <Arduino.h>
#include <LittleFS.h>
#include <nvs_flash.h>
#include <Preferences.h>
#include "Somfy.h"

#define MAX_BOOT_CYCLES 3
#define BOOT_TIMEOUT 5000

extern SomfyShadeController somfy;

void performFactoryReset() {
  Serial.println(F("\n!!! INITIALISATION DU FORMATAGE PHYSIQUE !!!"));
  somfy.end();
  nvs_flash_erase();
  nvs_flash_init();
  Serial.println(F("Partition NVS : FORMATÉE"));
  const char* targets[] = {"/shades.cfg", "/shades.cfg.bak", "/controller.backup"};
  for (const char* t : targets) {
    if (LittleFS.exists(t)) {
      if(LittleFS.remove(t)) Serial.printf("Fichier supprimé : %s\n", t);
    }
  }
  Serial.println(F("RESET TOTAL RÉUSSI. Redémarrage dans 2s..."));
  delay(2000);
  ESP.restart();
}
void handlePowerCycleReset() {
  Preferences bootPrefs;
  bootPrefs.begin("boot_counter", false);

  int count = bootPrefs.getInt("count", 0);
  count++;
  Serial.printf("\n--- Compteur de démarrage : %d/%d ---\n", count, MAX_BOOT_CYCLES);
  if (count >= MAX_BOOT_CYCLES) {
    bootPrefs.putInt("count", 0);
    bootPrefs.end();
    performFactoryReset();
  } else {
    bootPrefs.putInt("count", count);
    bootPrefs.end();

    delay(BOOT_TIMEOUT);
    bootPrefs.begin("boot_counter", false);
    bootPrefs.putInt("count", 0);
    bootPrefs.end();
    Serial.println(F("Boot validé : Compteur réinitialisé à 0."));
  }
}
#endif
