<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">ESPSomfy-RTS </h3>

  <p align="center">
    Easily control and monitor your roller shutters, gates, garage doors, or any other device using the RTS 433 MHz protocol.
    <br />
    <a href="https://github.com/rstrouse/ESPSomfy-RTS/wiki/Configuring-the-Software"><strong>Explore original docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/rstrouse/ESPSomfy-RTS/issues">Report Bug</a>
    &middot;
    <a href="https://github.com/rstrouse/ESPSomfy-RTS/pulls">Request Feature</a>
  </p>
</div>
<br />


[![Product Name Screen Shot][product-screenshot]](https://example.com)


## About The Project

This project serves as a comprehensive controller for Somfy RTS blinds and shades, capable of managing up to **32 individual shades** and **16 groups**.

#### Supported Protocols
* **433MHz RTx:** Full support for **RTS, RTW, RTV/L**, and **433.92MHz** protocols.
* **Frequency Constraints:** You can mix protocols as long as they reside within the same base frequency range. 
  > **Note:** You cannot operate 433.92MHz and 433.42MHz motors simultaneously on the same radio transceiver.
* **IO Home Control:** Not natively supported. However, compatibility can be achieved via the **IO Remote protocol** by interfacing with a dissected remote control. 

#### Wired Motors (Relays)
For those with "bare" motors (no built-in radio), this project includes support for **relay module configurations**. Once set up, these motors can be controlled through the interface exactly like native RTS or RTW devices.

<br />

## Why does this exist?

ESPSomfy-RTS is a powerful project, but I felt it needed a more modern and localized touch. This fork is the result of three months of redesigning the user experience to make it more intuitive and accessible for everyone.

While keeping the rock-solid foundations of the original project, I’ve completely overhauled the interface to be truly "Mobile-First" and user-friendly for non-English speakers.

**Here's why:**
* **Native Multilingual Support:** Starting with French, the interface is now built to speak your language.
* **Modern UI/UX:** A clean, responsive design optimized for smartphones, tablets, and desktops.
* **Enhanced Visuals:** New SVG iconography for different device types (shades, garage doors, awnings).
* **Simplified Control:** Improved navigation and settings without sacrificing the power of the original code.

This project aims to make managing your Somfy RTS devices as beautiful as it is functional.

<br />

## Migration & Updates

If you are migrating from **rstrouse/ESPSomfy-RTS** or upgrading from an older version of this fork, please read the following:

#### From rstrouse to this Fork (v2.5.0+)
* **Data Compatibility:** You can restore a `.backup` file from the original project. Your shades, groups, and remote addresses will be successfully migrated.
* **⚠️ Radio Settings (Action Required):** Due to the new GPIO Selector in v2.5.0, radio pin assignments are **not** automatically restored from older backup files. 
* **Warning Message:** You will see a compatibility alert during the restore process. After the import, you **must** manually verify and re-assign your GPIO pins in the **Radio tab**.

#### Upgrading from v2.4.8 to v2.5.0
* **Direct Update:** Your existing settings are automatically migrated and preserved during the update process. 
* **⚠️ Automatic Backup Note:** The backup file created by the system *just before* the update is still in the old format. 
* **Restoring after Update:** If you ever need to restore that specific pre-update backup onto v2.5.0+, you will trigger the "Incomplete Compatibility" alert and will need to re-assign your Radio GPIOs manually.

> [!TIP]
> After a successful update to v2.5.0, we recommend creating a **new backup** immediately. This new file will include the updated GPIO mapping and won't trigger any warnings in the future.


## Home Assistant

This fork remains 100% compatible with the official ESPSomfy-RTS-HA integration. If you are already using the integration, simply update your ESP32 with this firmware. Your entities, names, and dashboards in Home Assistant will continue to work without any modification.


## Roadmap
- [x] Add Multi-language Support
    - [x] English
    - [x] French
    - [x] German
- [x] New visual identity
- [x] Fully responsive interface (mobile, tablet, and desktop)
- [x] Add integrated Dark/Light mode with customizable accent colors
- [x] All checkboxes replaced with modern switches
- [x] All icons replaced with high-quality SVGs
    - [ ] Performance optimization
- [x] Virtual Remote completely redesigned
- [x] Integrated WebSocket refactor by [y-streibel-uiris](https://github.com/y-streibel-uiris) to support secure HTTPS connections from [#624](https://github.com/rstrouse/ESPSomfy-RTS/pull/624)
- [x] Passwords hidden by default with a "toggle eye" button
- [x] Add Safety confirmation step to prevent accidental network lockouts
- [x] Display MAC address in system info
- [x] Control buttons are disabled until the device shade configuration is finalized
- [x] Add a welcome/onboarding page to guide new users
- [x] Add new GPIO Selector for easier radio assignment
- [x] Add stepped sliders (1, 10, 100) for precise frequency tuning
- [x] Add tooltips for better understanding of frequency settings
- [x] Add visual graph for frequency scanning feedback
- [x] Better integration of SetMyPosition and openSetMyPosition popups
- [x] Add Factory Reset feature
- [x] Add visual indicator (internal blue LED) for hard reset during boot
    - [x] Support for ESP32 boards with LED on GPIO 02 (e.g., DevKit v1, D1 Mini)
      * *Note: No support for S2, S3, and C3 models; GPIO 02 is kept free*
- [x] Add device and connection uptime tracking
- [x] Display detailed device information
- [ ] Add Automations (scheduling shade opening/closing by time or day)
 
<br />

## Troubleshooting & Factory Reset

If you lose access to the web interface (due to a network misconfiguration or forgotten password), or if the device behaves erratically due to corrupted settings, you can perform a Factory Reset to restore the device to "out-of-the-box" state.

>[!CAUTION]
>This process is a Full Wipe. It is designed to recover the device from any state, including corrupted configuration files. All your settings will be lost.

### What happens during a Factory Reset?
* **Restored:** All settings (Wi-Fi, MQTT, Rooms, Shades) are permanently deleted. The device returns to its "out-of-the-box" state.
* **Firmware:** The firmware version remains the same (e.g., if you are on v2.5.0, it stays on v2.5.0).
* **Access:** After the reset, the device will restart in **Access Point mode** (SSID: `ESPSomfyRTS `) at http://192.168.4.1.

### 🔌 How to perform the Factory Reset

<table>
  <tr>
    <td width="60%" valign="top">
      <ol>
        <li><strong>Unplug and replug</strong> the power supply <strong>4 times</strong> in a row.</li>
        <li>On the <strong>4th boot</strong>, the system enters reset mode.</li>
        <li><strong>Visual Indicator:</strong> If you have a <em>Standard ESP32</em>, the <strong>blue LED</strong> will flash very rapidly to confirm the process.</li>
        <li>Wait for the device to restart.</li>
      </ol>
      <p><i>Note: After the reset, look for the Wi-Fi SSID: <code>ESPSomfyRTS</code> to reconfigure your device.</i></p>
    </td>
    <td width="40%" align="center" valign="middle">
        <img src="images/hard-reset.GIF" alt="Hard Reset Process" width="100%">
      <br />
      <em>Reset sequence animation</em>
    </td>
  </tr>
</table>
  
> [!TIP]
> Use this as a last resort if the "Restore" button in the interface is no longer accessible.


---

## 📸 Screenshots

<p align="center">
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair-mobile01.png?raw=true" width="16%" />
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair-mobile02.png?raw=true" width="16%" />
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair-mobile03.png?raw=true" width="16%" />
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark-mobile01.png?raw=true" width="16%" />
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark-mobile02.png?raw=true" width="16%" />
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark-mobile03.png?raw=true" width="16%" /> 
</p>

<p align="center">
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair00.png?raw=true" width="16%" />
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair02.png?raw=true" width="16%" />
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair03.png?raw=true" width="16%" />
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark00.png?raw=true" width="16%" />
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark02.png?raw=true" width="16%" />
   <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark03.png?raw=true" width="16%" />
</p>
    
---

## 📚 Documentation & Resources

Since this is a fork, you can rely on the extensive original documentation for technical hardware details and integrations:

* 📖 **[Configuring the Software](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Configuring-the-Software)**
* ⚙️ **[Installing the Firmware](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Installing-the-Firmware)**
* 🔄 **[How to Update ESPSomfy RTS](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Updating-ESPSomfy-RTS)**
* 🔌 **[Integrations](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Integrations)**



---

## 🙏 Credits
Special thanks to [rstrouse](https://github.com/rstrouse) for the incredible work on the original ESPSomfy-RTS project, and to [y-streibel-uiris](https://github.com/y-streibel-uiris) for the HTTPS WebSocket implementation.

---

## 📦 Boîtiers Prêts à l'Emploi (Plug & Play)

Si vous ne souhaitez pas fabriquer le matériel vous-même, je propose des **unités entièrement assemblées et testées**. Ces boîtiers sont prêts à être alimentés et configurés pour piloter vos équipements RTS 433 MHz.

🛒 **Disponible sur [Leboncoin](https://www.leboncoin.fr/profile/77a39e2a-ddb5-44c8-828a-954652c46ee7)**

> [!IMPORTANT]
> **Note sur le Firmware :** Tant que mon interface est en phase de développement, les boîtiers seront livrés avec la version '2.4.8'.  Vous pourrez installer la nouvelle version depuis l'interface dès qu'elle sera finalisée !

<p align="center">
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/boncoin02.jpg?raw=true" width="33%" />
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/boncoin00.jpg?raw=true" width="33%" />
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/boncoin01.jpg?raw=true" width="33%" />
</p>

<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: images/exemple.png
[product-hardreset]: images/hard-reset.GIF
