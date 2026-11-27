## Who is this page for?

**Intended users:** this help page and the tool that goes with it are **only** for people who bought one of [my pre-assembled boxes](https://www.leboncoin.fr/profile/77a39e2a-ddb5-44c8-828a-954652c46ee7).

> [!NOTE]
> The boxes are only sold in France, so every mention of buying the hardware, and the pre-configuration tool, only appears in the ESPSomfy-RTS interface when it is set to **French**. In any other language these items don't appear, so the interface isn't cluttered for people they don't concern. That's also why the button labels on this page are given in French, with an English translation.

## 📦 Hardware specifications

<table border="0" style="width: 100%; border-collapse: collapse; border-style: hidden; table-layout: fixed;">
  <tr>
    <td style="width: 50%; vertical-align: bottom; padding-right: 15px; border-style: hidden;">
      <h3>Wi-Fi Edition</h3>
    </td>
    <td style="width: 50%; vertical-align: bottom; padding-left: 15px; border-style: hidden;">
      <h3>Ethernet & Wi-Fi Edition</h3>
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top; padding-right: 15px; border-style: hidden; padding-top: 10px;">
      <img width="100%" alt="Wi-Fi Edition box" src="https://github.com/user-attachments/assets/09564622-8128-46de-9957-2310bc14ab70" style="max-width: 500px; border-radius: 8px; display: block;" />
    </td>
    <td style="vertical-align: top; padding-left: 15px; border-style: hidden; padding-top: 10px;">
      <img width="100%" alt="Ethernet Edition box" src="https://github.com/user-attachments/assets/05727baa-7245-4067-a876-978e53891212" style="max-width: 500px; border-radius: 8px; display: block;" />
    </td>
  </tr>
  <tr>
    <td style="vertical-align: top; padding-right: 15px; border-style: hidden; padding-top: 15px;">
      <ul>
        <li>ESP32 D1 Mini</li>
        <li>E07-M1101D-SMA (CC1101)</li>
        <li>3dBi antenna (removable)</li>
        <li>Custom-designed PCB</li>
        <li>GPIO assignment: <a href="Components.md#esp32-d1-mini">see details</a></li>
        <li>💾 <b>Very easy flashing:</b> plugs in and flashes directly over USB-C, nothing else needed.</li>
      </ul>
    </td>
    <td style="vertical-align: top; padding-left: 15px; border-style: hidden; padding-top: 15px;">
      <ul>
        <li>ESP32 WT32-ETH01</li>
        <li>E07-M1101D-SMA (CC1101)</li>
        <li>CH340N SOP8 (built-in USB to TTL)</li>
        <li>3dBi antenna (removable)</li>
        <li>Custom-designed PCB</li>
        <li>GPIO assignment: <a href="Components.md#wt32-eth01">see details</a></li>
        <li>💾 <b>Hardware flash button:</b> a discreet push-button underneath switches it to flash mode when you plug in USB-C.</li>
      </ul>
    </td>
  </tr>
</table>

> [!NOTE]
> **Preferably** use a standard phone charger for power (avoid chargers under 1A). For Ethernet & Wi-Fi boxes (such as the WT32-ETH01), use a stable, good-quality charger of at least 1.5A. This part copes very badly with brief power drops and undervoltage, and can be permanently damaged; a small UPS could easily save you from this kind of problem. <br>
> You can also plug it into any device with a USB port (e.g. router / TV / PC).


## 🛠️ The automatic configuration assistant

### What is this tool for?
By default, the original firmware ships with universal settings. The boxes I send you are **already fully pre-configured and tested** before shipping. So there is nothing at all for you to do when you first plug in.

However, this tool becomes essential in three situations:
1. After an update, if by chance some system settings have been reset.
2. After a [Factory Reset](Factory-Reset.md) (full reset) of your box.
3. After restoring a backup onto a box that has been reset: the backup file doesn't contain the box model the assistant stored.

After a full Factory Reset, your hardware goes back to the default factory settings (interface in English, time zone Etc/UTC, radio GPIO pins not configured). First switch the interface back to **French**: the assistant only appears in that language. It then sets the Europe/Paris time zone, loads the exact hardware configuration of your box (the GPIO assignment for the CC1101 module) and turns the radio module on.

### How to use it
1. Select your box model, **Wi-Fi** or **Ethernet & Wi-Fi**. Neither is chosen in advance, and the `DÉMARRER` (Start) button stays greyed out until you have chosen.
2. Click `DÉMARRER`, then confirm with `OUI` (Yes).
3. Each step is only ticked once your box has saved it. When all three are ticked, the page reloads by itself: ESPSomfy-RTS is pre-configured for your box.

If a save fails, the assistant stays open, only shows the steps that succeeded as ticked, and offers `RÉESSAYER` (Retry).

<img width="800px" alt="Screenshot_20260528_112324" src="https://github.com/user-attachments/assets/a6c62b2f-a636-442f-8ce8-c953a80967ed" />

### What changes in the interface afterwards
The assistant remembers the model you chose. The interface then adapts to your box to save you the tricky settings:

| Where | Wi-Fi Edition | Ethernet & Wi-Fi Edition |
|---|---|---|
| **Radio** | The GPIO choice is replaced by the label **GPIO préconfigurées** (pre-configured GPIO) | The GPIO choice is replaced by the label **GPIO préconfigurées** (pre-configured GPIO) |
| **Network › Connection** | The **Ethernet** choice is no longer offered (this box has no Ethernet port) | The board type and Wi-Fi fallback are replaced by an automatic configuration tile, see [below](#specifics-for-ethernet--wi-fi-boxes) |

> [!TIP]
> To get the manual setting back, click **5 times quickly** on the **GPIO préconfigurées** label (Radio page) or on the title of the **Édition Ethernet & Wi-Fi** tile (Network page). It comes back until the next page reload.

## Where to find the assistant

For easy access, the tool is available in two different places in the interface:

### 1. Right on the home page
At the very bottom of the home page (only visible while no room, device or group has been created yet), a box invites you to open the tool if you own one of my boxes.

<img width="800" src="https://github.com/user-attachments/assets/abf282d6-214b-427e-9fa4-b2f2cd4dea54" />

### 2. In the **Options** tab
If your dashboard is already set up, don't panic: there is also a dedicated, clearly labelled button in the **Options** tab to start the tool at any time.

<img width="800" src="https://github.com/user-attachments/assets/47b24bea-08b7-4bdc-ac5a-014a1e217f39" />

### Specifics for Ethernet & Wi-Fi boxes

Your box runs on Wi-Fi first. Switching to Ethernet takes a few clicks once the assistant has run:

1. **Set up your Wi-Fi first.** It takes over if the Ethernet cable is unplugged. Until a Wi-Fi network is saved, the Ethernet tile stays greyed out and offers `CONFIGURER LE WI-FI` (Configure Wi-Fi).
2. **Plug in the Ethernet cable**, then in **Network › Connection**, choose **Ethernet**.
3. **Click `CONFIGURER L'ETHERNET AUTOMATIQUEMENT`** (Configure Ethernet automatically) in the **Édition Ethernet & Wi-Fi** tile. It picks the **WT32-ETH01** board for you and turns on the **Wi-Fi fallback**. There is nothing else to set.

   <img width="800" src="https://github.com/user-attachments/assets/6170072c-76e7-4b78-ba01-52cd196a21a4" />

4. **Click `ENREGISTRER`** (Save), then confirm with `PASSER EN ETHERNET` (Switch to Ethernet).

> [!IMPORTANT]
> **Your box changes address.** It restarts on Ethernet, and the Ethernet connection isn't the same as the Wi-Fi connection: your router gives it a **different IP address**. The page you have open will stop responding. The switch can take a little while: wait a moment, then reload the page if you were on **http://espsomfyrts.local** (or the hostname you chose), or open that address. If that address doesn't open, look for **ESPSomfyRTS** in your router's list of connected devices: it shows the new IP address.

> [!NOTE]
> If the Ethernet cable is unplugged, the box switches back to your Wi-Fi by itself after a short delay, and is reachable again at its Wi-Fi address.

> [!WARNING]
> **Don't change the board type by hand.** The tile selects the right model automatically. Choosing a different board type would apply the wrong pin (GPIO) assignment. Because of the electrical conflicts this can cause on the network chip's communication lines, **a wrong setting can make the interface unreachable, or even permanently damage the hardware.**

## 🔎 Reading the serial monitor

The serial monitor shows what your box is doing, live: useful for diagnosis, or if you're asked for it when there's a problem. The [Serial monitor](Serial-Monitor.md) page explains step by step how to read it from your browser, without installing anything, using [web.esphome.io](https://web.esphome.io).

> [!IMPORTANT]
> On the Ethernet & Wi-Fi Edition, **the log stays empty until you click `Reset device`** in the log window. This isn't a fault: the built-in USB module is wired to the box's reset line. That button restarts it, then the log scrolls, start-up included.
>
> So the box restarts: it leaves the network for a few seconds, then comes back. Other serial terminals (the Arduino IDE monitor, `screen`, `minicom`…) also restart it as soon as they open the port.
<br>

---

## Thank you for your trust!

Thank you for choosing one of these boxes. Your purchase directly supports the time I spend developing and maintaining this project.
