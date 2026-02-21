#ifndef HARD_RESET_H
#define HARD_RESET_H

#include <Arduino.h>
#include <LittleFS.h>
#include <nvs_flash.h>
#include <Preferences.h>
#include "Somfy.h"

#define MAX_BOOT_CYCLES 3
#define BOOT_TIMEOUT 5000
#define LED_PIN 2

extern SomfyShadeController somfy;

void performFactoryReset() {
  Serial.println(F("\n!!! INITIALISATION DU FORMATAGE PHYSIQUE !!!"));

  for (int i = 0; i < 25; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(40);
    digitalWrite(LED_PIN, LOW);
    delay(40);
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
  pinMode(LED_PIN, OUTPUT);

  Preferences bootPrefs;
  bootPrefs.begin("boot_counter", false);

  int count = bootPrefs.getInt("count", 0);
  count++;

  Serial.printf("\n--- Compteur de démarrage : %d/%d ---\n", count, MAX_BOOT_CYCLES);

  bootPrefs.putInt("count", count);
  bootPrefs.end();
  Serial.println(F("Fenêtre de reset ouverte (5s)..."));
  for (int i = 0; i < (BOOT_TIMEOUT / 500); i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(250);
    digitalWrite(LED_PIN, LOW);
    delay(250);
  }
  digitalWrite(LED_PIN, LOW);
  if (count >= MAX_BOOT_CYCLES) {
    bootPrefs.begin("boot_counter", false);
    bootPrefs.putInt("count", 0);
    bootPrefs.end();

    performFactoryReset();
  } else {
    bootPrefs.begin("boot_counter", false);
    bootPrefs.putInt("count", 0);
    bootPrefs.end();

    digitalWrite(LED_PIN, LOW);
    Serial.println(F("Boot validé : LED éteinte."));
  }
}

#endif
