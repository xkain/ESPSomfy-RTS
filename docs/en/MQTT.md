This page describes **what travels over MQTT** once the broker is connected: the topics
the device publishes, the ones it subscribes to so it can take your commands, and auto-discovery.
The broker **settings** (address, port, credentials) are set in the interface, in the
**Network → MQTT** tab.

> [!TIP]
> Looking for the HTTP API or Home Assistant instead? See
> [Integrations](Integrations.md#rest-interface-api) and [Home Assistant](Home-Assistant.md).

ESPSomfy-RTS publishes attributes to your MQTT broker and subscribes to topics that let you control the shades. To enable your broker, connect it in the configuration pages under the MQTT section. This starts reporting the shades' state to your broker under the topic you assigned.

<img width="100%" src="https://github.com/user-attachments/assets/eef86440-13ab-4285-8763-f5bb79046dcf" />

# Published topics
ESPSomfy RTS publishes information about the configured shades and groups in a hierarchical tree of topics. All ESPSomfy RTS topics are published under a root topic that you set in the configuration.
At start-up, every topic is published, but after that ESPSomfy RTS only publishes data when something changes. So you can subscribe to the topic and get real-time updates. Although a full list of the available topics is given below, it's strongly recommended to use a tool such as **MQTT Explorer** while you develop. It will save you many hours of trial and error.


## 1. System information (read-only)

| MQTT topic | Description |
| :--- | :--- |
| `[root topic]/status` | The MQTT client's **Last Will and Testament (LWT)**. `online` if the device is connected, `offline` if it is disconnected. |
| `[root topic]/mac` | **MAC address** of the device's network adapter. |
| `[root topic]/ipAddress` | **IP address** assigned to the ESPSomfy RTS device. |
| `[root topic]/host` | **Hostname** assigned to the device. |
| `[root topic]/firmware` | **Firmware version** currently installed. |
| `[root topic]/serverId` | **Unique identifier** derived from the ESP32 chip ID. |


## 2. Device state (Shades — read-only)

### Identification and configuration
| MQTT topic | Description |
| :--- | :--- |
| `[root topic]/shades/[shadeId]/shadeId` | The shade's numeric ID. |
| `[root topic]/shades/[shadeId]/name` | The name set for the shade. |
| `[root topic]/shades/[shadeId]/remoteAddress` | The radio address assigned to the shade. |
| `[root topic]/shades/[shadeId]/shadeType` | **Shade type**: <br> `0` = Roller shade, `1` = Blind, `2` = Drapery (left), `3` = Awning, `4` = Shutter, `5` = Garage (1-button), `6` = Garage (3-button), `7` = Drapery (right), `8` = Drapery (center), `9` = Dry contact, `10` = Dry contact (2-button), `11` = Gate (left), `12` = Gate (center), `13` = Gate (right), `14` = Gate (1-button left), `15` = Gate (1-button center), `16` = Gate (1-button right) |

| `[root topic]/shades/[shadeId]/tiltType` | **Tilt type** (for blinds): <br> `0` = None, `1` = Tilt motor, `2` = Integrated tilt, `3` = Tilt only. |
| `[root topic]/shades/[shadeId]/flipCommands` | Whether the commands are inverted (Up=Down). `true` or `false`. |
| `[root topic]/shades/[shadeId]/flipPosition` | Whether 100% means open or closed. `true` or `false`. |



### Movement and position
| MQTT topic | Description |
| :--- | :--- |
| `[root topic]/shades/[shadeId]/position` | Current lift position as a percentage (0-100%). |
| `[root topic]/shades/[shadeId]/tiltPosition` | Current tilt position as a percentage (0-100%). |
| `[root topic]/shades/[shadeId]/direction` | **Current direction**: `-1` (going up), `0` (stopped), `1` (going down). |
| `[root topic]/shades/[shadeId]/target` | Target lift position the shade is trying to reach. |
| `[root topic]/shades/[shadeId]/tiltTarget` | Target tilt position the shade is trying to reach. |
| `[root topic]/shades/[shadeId]/lastRollingCode` | The rolling code used for the last command sent. |
| `[root topic]/shades/[shadeId]/mypos` | Current favourite position (lift). `-1` if not set. |
| `[root topic]/shades/[shadeId]/myTiltPos` | Current favourite position (tilt). `-1` if not set. |


### Sensors
| MQTT topic | Description |
| :--- | :--- |
| `[root topic]/shades/[shadeId]/sunSensor` | Whether a sun sensor exists (`true`/`false`). |
| `[root topic]/shades/[shadeId]/sunFlag` | Whether the sun sensor is enabled (`0` or `1`). |
| `[root topic]/shades/[shadeId]/sunny` | Whether the shade considers it sunny (`0` or `1`). |
| `[root topic]/shades/[shadeId]/windy` | Whether the shade considers it windy (`0` or `1`). |


## 3. Group state (Groups — read-only)

| MQTT topic | Description |
| :--- | :--- |
| `[root topic]/groups/[groupId]/groupId` | The group's identifier. |
| `[root topic]/groups/[groupId]/name` | The name set for the group. |
| `[root topic]/groups/[groupId]/remoteAddress` | The radio address assigned to the group. |
| `[root topic]/groups/[groupId]/direction` | Direction the members are moving: `-1` (going up), `0` (stopped), `1` (going down). |
| `[root topic]/groups/[groupId]/lastRollingCode` | The last rolling code used for the group. |
| `[root topic]/groups/[groupId]/sunSensor` | Whether at least one group member has a sun sensor (`true`/`false`). |
| `[root topic]/groups/[groupId]/sunFlag` | Sun sensor enabled for at least one group member (`0` or `1`). |
| `[root topic]/groups/[groupId]/sunny` | Whether the group considers it sunny (`0` or `1`). |
| `[root topic]/groups/[groupId]/windy` | Whether the group considers it windy (`0` or `1`). |


---
# Subscribed topics
ESPSomfy-RTS subscribes to topics on your MQTT broker. These topics are acted on immediately, so don't set a retain flag or a QoS above 0 on them. Otherwise, when it connects to the broker, ESPSomfy-RTS will resend those commands, causing malfunctions. Likewise, don't publish to the topics ESPSomfy-RTS publishes. Those topics are read-only: you should only subscribe to them. Publishing data to them will cause you serious problems.

>[!CAUTION]
>Using a retain flag or a high QoS makes the commands resend automatically every time ESPSomfy RTS reconnects to the broker, leading to unpredictable behaviour.



### Individual control
| MQTT topic | Value (payload) | Action |
| :--- | :--- | :--- |
| `[root topic]/shades/[shadeId]/direction/set` | `-1`, `0`, `1` | Moves the shade in a direction: -1 (Up), 1 (Down), 0 (Stop or Toggle). |
| `[root topic]/shades/[shadeId]/target/set` | `0` to `100` | Moves to X% (0 = Open, 100 = Closed). |
| `[root topic]/shades/[shadeId]/tiltTarget/set` | `0` to `100` | Tilts to X% (0 = Open, 100 = Closed). |
| `[root topic]/shades/[shadeId]/mypos/set` | `0` to `100` | Sets the "My" position, or clears it if the value is the same as the current one. |
| `[root topic]/shades/[shadeId]/myTiltPos/set` | `0` to `100` | Sets the "My" tilt, or clears it if the value is the same. |
| `[root topic]/shades/[shadeId]/position/set` | `0` to `100` | **Syncs** the current position (no motor movement). |
| `[root topic]/shades/[shadeId]/tiltPosition/set` | `0` to `100` | **Syncs** the current tilt (no motor movement). |
| `[root topic]/shades/[shadeId]/sunFlag/set` | `0`, `1` | Enables (1) or disables (0) the sun sensor. |
| `[root topic]/shades/[shadeId]/sunny/set` | `0`, `1` | Sets the sensor state to Sunny (1) or not (0). |
| `[root topic]/shades/[shadeId]/windy/set` | `0`, `1` | Sets the sensor state to Windy (1) or Calm (0). |


### Group control
| MQTT topic | Value (payload) | Action |
| :--- | :--- | :--- |
| `[root topic]/groups/[groupId]/direction/set` | `-1`, `0`, `1` | Moves every member of the group: -1 (Up), 1 (Down), 0 (Stop or Toggle). |
| `[root topic]/groups/[groupId]/sunFlag/set` | `0`, `1` | Enables/disables the sun function for the group. |
| `[root topic]/groups/[groupId]/sunny/set` | `0`, `1` | Sets the sun state for every motor in the group. |
| `[root topic]/groups/[groupId]/windy/set` | `0`, `1` | Sets the wind state for every motor in the group. |

# MQTT auto-discovery
ESPSomfy RTS supports MQTT auto-discovery. However, if you use **Home Assistant**, it's strongly recommended to use the dedicated [ESPSomfy-RTS-enhanced](https://github.com/xkain/ESPSomfy-RTS-enhanced) integration. It offers far more features, including better sensor handling. For other platforms that support MQTT auto-discovery, this option gets you going very quickly.

### Configuration
1. Go to the **Network** section of the configuration interface.
2. Tick the **Publish Discovery** option.
3. Enter the **root discovery topic** in the field provided.

<img width="100%" alt="Screenshot_20261014_231259" src="https://github.com/user-attachments/assets/397d9a98-61a3-4d3b-adc2-c720075a65fb" />

---

**Related pages:** [Integrations](Integrations.md) for the REST API and WebSockets ·
[Home Assistant](Home-Assistant.md) for the dedicated integration.
