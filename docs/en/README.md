<p align="center">
 <img width="1927" alt="banniereRTS" src="https://github.com/user-attachments/assets/5d253b64-b88f-4121-84c9-ea9d288d3e9a" />
</p>

<h1 align="center">Wiki ESPSomfy-RTS</h1>
<p align="center"><b>A modern, multilingual interface for easily controlling your 433 MHz RTS devices.</b></p>

---

### About the project
This project is a fork of the firmware by **[rstrouse](https://github.com/rstrouse/ESPSomfy-RTS)**. It keeps 100% of the original RTS protocol's reliability while offering a simpler, completely redesigned user interface.

> [!NOTE]
> This is an English translation of [xkain's French wiki](https://github.com/xkain/ESPSomfy-RTS/wiki), kept in step with it. If the two ever disagree, the French wiki is the reference.

---

## Configuration guide

### 1. Hardware
<div style="border: 1px solid rgba(255, 255, 255, 0.15); overflow: hidden; width: 100%;">
  <table border="0" style="width: 100%; border-collapse: collapse; border-style: hidden;">
    <tr style="background-color: rgba(31, 111, 235, 0.12);">
      <td style="padding: 12px 15px; border-style: hidden; width: 99vw;"><b>Get your box ready, or build one</b></td>
    </tr>
    <tr>
      <td style="padding: 15px; border-style: hidden; vertical-align: top;">
        <ul>
          <li><b><a href="Pre-assembled-Boxes.md">Pre-assembled boxes</a></b> <img width="14" height="14" alt="leboncoin-fr" src="https://github.com/user-attachments/assets/3200f61d-901e-4c69-b70b-36d3df104761" />: Specifications and the automatic configuration assistant for your ready-made box.</li>
          <li><b><a href="Components.md">Components</a></b>: The hardware needed to build an ESPSomfy-RTS device.</li>
          <li><b><a href="Motor-Control-with-GPIO.md">GPIO control</a></b>: Connecting buttons and physical controls.</li>
          <li><b><a href="Installation-Guide.md">Installation guide</a></b>: Install the firmware over USB from your browser — <a href="Installation-Guide.md#3-download-the-right-image">choose the image for your ESP32</a>, <a href="Installation-Guide.md#5-flash-over-usb">flash it</a>, and <a href="Installation-Guide.md#7-if-you-were-on-rstrouses-firmware">move over from rstrouse's firmware</a>.</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

<br>

### 2. Getting started
<div style="border: 1px solid rgba(255, 255, 255, 0.15); overflow: hidden; width: 100%;">
  <table border="0" style="width: 100%; border-collapse: collapse; border-style: hidden;">
    <tr style="background-color: rgba(31, 111, 235, 0.12);">
      <td style="padding: 12px 15px; border-style: hidden; width: 99vw;"><b>Get to know the interface and set up your device</b></td>
    </tr>
    <tr>
      <td style="padding: 15px; border-style: hidden; vertical-align: top;">
        <ul>
          <li><b><a href="Dashboard.md">Dashboard</a></b>: The home screen — the room filter, the group cards and <a href="Dashboard.md#8-device-cards">the device cards</a>, buttons, indicators and <a href="Dashboard.md#9-the-two-sliding-windows">positioning windows</a>.</li>
          <li><b><a href="Network-Connection.md">Connection</a></b>: <i>Network</i> tab — how to connect to your network over <a href="Network-Connection.md#using-a-wi-fi-connection">Wi-Fi</a> and/or<a href="Network-Connection.md#using-an-ethernet-connection"> Ethernet</a>, and <a href="Network-Connection.md#the-device-wont-join-my-wi-fi">what to do if the connection fails</a>.</li>
          <li><b><a href="DHCP-and-Static-IP.md">DHCP / Static IP</a></b>: <i>Network</i> tab — give the device an IP address that no longer changes, with a <a href="DHCP-and-Static-IP.md#the-right-way-a-dhcp-reservation">DHCP reservation</a> or a <a href="DHCP-and-Static-IP.md#static-ip-advanced-users">static IP</a>.</li>
          <li><b><a href="Options.md">Options</a></b>: <i>System</i> tab — hostname, time zone, language and the interface's appearance.</li>
          <li><b><a href="Security.md">Security</a></b>: <i>System</i> tab — protect access with a PIN code or password, and choose <a href="Security.md#2-secure-configuration-only">how much is protected</a>.</li>
          <li><b><a href="Firmware.md">Firmware</a></b>: <i>System</i> tab — device status, <a href="Firmware.md#3-updates">updates</a> and <a href="Firmware.md#backup-and-restore">backup and restore</a>.</li>
          <li><b><a href="Updating.md">Updating</a></b>: The three update windows in detail, <a href="Updating.md#2-the-files-in-a-release">the files published in a <i>release</i></a> and <a href="Updating.md#moving-between-v2xx-and-v3">moving between v2.x.x and v3</a>.</li>
          <li><b><a href="Radio-Setup.md">Radio setup</a></b>: <a href="Radio-Setup.md#gpio-assignment">GPIO assignment</a> and <a href="Radio-Setup.md#tuning-the-radio">frequency tuning</a>, with a worked example for when <a href="Radio-Setup.md#example-6-out-of-8-devices-respond">some devices don't respond</a>.</li>
          <li><b><a href="Radio-Logs.md">Radio logs</a></b>: Read the frames received, <a href="Radio-Logs.md#identifying-the-protocol-bits-column">identify the protocol</a> of your motors and <a href="Radio-Logs.md#troubleshooting-guide">troubleshoot the radio</a>.</li>
          <li><b><a href="Frequency-Scan.md">Frequency scan</a></b>: Measure a remote's actual frequency.</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

<br>

### 3. Your RTS installation
<div style="border: 1px solid rgba(255, 255, 255, 0.15); overflow: hidden; width: 100%;">
  <table border="0" style="width: 100%; border-collapse: collapse; border-style: hidden;">
    <tr style="background-color: rgba(163, 113, 247, 0.12);">
      <td style="padding: 12px 15px; border-style: hidden; width: 99vw;"><b>Build your virtual installation, and link your motors and remotes</b></td>
    </tr>
    <tr>
      <td style="padding: 15px; border-style: hidden; vertical-align: top;">
        <ul>
          <li><b><a href="Rooms.md">Rooms</a></b>: Organise your home and split it into zones.</li>
          <li><b><a href="Devices.md">Devices</a></b>: Add your shutters or blinds and handle <b><a href="Devices.md#5-pairing-the-motor">Pairing</a></b>, <b><a href="Devices.md#6-linking-your-physical-remotes">Remotes</a></b> or <b><a href="Devices.md#8-setting-the-rolling-code">Rolling Codes</a></b>.</li>
          <li><b><a href="Groups.md">Groups</a></b> & <b><a href="Repeaters.md">Repeaters</a></b>: Centralise your commands and extend the radio signal's range.</li>
          <li><b><a href="Virtual-Remote.md">Virtual Remote</a></b>: Simulate a physical transmitter from the interface.</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

<br>

### 4. Integrations & home automation
<div style="border: 1px solid rgba(255, 255, 255, 0.15); overflow: hidden; width: 100%;">
  <table border="0" style="width: 100%; border-collapse: collapse; border-style: hidden;">
    <tr style="background-color: rgba(46, 160, 67, 0.12);">
      <td style="padding: 12px 15px; border-style: hidden; width: 99vw;"><b>Connect your shades to your servers and external apps</b></td>
    </tr>
    <tr>
      <td style="padding: 15px; border-style: hidden; vertical-align: top;">
        <ul>
          <li><b><a href="Integrations.md">Integrations</a></b>: <a href="Integrations.md#connectivity-options-available">Overview</a> of the services for other systems, and the <a href="Integrations.md#rest-interface-api">REST interface (API)</a>.</li>
          <li><b><a href="MQTT.md">MQTT</a></b>: <a href="MQTT.md#published-topics">Published topics</a>, <a href="MQTT.md#subscribed-topics">subscribed topics</a> and <a href="MQTT.md#mqtt-auto-discovery">auto-discovery</a>.</li>
          <li><b><a href="Home-Assistant.md">Home Assistant</a></b>: <a href="Home-Assistant.md#installation-via-hacs">Installing the dedicated integration via HACS</a>, and compatibility with rstrouse's.</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

---

## Maintenance & reset
* **[Factory Reset](Factory-Reset.md)**: A two-level reset to restore the device to its "out-of-the-box" state.
* **[Serial monitor](Serial-Monitor.md)**: How to connect to the device's serial port from a web browser or other tools.
* **[Backup file anatomy](Backup-File-Anatomy.md)**: The internal format of a `.backup` file, record by record, for anyone who wants to inspect it, hand-edit it or script it.

