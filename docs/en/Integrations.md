# Connectivity options available

ESPSomfy-RTS isn't just meant to offer a user interface: its main purpose is to act as an integration platform between your shades and other systems.

* **REST commands**: using HTTP commands (GET, POST, PUT) — **described on this page**.
* **Websockets**: real-time notifications when things move.
* **[MQTT](MQTT.md)**: a two-way connection for control and status feedback.
* **[Home Assistant](Home-Assistant.md)**: a native, "turnkey" integration (the project's main
  reason for being).

The last two have their own pages. The rest of this one documents the **REST interface**.


## REST interface (API)

The REST interface allows remote control over your Wi-Fi network. It uses two separate ports depending on what you need:

* **Port 80**: used for configuration and system status (can be secured with an `apikey`).
* **Port 8081**: dedicated to movement commands only (e.g. `shadeCommand`).



## Test your shades straight away (GET method)

You can test your shades by simply typing an address into your web browser (Chrome, Firefox, Safari).

### Example with your current configuration:
* **Example IP address**: `192.168.1.13`
* **Port**: `8081`
* **Shade ID**: `1`

| Action wanted | URL to paste into your browser |
| :--- | :--- |
| **Up** | `http://192.168.1.13:8081/shadeCommand?shadeId=1&command=up` |
| **Down** | `http://192.168.1.13:8081/shadeCommand?shadeId=1&command=down` |
| **Stop** | `http://192.168.1.13:8081/shadeCommand?shadeId=1&command=stop` |

> [!IMPORTANT]
> **Security**: if you turn on security in the settings, you'll need to provide an `apikey` in the HTTP header. In that case, a tool like **Postman** is essential for testing your requests.

---

## GET /controller

This command returns the controller's public configuration (limits and software versions, radio settings and current state).


| Parameter | Returns | Method | Port | Example URL |
| :--- | :--- | :--- | :--- | :--- |
| None | JSON |**GET** | `80` | `http://192.168.1.13:80/controller` |

### Parameters:
None

### Returns:
JSON

See the `GET /shades` endpoint for a description of the shade reference objects.

See the `GET /groups` endpoint for a description of the group reference objects.

<details>
<summary>Return example</summary>

```json
{
  "maxRooms": 16,
  "maxShades": 32,
  "maxGroups": 16,
  "maxGroupedShades": 32,
  "maxLinkedRemotes": 7,
  "startingAddress": 656296,
  
  
  "transceiver": {
    "config": {
      "type": 56,
      "TXPin": 13,
      "RXPin": 12,
      "SCKPin": 18,
      "MOSIPin": 23,
      "MISOPin": 19,
      "CSNPin": 5,
      "rxBandwidth": 99.97000122,
      "frequency": 433.4200134,
      "deviation": 47.59999847,
      "txPower": 10,
      "proto": 0,
      "enabled": true,
      "radioInit": true,
      "radioBoardType": 0
    }
  },
  "version": {
    "available": false,
    "status": 0,
    "error": 0,
    "cancelled": false,
    "checkForUpdate": true,
    "inetAvailable": true,
    "fwVersion": {
      "name": "v2.5.0",
      "major": 2,
      "minor": 5,
      "build": 1,
      "suffix": ""
    },
    "appVersion": {
      "name": "2.5.0",
      "major": 2,
      "minor": 5,
      "build": 0,
      "suffix": ""
    },
    "latest": {
      "name": "v2.5.0",
      "major": 2,
      "minor": 5,
      "build": 0,
      "suffix": ""
    }
  },
  "shades": [],
  "groups": []
}
```
</details>


## GET /discovery

Returns a discovery object containing the ESPSomfy-RTS device's unique identifier and firmware version. This endpoint is similar to `/controller` but doesn't contain the configuration information. Use it for lighter output. Shade and group references leave out the configuration data, and the transceiver configuration isn't included.


| Parameter | Returns | Method | Port | Example URL |
| :--- | :--- | :--- | :--- | :--- |
| None | JSON |**GET** | `8081` | `http://192.168.1.13:8081/discovery` |


* `authType` - The type of authentication required for a valid API key
   * `0` = No authentication
   * `1` = PIN entry
   * `2` = Username / password
* `permissions` - The bitmask of permissions granted at login
   * `0x00` - All permissions, including configuration
   * `0x01` - Only configuration functions require authentication



### Parameters
None

### Returns
JSON

* `authType` - The type of authentication required for a valid API key
   * `0` = No authentication
   * `1` = PIN entry
   * `2` = Username / password
* `permissions` - The bitmask of permissions granted at login
   * `0x00` - All permissions, including configuration
   * `0x01` - Only configuration functions require authentication

See the `GET /shades` endpoint for a description of the shade reference objects.

See the `GET /groups` endpoint for a description of the group reference objects.

<details>
<summary>Return Example</summary>

```json
{
  "serverId": "49E4AC",
  "version": "v2.5.0",
  "latest": "v2.5.0",
  "model": "ESPSomfyRTS",
  "hostname": "ESPSomfyRTS",
  "authType": 0,
  "permissions": 0,
  "chipModel": "",
  "connType": "Wifi",
  "checkForUpdate": true,
  "memory": {
    "max": 110580,
    "free": 164008,
    "min": 110924,
    "total": 266040
  },
  "shades": [],
  "groups": []
}
```
</details>

## GET|PUT|POST /groupCommand
Sends a command to a group.
This command controls every shade saved in a specific group at once. It's the ideal tool for global actions like "Close all the shades".


| Parameter | Returns | Method | Port | Example URL (Group 1) |
| :--- | :--- | :--- | :--- | :--- |
| `groupId`, `command` | JSON | **GET** | `8081` | `http://192.168.1.13:8081/groupCommand?groupId=1&command=down` |

### Parameters
* `groupId` - The ID of the group to send the command to [1-14].
* `command` - The command to send to the group.
    * `m | My | my` - My (favourite position)
    * `u | Up | up` - Up
    * `d | Down | down` - Down
* `repeat` - The number of repeats to send for the group. ESPSomfy RTS sends 1 frame plus 1 repeat, for a total of 2 frames.

`GET /groupCommand?groupId=1&command=up` - Moves every shade in the group to the fully open position.
`GET /groupCommand?groupId=1&command=my` - Moves every shade in the group that is currently still to its favourite position.

### Returns
JSON reference of the group.

## GET /groups
Gets an array of the groups configured on the device.


| Parameter | Returns | Method | Port | Example URL (Group 1) |
| :--- | :--- | :--- | :--- | :--- |
| None | JSON | **GET** | `8081` | `http://192.168.1.13:8081/groupCommand?groupId=1&command=down` |

### Parameters
None

### Returns
JSON

* `proto` - The protocol assigned to the group for transmission.
    * `0` = RTS
    * `1` = RTW
    * `2` = RTV
* `linkedShades` - An array of references to the shades/motors that are members of the group.

See the `GET /shades` endpoint for a description of the `linkedShade` objects.

<details>
<summary>Return example</summary>

```json
[
  {
    "groupId": 1,
    "roomId": 0,
    "name": "My Group",
    "remoteAddress": 515023,
    "lastRollingCode": 120,
    "bitLength": 56,
    "proto": 0,
    "sunSensor": false,
    "flipCommands": false,
    "flags": 0,
    "repeats": 0,
    "sortOrder": 1,
    "linkedShades": [
      {
        "shadeId": 1,
        "roomId": 0,
        "name": "My Awning",
        "remoteAddress": 515021,
        "paired": false,
        "shadeType": 4,
        "flipCommands": false,
        "flipPosition": false,
        "bitLength": 56,
        "proto": 0,
        "flags": 0,
        "sunSensor": false,
        "hasLight": false,
        "repeats": 0
      },
      {
        "shadeId": 2,
        "roomId": 0,
        "name": "My Blind",
        "remoteAddress": 515022,
        "paired": false,
        "shadeType": 1,
        "flipCommands": false,
        "flipPosition": false,
        "bitLength": 56,
        "proto": 0,
        "flags": 0,
        "sunSensor": false,
        "hasLight": false,
        "repeats": 0
      },
      {
        "shadeId": 3,
        "roomId": 0,
        "name": "My Shutter",
        "remoteAddress": 515024,
        "paired": false,
        "shadeType": 0,
        "flipCommands": false,
        "flipPosition": false,
        "bitLength": 56,
        "proto": 0,
        "flags": 0,
        "sunSensor": false,
        "hasLight": false,
        "repeats": 0
      }
    ]
  }
]
```
</details>

## GET|PUT|POST /login
Gets an API key for later secured calls. Since version 2.0.0, only the configuration settings check the API key.

| Parameter | Returns | Method | Port | Example URL |
| :--- | :--- | :--- | :--- | :--- |
| `pin`, `user`, `password` | JSON | **GET** | `80` | `http://192.168.1.13/login?pin=1234` |


### Parameters
All parameters are passed as JSON or as URL-encoded parameters. When the `authType` is "Pin Entry", the PIN code must be provided. When the `authType` is "Password", the username and password must be provided.


* `pin` - The PIN code set in the security configuration
* `username` - The username set in the security configuration
* `password` - The password set in the security configuration

You can pass all three, but ESPSomfy-RTS will only authenticate using the parameters that apply.
`GET /login?pin=1234&username=myUsername&password=myPassword`

<details>
<summary>JSON payload example</summary>

```json
{
   "pin": 1234
   "username": "myUser"
   "password": "myPassword"
}

```

</details>

### Returns
JSON

* `type` - The type of authentication used to authenticate the user
* `success` - true if the login succeeded
* `msg` - A message shown for the login
* `apiKey` - The SHA-256 hash of the API key generated for the login

<details>
<summary>Return example</summary>

```json
{
  "type": 1,
  "success": true,
  "msg": "Login successful",
  "apiKey": "9b92ba08950cd40451eeb41d8e137e3c35bc6dc6ed0b695f7a4724cfc0ba702f"
}
```

</details>


## GET|PUT|POST /shadeCommand
Sends a command to the shade identified.

| Parameter | Returns | Method | Port | Example URL |
| :--- | :--- | :--- | :--- | :--- |
| `shadeId`, `command`, `target`, `repeat`, `stepSize` | JSON | **GET** | `8081` | `http://192.168.1.13:8081/shadeCommand?shadeId=1&command=up` |



### Parameters
Parameters can be given in the URL or as a JSON object in the request body.

* `shadeId` - Required numeric ID of the shade [1-32].
* `target` - Optional target percentage [0-100] the shade should move to if no command is given.
* `command` - Optional command value, required if `target` isn't sent. You can use any of the '|'-separated forms below:
    * `m | My | my` - My (favourite position)
    * `u | Up | up` - Up
    * `d | Down | down` - Down
    * `mu | MyUp | myup` - My + Up
    * `md | MyDown | mydown` - My + Down
    * `ud | UpDown | updown` - Up + Down
    * `mud | MyUpDown | myupdown` - My + Up + Down
    * `p | Prog | prog` - Programming (Prog)
    * `s | SunFlag | sunflag` - SunFlag (turns the sun sensor on)
    * `f | Flag | flag` - Flag (turns the sun sensor off)
    * `su | StepUp | stepup` - StepUp (80-bit only, simulates the tilt wheel)
    * `sd | StepDown | stepdown` - StepDown (80-bit only, simulates the tilt wheel)
    * `fav | Favorite | favorite` - Favorite (80-bit only, on compatible motors)
    * `stop | Stop` - Stop (80-bit only, on compatible motors)
* `repeat` - Optional number of repeats to send. By default, ESPSomfy RTS sends 1 repeat (2 commands in total).
* `stepSize` - Optional number between 1 and 127 giving the size of the step command (80-bit only, on compatible motors).

`GET /shadeCommand?shadeId=1&command=up` - Moves the shade to the fully open position.
`GET /shadeCommand?shadeId=1&target=50` - Moves the shade to 50% closed.
`GET /shadeCommand?shadeId=1&command=prog&repeat=40` - Opens the shade's memory so it can learn a remote.

If you include the command structure in the request body:

<details>
<summary>JSON payload examples for the request</summary>

```json
{
  "shadeId":1,
  "command":"up",
  "repeat": 2
}
```
or...
```json
{
  "shadeId":1,
  "target":"35"
}
```

</details>

### Returns
JSON

The target shade's object


## GET /shades
Returns a reference to every configured shade.

| Parameter | Returns | Method | Port | Example URL |
| :--- | :--- | :--- | :--- | :--- |
| None | JSON (Array) | **GET** | `8081` | `http://192.168.1.13:8081/shades` |


### Parameters
None

### Returns
JSON

An array of shade reference objects:

* `shadeType` - The type of shade referenced

  * `0` - Roller shade
  * `1` - Blind
  * `2` - Drapery (left)
  * `3` - Awning
  * `4` - Shutter
  * `5` - Garage (1-button)
  * `6` - Garage (3-button)
  * `7` - Drapery (right)
  * `8` - Drapery (center)
  * `9` - Dry contact
  * `10` - Dry contact (2-button)
  * `11` - Gate (left)
  * `12` - Gate (center)
  * `13` - Gate (right)
  * `14` - Gate (1-button left)
  * `15` - Gate (1-button center)
  * `16` - Gate (1-button right)
* `tiltType` - The type of tilt mechanism attached to the motor
   * `0` - None
   * `1` - Separate tilt motor
   * `2` - Integrated tilt mechanism
   * `3` - Tilt only
* `myPos` - The favourite position as a percentage (-1 if not set)
* `myTiltPos` - The favourite tilt position as a percentage (-1 if not set)
* `position` - The shade's current lift position
* `tiltPosition` - The slats' current tilt position
* `direction` - The direction the shade is moving in
   * `-1` - The shade is going up
   * `0` - The shade is stopped
   * `1` - The shade is going down
* `tiltDirection` - The direction the slats are moving in
   * `-1` - The slats are opening
   * `0` - The slats are stopped
   * `1` - The slats are closing
* `flags` - Bitmask for the sensor flags
   * `0x01` - The sun sensor is enabled
   * `0x04` - The sensor is in demo mode
   * `0x10` - It's windy
   * `0x20` - It's sunny
* `inGroup` - Whether the shade is a member of a group (true if it is)
* `proto` - The protocol assigned to the motor
   * `0` - RTS
   * `1` - RTW
   * `2` - RTV
* `target` - The shade's target lift position [0-100]. If the shade is moving, this shows where it should stop. If it's stopped, this value equals `position`.
* `tiltTarget` - The slats' target tilt position [0-100]. This is the slats' final position once the movement is finished.
* `linkedRemotes` - An array of the linked remotes attached to the shade.

<details>
<summary>Return example</summary>

```json
[
  {
    "shadeId": 1,
    "name": "My Awning",
    "remoteAddress": 515021,
    "upTime": 10000,
    "downTime": 10000,
    "paired": true,
    "lastRollingCode": 25,
    "position": 0,
    "tiltPosition": 0,
    "tiltDirection": 0,
    "tiltTime": 7000,
    "stepSize": 100,
    "tiltTarget": 0,
    "target": 0,
    "myPos": 38,
    "myTiltPos": -1,
    "direction": 0,
    "tiltType": 0,
    "shadeType": 3,
    "bitLength": 56,
    "proto": 0,
    "flags": 0,
    "flipCommands": false,
    "flipPosition": false,
    "inGroup": true,
    "linkedRemotes": [
      {
        "remoteAddress": 4886592,
        "lastRollingCode": 1054
      }
    ]
  },
  {
    "shadeId": 2,
    "name": "My Blind",
    "remoteAddress": 515022,
    "upTime": 10000,
    "downTime": 10000,
    "paired": true,
    "lastRollingCode": 44,
    "position": 0,
    "tiltPosition": 0,
    "tiltDirection": 0,
    "tiltTime": 7000,
    "stepSize": 100,
    "tiltTarget": 0,
    "target": 0,
    "myPos": 63,
    "myTiltPos": 84,
    "direction": 0,
    "tiltType": 2,
    "shadeType": 1,
    "bitLength": 56,
    "proto": 0,
    "flags": 0,
    "flipCommands": false,
    "flipPosition": false,
    "inGroup": true,
    "linkedRemotes": [
      {
        "remoteAddress": 4886593,
        "lastRollingCode": 1357
      }
    ]
  },
  {
    "shadeId": 3,
    "name": "My Shutter",
    "remoteAddress": 515024,
    "upTime": 10000,
    "downTime": 10000,
    "paired": true,
    "lastRollingCode": 13,
    "position": 0,
    "tiltPosition": 0,
    "tiltDirection": 0,
    "tiltTime": 7000,
    "stepSize": 100,
    "tiltTarget": 0,
    "target": 0,
    "myPos": -1,
    "myTiltPos": -1,
    "direction": 0,
    "tiltType": 0,
    "shadeType": 4,
    "bitLength": 56,
    "proto": 0,
    "flags": 0,
    "flipCommands": false,
    "flipPosition": false,
    "inGroup": true,
    "linkedRemotes": [
      {
        "remoteAddress": 4886594,
        "lastRollingCode": 1315
      }
    ]
  },
  {
    "shadeId": 4,
    "name": "My Shade",
    "remoteAddress": 515025,
    "upTime": 10000,
    "downTime": 10000,
    "paired": true,
    "lastRollingCode": 4,
    "position": 32,
    "tiltPosition": 0,
    "tiltDirection": 0,
    "tiltTime": 7000,
    "stepSize": 100,
    "tiltTarget": 0,
    "target": 32,
    "myPos": -1,
    "myTiltPos": -1,
    "direction": 0,
    "tiltType": 0,
    "shadeType": 0,
    "bitLength": 56,
    "proto": 0,
    "flags": 0,
    "flipCommands": false,
    "flipPosition": false,
    "inGroup": false,
    "linkedRemotes": [
      {
        "remoteAddress": 4886595,
        "lastRollingCode": 14415
      }
    ]
  }
]
```

</details>


## GET|PUT|POST /tiltCommand
Tilts the slats of a blind.

| Parameter | Returns | Method | Port | Example URL |
| :--- | :--- | :--- | :--- | :--- |
| `shadeId`, `command`, `target`, `repeat` | JSON | **GET** | `8081` | `http://192.168.1.13:8081/tiltCommand?shadeId=1&command=up` |


### Parameters
* `shadeId` - The ID of the shade to send the command to [1-30].
* `command` - Optional tilt command. You must provide either the `target` or the command.
    * `m | My | my` - My (favourite position)
    * `u | Up | up` - Up (open the tilt)
    * `d | Down | down` - Down (close the tilt)
    * `su | StepUp | stepup` - StepUp (80-bit only, simulates the tilt wheel)
    * `sd | StepDown | stepdown` - StepDown (80-bit only, simulates the tilt wheel)
* `target` - Optional target for the slat position [0-100].
* `repeat` - The number of repeats to send. ESPSomfy RTS sends 1 frame plus 1 repeat, for a total of 2 frames.

`GET /tiltCommand?shadeId=1&command=up` - Tilts the slats to the open position.
`GET /tiltCommand?shadeId=1&command=my` - Moves the slats to the favourite position if they are still, or stops the movement if they are moving.
`GET /tiltCommand?shadeId=1&target=35` - Moves the slat tilt to 35%.

### Returns
JSON reference of the group

## GET|PUT|POST /setPostions
Sets the motor's stored position without moving it. This is handy when other sensors are used to work out the motor's final position. For example, if you have a tilt sensor on a garage door or a magnetic sensor on a gate, you can use this command to tell ESPSomfy RTS whether the position is closed or open based on the sensor's state.

### Parameters
* `shadeId` - The ID of the shade to set the position for [1-30].
* `position` - Optional lift position from 0 to 100%.
* `tiltPosition` - Optional tilt position from 0 to 100%.

`GET /setPositions?shadeId=1&position=50` - Sets the lift position to 50%.
`GET /setPositions?shadeId=1&liftPosition=50` - Sets the lift position to 50%.

You can also send this information as a JSON payload.

<details>
JSON payload example (you can leave out either the position or the tiltPosition value)
```json
{
   "shadeId": 1,
   "position": 50,
   "tiltPosition": 100
}
```
</details>

### Returns
JSON reference of the shade.

## GET|PUT|POST /setSensor
Sends a sensor frame to the motor. These can be sent for a shade or a group to simulate an Eolis (wind) or Sunis (sun) sensor. You can build your own wind or sun sensors and have the motor react to them. See the documentation for the Sunis Sun/Wind sensor.

For most motors, if you say it's windy, the shade will retract for at least 2 minutes after the first calm signal is sent. If you tell the motor it's sunny, it will extend the shade 2 minutes after receiving that signal and retract it 20 minutes after the sunny condition ends. This works together with the motor's "Sun Flag" setting; it will only extend or retract if that mode is on.

This works for groups as well as shades, depending on whether you send the group ID or the shade ID.

| Available parameters | Returns | Method | Port | Example URL |
| :--- | :--- | :--- | :--- | :--- |
| `shadeId` **OR** `groupId`, `sunny`, `windy` | JSON | **GET** | `8081` | `http://192.168.1.13:8081/setSensor?shadeId=1&windy=1` |

### Parameters
* `shadeId` - The ID of the shade to apply the sun or wind attributes to [1-30].
* `groupId` - The ID of the group to apply the sun or wind attributes to [1-14].
* `sunny` - 1 for sunny, 0 for not sunny.
* `windy` - 1 for windy, 0 for calm.

`GET /setSensor?shadeId=1&windy=1` - Tells the shade it's windy.
`GET /setSensor?groupId=1&windy=1` - Tells a group it's windy.
`GET /setSensor?shadeId=1&windy=0&sunny=1` - Tells the shade it's sunny and calm.
`GET /setSensor?groupId=1&windy=0&sunny=1` - Tells a group it's sunny and calm.


You can also send this information as a JSON payload.

<details>
Example of a JSON payload: send either a groupId or a shadeId. Either or both of the sunny and windy values can be sent.

The example below tells the motor that it is sunny and calm so act accordingly.
```json
{
   "shadeId": 1,
   "windy": 0,
   "sunny": 1
}
```
The example below tells the group members that it is sunny and calm so act accordingly.
```json
{
   "groupId": 1,
   "windy": 0,
   "sunny": 1
}
```
</details>


### Returns
JSON reference of the shade or group

---

**Related pages:** [MQTT](MQTT.md) · [Home Assistant](Home-Assistant.md)
