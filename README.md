# ESPSomfy-RTS (Enhanced Fork)

This fork of the original [ESPSomfy-RTS](https://github.com/rstrouse/ESPSomfy-RTS) project by **rstrouse** introduces a major overhaul of the user interface and several quality-of-life improvements.

---

## 🚀 Key Improvements & Features

In the last few months, this version has been significantly updated with a focus on **User Experience**, **Modern Design**, and **Accessibility**.

### 🌍 Localization & UI/UX
* **Multi-language Support:** Currently available languages are: **English**, **French**, and **German**.
* **Complete Redesign:** New logo and a fully **responsive** interface (mobile, tablet, and desktop).
* **Theme Engine:** Integrated **Dark/Light mode** with customizable **accent colors**.
* **Modern Components:** * All legacy checkboxes replaced with modern **switches**.
    * High-quality **SVG icons** for crisp rendering on all screens.
* **Virtual Remote:** Completely redesigned for a more intuitive and realistic experience.

### 🔐 Security & Connectivity
* **HTTPS Support:** Integrated the WebSocket refactor by [y-streibel-uiris](https://github.com/y-streibel-uiris) to support **secure HTTPS connections** (from PR #624).
* **Password Privacy:** Passwords hidden by default with a "toggle eye" button.
* **Ethernet Safeguard:** Safety confirmation step to prevent accidental network lockouts.
* **Smart Interlocks:** Control buttons are disabled until the device configuration is finalized.

### 🛠 Technical & Radio Enhancements
* **Smart Onboarding:** Guided landing page for first-time setup.
* **Radio Configuration:**
    * New **GPIO Selector** for easier radio assignment.
    * **Stepped sliders** (1, 10, 100) for precise frequency tuning.
    * **Visual graph** for frequency scanning feedback.
* **Refined UI:** Improved logic for `SetMyPosition` popups and responsive layout help.

---

## 🚧 Project Status & Roadmap

This version is in **active development**. 

- [ ] **Automations:** Native scheduling (opening/closing shades by time/day).
- [ ] **Enhanced Logs:** Improved visual feedback for system events.

---

## 📸 Screenshots

<<<<<<< HEAD
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

Si vous ne souhaitez pas fabriquer le matériel vous-même, je propose des **unités entièrement assemblées et testées**. Ces boîtiers sont prêts à être alimentés et configurés pour piloter vos équipements Somfy RTS.

🛒 **Disponible sur [Leboncoin](https://www.leboncoin.fr/profile/77a39e2a-ddb5-44c8-828a-954652c46ee7)**

> [!IMPORTANT]
> **Note sur le Firmware :** Tant que mon interface (Fork) est en phase de construction, les boîtiers sont livrés avec la version officielle de **rstrouse** afin de garantir une stabilité maximale. Vous pourrez installer ma version manuellement dès qu'elle sera finalisée !

<p align="center">
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/boncoin00.jpg?raw=true" width="45%" />
  <img src="https://github.com/xkain/ESPSomfy-RTS/blob/main/images/boncoin01.jpg?raw=true" width="45%" />
</p>
