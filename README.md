<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">ESPSomfy-RTS </h3>

  <p align="center">
    Easily control and monitor your roller shutters, gates, garage doors, or any other device using the RTS 433 MHz protocol.
    <br />
    <a href="https://github.com/xkain/ESPSomfy-RTS/wiki"><strong>Explore documentation »</strong></a>
    <br />
    <br />
    <a href="https://github.com/xkain/ESPSomfy-RTS/issues">Report Bug</a>
    &middot;
    <a href="https://github.com/xkain/ESPSomfy-RTS/pulls">Request Feature</a>
  </p>
</div>
<br />


[![Product Name Screen Shot][product-screenshot]](https://example.com)


## About The Project

This project serves as a comprehensive controller for Somfy RTS blinds and shades, capable of managing up to **30 individual shades** , **14 groups** and **14 rooms**.

#### Supported Protocols
* **433MHz RTx:** Full support for **RTS, RTW, RTV/L**, and **433.92MHz** protocols.
* **Frequency Constraints:** You can mix protocols as long as they reside within the same base frequency range. 
  > **Note:** You cannot operate 433.92MHz and 433.42MHz motors simultaneously on the same radio transceiver.
* **IO Home Control:** Not natively supported. However, compatibility can be achieved via the **IO Remote protocol** by interfacing with a dissected remote control. 

#### Wired Motors (Relays)
For those with "bare" motors (no built-in radio), this project includes support for **relay module configurations**. Once set up, these motors can be controlled through the interface exactly like native RTS or RTW devices.

<br />

### Why does this project exist?

**ESPSomfy-RTS** is a powerful project at its core, but I felt it needed a more modern and localized touch.

Being French (and therefore a big fan of bread and cheese), I found during my very first use that the explanations were sometimes confusing. Above all, I felt like I had to put on sunglasses every time I opened the interface! This fork is designed to save you a trip to the eye doctor and a few linguistic headaches along the way.

While keeping the **rock-solid foundations** of the original project, I have completely redesigned the user experience to be **truly responsive**: the interface is just as pleasant to use on mobile and tablet as it is on PC, and navigation is finally crystal clear for non-English speakers.

This project aims to make managing your RTS 433 MHZ devices as beautiful as it is functional.

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


## Project ESPSomfy-RTS Roadmap

Want to know what's coming next, check current release progress, or see completed features? We use GitHub Projects to maintain a live, up-to-date roadmap.

[![ESPSomfy-RTS Roadmap](https://img.shields.io/badge/View_Live-Roadmap_🗣️-238636?style=for-the-badge&logo=github)](https://github.com/users/xkain/projects/2)

> 💡 **Click the badge above** to track real-time development, active milestones (`v2.5.3`, `v3.0.0`), and submit features or bug fixes directly into our workflow columns.

<br />

## 🛠️ Troubleshooting & Factory Reset


If you lose access to the web interface (network configuration error or forgotten password), a manual reset procedure is available via (**Power Cycles**).


> [!IMPORTANT]
>The procedure depends on your firmware version. A two-tier system was introduced in **v2.5.1** to allow resetting the network without losing all your configurations (which is not the case if you are using version **2.5.0**).


### Summary of procedures

* **Version v2.5.1+ :**
    * **3 Cycles :** Resets Wi-Fi configuration and disables security settings.
    * **6 Cycles :** Full Factory Reset (**Full Wipe**).
* **Version v2.5.0 :**
    * **4 Cycles :** Full Factory Reset (**Full Wipe**).

### 📖 Complete documentation
To view detailed instructions and cycle diagrams, please visit the dedicated page:

👉 **[View the Factory Reset page](https://github.com/xkain/ESPSomfy-RTS/wiki/Factory-Reset)**


> [!TIP]
> Always use these procedures as a last resort. If the interface is still accessible, use the **Restore** button in the system settings instead.

---

## 📸 Screenshots

### 📱 Mobile View (Dark Mode)
<p align="center">
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark-mobile00.png?raw=true" width="23%" />
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark-mobile01.png?raw=true" width="23%" />
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark-mobile02.png?raw=true" width="23%" />
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark-mobile03.png?raw=true" width="23%" />
</p>

### 💻 Desktop View (Dark Mode)
<p align="center">
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark00.png?raw=true" width="80%" /><br><br>
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark02.png?raw=true" width="80%" /><br><br>
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/dark03.png?raw=true" width="80%" />
</p>

<br>

<details>
<summary><b>✨ Click here to see Light Mode versions</b></summary>
  
### 📱 Mobile View 
<p align="center">
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair-mobile00.png?raw=true" width="23%" />
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair-mobile01.png?raw=true" width="23%" />
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair-mobile02.png?raw=true" width="23%" />
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair-mobile03.png?raw=true" width="23%" />
</p>

### 💻 Desktop View  
<p align="center">
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair00.png?raw=true" width="80%" /><br><br>
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair02.png?raw=true" width="80%" /><br><br>
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/clair03.png?raw=true" width="80%" />
</p>
</details>
    
---

## 📚 Documentation & Resources

Since this is a fork, you can rely on the extensive original documentation for technical hardware details and integrations:

* 📖 **[Configuring the Software](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Configuring-the-Software)**
* ⚙️ **[Installing the Firmware](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Installing-the-Firmware)**
* 🔄 **[How to Update ESPSomfy RTS](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Updating-ESPSomfy-RTS)**
* 🔌 **[Integrations](https://github.com/xkain/ESPSomfy-RTS/wiki/Intégrations)**



---

## 🙏 Credits
Special thanks to [rstrouse](https://github.com/rstrouse) for the incredible work on the original ESPSomfy-RTS project, and to [y-streibel-uiris](https://github.com/y-streibel-uiris) for the HTTPS WebSocket implementation.

---



## 📦 Boîtiers Prêts à l'Emploi (Plug & Play)

Si vous ne souhaitez pas fabriquer le matériel vous-même, je propose des **unités entièrement assemblées, flashées et testées individuellement** avant envoi. Ces boîtiers sont prêts à être alimentés pour piloter immédiatement vos équipements Somfy RTS 433 MHz.

🛒 **Disponibles à l'achat sur [Leboncoin](https://www.leboncoin.fr/profile/77a39e2a-ddb5-44c8-828a-954652c46ee7)**





> [!IMPORTANT]
> **💡 Note sur la configuration et l'assistant intégré**
> 
> **L'assistant de préconfiguration automatique a déjà été exécuté par mes soins sur votre boîtier avant son expédition.** Votre appareil est donc configuré et prêt à l'emploi dès la première mise sous tension :
> * Interface entièrement en **Français**.
> * Fuseau horaire local configuré (**Europe/Paris**).
> * Module radio **activé** et **GPIO spécifiques** à votre modèle déjà assignés.
>
>Pour retrouver toutes les caractéristiques et détails, une page dédiée aux **[boîtiers](https://github.com/xkain/ESPSomfy-RTS/wiki/BO%C3%8ETIERS-LEBONCOIN)** est disponible.
>
> ⚠️ **En cas de perte de configuration :** Si après une mise à jour majeure ou une réinitialisation d'usine (*Factory Reset*) vos équipements ne répondent plus, pas de panique ! L'assistant reste disponible dans l'interface web.


<br><br>

<p align="center">
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/boncoin02.jpg?raw=true" width="33%" />
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/boncoin00.jpg?raw=true" width="33%" />
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/boncoin01.jpg?raw=true" width="33%" />
</p>

<!-- MARKDOWN LINKS & IMAGES -->
[product-screenshot]: images/exemple.png
[product-hardreset]: images/hard-reset.GIF
