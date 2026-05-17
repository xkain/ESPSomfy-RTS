#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <esp_task_wdt.h>
#include "ConfigSettings.h"
#include "MQTT.h"
#include "Somfy.h"
#include "Network.h"
#include "Utils.h"

WiFiClient tcpClient;
PubSubClient mqttClient(tcpClient);

#define MQTT_MAX_RESPONSE 2048
static char g_content[MQTT_MAX_RESPONSE];

extern ConfigSettings settings;
extern SomfyShadeController somfy;
extern Network net;
extern rebootDelay_t rebootDelay;

const char* MQTTClass::makeTopic(const char* topic) {
  static char top[128];
  if (settings.MQTT.rootTopic[0] != '\0') {
    snprintf(top, sizeof(top), "%s/%s", settings.MQTT.rootTopic, topic);
  } else {
    strlcpy(top, topic, sizeof(top));
  }
  return top;
}

bool MQTTClass::begin() { this->suspended = false; return true; }
bool MQTTClass::end() { this->suspended = true; this->disconnect(); return true; }
void MQTTClass::reset() { this->disconnect(); this->lastConnect = 0; this->connect(); }

bool MQTTClass::loop() {
  if(settings.MQTT.enabled && !rebootDelay.reboot && !this->suspended && !mqttClient.connected()) {
    esp_task_wdt_reset();
    if(net.connected()) this->connect();
  }
  esp_task_wdt_reset();
  if(settings.MQTT.enabled) mqttClient.loop();
  return true;
}

void MQTTClass::receive(const char *topic, byte* payload, uint32_t length) {
  esp_task_wdt_reset();

  uint16_t len = strlen(topic);
  uint16_t ndx = len - 1;
  uint8_t slashes = 0;
  while(ndx > 0 && slashes < 4) {
    if(topic[ndx] == '/') slashes++;
    if(slashes < 4) ndx--;
  }

  char entityType[10], entityId[5], command[32], value[11];
  auto extract = [&](char* dest, size_t dlen) {
    while(ndx < len && topic[ndx] == '/') ndx++;
    size_t i = 0;
    while(ndx < len && topic[ndx] != '/' && i < dlen - 1) dest[i++] = topic[ndx++];
    dest[i] = '\0';
  };

  extract(entityType, sizeof(entityType));
  extract(entityId, sizeof(entityId));
  extract(command, sizeof(command));

  size_t vlen = (length < sizeof(value) - 1) ? length : sizeof(value) - 1;
  memcpy(value, payload, vlen);
  value[vlen] = '\0';
  int val = atoi(value);

  if(strcmp(entityType, "shades") == 0) {
    SomfyShade* shade = somfy.getShadeById(atoi(entityId));
    if (shade) {
      if(strcmp(command, "target") == 0) shade->moveToTarget(shade->transformPosition(val));
      else if(strcmp(command, "tiltTarget") == 0) shade->moveToTiltTarget(val);
      else if(strcmp(command, "direction") == 0) {
        if(val < 0) shade->sendCommand(somfy_commands::Up);
        else if(val > 0) shade->sendCommand(somfy_commands::Down);
        else shade->sendCommand(somfy_commands::My);
      }
      else if(strcmp(command, "mypos") == 0) shade->setMyPosition(val);
      else if(strcmp(command, "myTiltPos") == 0) shade->setMyPosition(shade->myPos, val);
      else if(strcmp(command, "sunFlag") == 0) shade->sendCommand(val > 0 ? somfy_commands::SunFlag : somfy_commands::Flag);
      else if(strcmp(command, "position") == 0) {
        shade->target = shade->currentPos = shade->transformPosition((float)val);
        shade->emitState();
      }
      else if(strcmp(command, "tiltPosition") == 0) {
        shade->tiltTarget = shade->currentTiltPos = (float)val;
        shade->emitState();
      }
      else if(strcmp(command, "sunny") == 0) shade->sendSensorCommand(-1, val, shade->repeats);
      else if(strcmp(command, "windy") == 0) shade->sendSensorCommand(val, -1, shade->repeats);
    }
  }
  else if(strcmp(entityType, "groups") == 0) {
    SomfyGroup* group = somfy.getGroupById(atoi(entityId));
    if (group) {
      if(strcmp(command, "direction") == 0) {
        if(val < 0) group->sendCommand(somfy_commands::Up);
        else if(val > 0) group->sendCommand(somfy_commands::Down);
        else group->sendCommand(somfy_commands::My);
      }
      else if(strcmp(command, "sunFlag") == 0) group->sendCommand(val > 0 ? somfy_commands::Flag : somfy_commands::SunFlag);
      else if(strcmp(command, "sunny") == 0) group->sendSensorCommand(-1, val, group->repeats);
      else if(strcmp(command, "windy") == 0) group->sendSensorCommand(val, -1, group->repeats);
    }
  }
  esp_task_wdt_reset();
}

bool MQTTClass::connect() {
  esp_task_wdt_reset();
  if(mqttClient.connected()) return true;
  if(!settings.MQTT.enabled || this->suspended || (this->lastConnect + 10000 > millis())) return false;

  uint64_t mac = ESP.getEfuseMac();
  snprintf(this->clientId, sizeof(this->clientId), "client-%08x%08x", (uint32_t)((mac >> 32) & 0xFFFFFFFF), (uint32_t)(mac & 0xFFFFFFFF));

  mqttClient.setServer(settings.MQTT.hostname, settings.MQTT.port);
  if(mqttClient.connect(this->clientId, settings.MQTT.username, settings.MQTT.password, makeTopic("status"), 0, true, "offline")) {
    this->publish("status", "online", true);
    this->publish("ipAddress", settings.IP.ip.toString().c_str(), true);
    this->publish("host", settings.hostname, true);
    this->publish("firmware", settings.fwVersion.name, true);
    this->publish("serverId", settings.serverId, true);
    this->publish("mac", net.mac);
    somfy.publish();

    this->subscribe("shades/+/target/set");
    this->subscribe("shades/+/tiltTarget/set");
    this->subscribe("shades/+/direction/set");
    this->subscribe("shades/+/mypos/set");
    this->subscribe("shades/+/myTiltPos/set");
    this->subscribe("shades/+/sunFlag/set");
    this->subscribe("shades/+/sunny/set");
    this->subscribe("shades/+/windy/set");
    this->subscribe("shades/+/position/set");
    this->subscribe("shades/+/tiltPosition/set");
    this->subscribe("groups/+/direction/set");
    this->subscribe("groups/+/sunFlag/set");
    this->subscribe("groups/+/sunny/set");
    this->subscribe("groups/+/windy/set");

    mqttClient.setCallback(MQTTClass::receive);
    this->lastConnect = millis();
    return true;
  }
  return false;
}

bool MQTTClass::disconnect() {
  if(mqttClient.connected()) {
    this->unsubscribe("shades/+/target/set");
    this->unsubscribe("shades/+/direction/set");
    this->unsubscribe("shades/+/tiltTarget/set");
    this->unsubscribe("shades/+/mypos/set");
    this->unsubscribe("shades/+/myTiltPos/set");
    this->unsubscribe("shades/+/sunFlag/set");
    this->unsubscribe("groups/+/direction/set");
    this->unsubscribe("shades/+/sunny/set");
    this->unsubscribe("shades/+/windy/set");
    this->unsubscribe("shades/+/position/set");
    this->unsubscribe("shades/+/tiltPosition/set");
    this->unsubscribe("groups/+/direction/set");
    this->unsubscribe("groups/+/sunFlag/set");
    this->unsubscribe("groups/+/sunny/set");
    this->unsubscribe("groups/+/windy/set");
    mqttClient.disconnect();
  }
  return true;
}

bool MQTTClass::subscribe(const char *topic) {
  if(!mqttClient.connected()) return false;
  esp_task_wdt_reset();
  return mqttClient.subscribe(makeTopic(topic));
}

bool MQTTClass::unsubscribe(const char *topic) {
  if(!mqttClient.connected()) return false;
  return mqttClient.unsubscribe(makeTopic(topic));
}

bool MQTTClass::publish(const char *topic, const char *payload, bool retain) {
  if(!mqttClient.connected()) return false;
  esp_task_wdt_reset();
  return mqttClient.publish(makeTopic(topic), payload, retain);
}

bool MQTTClass::unpublish(const char *topic) {
  if(!mqttClient.connected()) return false;
  esp_task_wdt_reset();
  return mqttClient.publish(makeTopic(topic), (const uint8_t *)"", 0, true);
}

bool MQTTClass::publish(const char *topic, uint32_t val, bool retain) { itoa(val, g_content, 10); return this->publish(topic, g_content, retain); }
bool MQTTClass::publish(const char *topic, uint8_t val, bool retain) { itoa(val, g_content, 10); return this->publish(topic, g_content, retain); }
bool MQTTClass::publish(const char *topic, uint16_t val, bool retain) { itoa(val, g_content, 10); return this->publish(topic, g_content, retain); }
bool MQTTClass::publish(const char *topic, int8_t val, bool retain) { itoa(val, g_content, 10); return this->publish(topic, g_content, retain); }
bool MQTTClass::publish(const char *topic, bool val, bool retain) { return this->publish(topic, val ? "true" : "false", retain); }

bool MQTTClass::publishBuffer(const char *topic, uint8_t *data, uint16_t len, bool retain) {
  if(!mqttClient.connected()) return false;
  esp_task_wdt_reset();
  mqttClient.beginPublish(makeTopic(topic), len, retain);
  mqttClient.write(data, len);
  return mqttClient.endPublish();
}

bool MQTTClass::publishDisco(const char *topic, JsonObject &obj, bool retain) {
  serializeJson(obj, g_content, sizeof(g_content));
  return this->publishBuffer(topic, (uint8_t *)g_content, strlen(g_content), retain);
}

bool MQTTClass::connected() { return settings.MQTT.enabled && mqttClient.connected(); }
