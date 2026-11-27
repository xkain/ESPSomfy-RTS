This page covers the **Connection** sub-tab, described in the order the settings appear
on screen.

> [!NOTE]
> **First-time setup?** On first start-up, the device opens its own Wi-Fi network
> called `ESPSomfyRTS`, and its interface is at `http://192.168.4.1`. That's
> where you'll fill in this tab. And if your module has a wired RJ45 Ethernet
> port, plug the cable in now: it will make things simpler later.

---

<img width="100%" src="https://github.com/user-attachments/assets/54c13725-41c1-4527-97d1-bad4e6bc8155" />

## 1. The information block (at the top)

The first block isn't a setting: it's a **snapshot** of the current connection. What it
shows depends on the active mode.

* **On Wi-Fi**: the `Network:` (SSID) the device is connected to, the `Channel:` in use, and the
  signal strength in dBm with its bar icon.
* **On Ethernet**: the link `Status:` and its `Speed:` (10 or 100 Mbit/s).
* **Either way**: the device's `MAC Address`, at the bottom of the block.

> [!TIP]
> Write this MAC address down somewhere. It's what you'll give your router to
> create a **DHCP reservation** — see
> [DHCP / Static IP](DHCP-and-Static-IP.md#the-right-way-a-dhcp-reservation).

## 2. Choosing Wi-Fi or Ethernet

Just below, two large tick buttons decide **everything else on the page**:

* **Wi-Fi** — *"Use the wireless connection via Wi-Fi network"*
* **Ethernet** — *"Uses Ethernet cable instead of Wi-Fi"*

Selecting one shows its settings and hides those of the
other mode.

> [!IMPORTANT]
> **Only one adapter works at a time.** To avoid overloading the ESP32's processor,
> Wi-Fi and Ethernet are never active at the same time. There's no "dual WAN".

## Using a Wi-Fi connection

With **Wi-Fi** selected, the page shows, from top to bottom:

### a. The two switches

**`Hidden Wi-Fi network`** — *"Allows connection to a network that does not broadcast its name"*

Only turn this on if your router doesn't broadcast its network name publicly. In that case,
the scan won't help: you'll need to type the `Network SSID` by hand.

> [!CAUTION]
> Ticking this box **disables roaming** just below it: its switch goes back to
> Off and stops working. Both features rely on scanning the surroundings, which is
> impossible on a network that won't let itself be seen. In practice, a hidden SSID
> brings three limitations:
> 1. **No choice of the best signal:** the device connects to the first access point that
>    answers, not the strongest one.
> 2. **Hit-and-miss network restarts:** after a general outage, it may attach to your
>    main router even if a nearer repeater offers a much better signal.
> 3. **No roaming:** moving smoothly from one access point to another isn't available.

> [!TIP]
> **Hiding your SSID doesn't improve security.** On the contrary, it forces your devices to
> actively search for the network, which can make them easier to identify from outside. For
> real security, rely on a long password and **WPA2/WPA3** encryption. For a
> stable connection, leave your SSID visible.

**`Enable roaming`** — *"Always targets the nearest Wi-Fi access point"*

**Off by default.** This setting is for **mesh networks** made up of
several access points broadcasting the same network name. Once on, the device follows the access point
with the best signal without ever turning off its Wi-Fi
radio:

* **Background scan:** periodically (about every 5 minutes), it looks for
  other access points broadcasting the same SSID, without interrupting the connection.
* **Switching threshold:** it only changes access point if the current connection is
  **completely lost**, or if another access point offers a signal at least
  **10 dBm** stronger. This deliberately wide margin avoids "ping-ponging" between two access points
  of similar strength.

Leave roaming **off** in these cases, which cover most installations:

* you only have one router / access point;
* your network doesn't use mesh technology;
* you pin the device to a specific access point with *AP Binding* on the router.

> [!TIP]
> Conversely, if you see frequent disconnections while roaming is on
> and your device doesn't move, turn it off: it will settle the connection on a
> single access point.

### b. The scan and credentials

The **`SCAN WI-FI`** button searches for networks in range. The list
appears just above the button, sorted by signal strength (multiple access points of the same
mesh network are merged under the strongest signal). **Click your network** in the
list: its name is copied into the `Network SSID` field automatically.

All that's left is to enter your Wi-Fi `Password` — the eye icon
lets you check what you typed before confirming.

> [!NOTE]
> If your network doesn't appear in the list, you can always type its name directly
> into the `Network SSID` field. This is required for a hidden network.

Finish with the **`SAVE`** button at the bottom of the page, then go on to
[Joining your local network](#joining-your-local-network).

## Using an Ethernet connection

> [!CAUTION]
> **Read this before touching the settings.** Many ESP32 boards have no
> protection between the microcontroller and the Ethernet chip. A wrong pin assignment
> can **physically and permanently damage** the hardware. Take the time to check.

With **Ethernet** selected, the page shows, from top to bottom:

### a. `Wi-Fi fallback`

*"Switches to Wi-Fi if Ethernet fails"*

Switches back to Wi-Fi automatically if the cable is unplugged or the wired link
fails.

> [!IMPORTANT]
> **The order of operations matters.** In Ethernet mode, the Wi-Fi fields are hidden. For
> this fallback to work, you need to:
> 1. first set up and **save** the Wi-Fi (previous section);
> 2. then come back, select **Ethernet**, turn on `Wi-Fi fallback` and save.
>
> Without a Wi-Fi network actually saved, ticking the box does nothing.

### b. `Board type`

This drop-down list offers the most common Ethernet/PoE boards. Choosing one fills in
all the hardware settings automatically (PHY type, clock mode, address and pins)
and **hides the detailed settings** — there's nothing else for you to do.

| Board | Power | MDC | MDIO |
|---|---|---|---|
| **WT32-ETH01 — Wireless Tag** | GPIO16 | GPIO23 | GPIO18 |
| EST-PoE-32 — Everything Smart | GPIO12 | GPIO23 | GPIO18 |
| ESP32-EVB — Olimex | None | GPIO23 | GPIO18 |
| ESP32-POE — Olimex | GPIO12 | GPIO23 | GPIO18 |
| T-Internet POE — LilyGO | GPIO16 | GPIO23 | GPIO18 |
| wESP32 v7+ — Silicognition | None | GPIO16 | GPIO17 |
| wESP32 < v7 — Silicognition | None | GPIO16 | GPIO17 |

> [!TIP]
> **Owners of my Ethernet & Wi-Fi box:** choose `WT32-ETH01 - Wireless Tag`.
> It's the only setting to make.

The table above only lists the pins used by the Ethernet chip. To find out
**which pins you have left** for wiring the CC1101 transceiver on each of these boards,
see [Components → Pin configuration](Components.md#pin-configuration),
which gives the full diagram board by board:
[WT32-ETH01](Components.md#wt32-eth01) · [Olimex ESP32-PoE/EVB](Components.md#olimex-esp32-poeevb) ·
[LilyGO T-Internet POE](Components.md#lilygo-t-internet-poe) · [wESP POE](Components.md#wesp-poe) ·
[EST-PoE-32](Components.md#esp-poe-32).

> [!NOTE]
> An Ethernet port takes up a large share of the ESP32's pins. On these boards, the number
> of GPIOs left for the CC1101 is therefore much smaller than on a Wi-Fi model.

The **`Set manually`** option, on the other hand, shows all the fields
(`PHY Chip Type`, `PHY Address`, `Clock Mode`, `Power Pin`, `MDC Pin`, `MDIO Pin`)
for a board that isn't in the list. Refer to its technical documentation.

<img width="500" src="https://github.com/user-attachments/assets/312d208a-a8b6-4df6-bdc6-dae667e39ce8" />

> [!WARNING]
> Even if your board is in the list, check that the manufacturer hasn't changed hardware
> revision since: a different pinout under the same product name does exist.

### c. Confirming the save

Because a wrong Ethernet setting can destroy the hardware, the **`SAVE`** button doesn't write
anything straight away: it first opens an **`Ethernet Settings`** window summarising the
pins chosen.

1. **Read through** each line of the summary.
2. **Tick** the confirmation box ("I confirm these settings are correct for my
   hardware…").
3. The window's `SAVE` button then **becomes active**.
4. **Click it** to write the configuration and restart the network interface.

   <img width="600" src="https://github.com/user-attachments/assets/ca362b9f-17eb-4e46-b0a2-917cacea50f2" />

Once confirmed, the device tries to connect over the cable. You can follow the result in the
information block at the top of this tab, which now shows `Status:` and `Speed:`.

<img width="600" src="https://github.com/user-attachments/assets/b09ea05f-f097-4e1d-afdf-6c1fbb88cd9f" />

### d. The IP address has changed

> [!WARNING]
> **When you switch from Wi-Fi to Ethernet, the device's IP address changes.** If you're
> used to reaching the interface by its IP address, the old one will stop responding.

The reason is simple: Wi-Fi and Ethernet are **two separate network interfaces**, each
with its own MAC address. So your router sees them as two different devices and gives them
**two different IP addresses**. Three practical consequences:

* **Finding the device:** open your router's admin interface and look at the
  list of connected devices (often called "Connected devices", "Network" or "DHCP")
  to read the new address assigned. The hostname (`http://<hostname>.local`), on the other hand, stays
  valid in both modes and avoids this problem entirely.
* **Your reservations and bookmarks:** a browser bookmark, a Home Assistant integration
  set up by IP, or a [DHCP reservation](DHCP-and-Static-IP.md#the-right-way-a-dhcp-reservation)
  made for Wi-Fi do **not** carry over to Ethernet. You need to redo them with the
  new address.
* **The information block only shows one MAC at a time** — the active interface's. To
  note down both MAC addresses, check this block once on Wi-Fi and once on Ethernet.

> [!TIP]
> **If you use `Wi-Fi fallback`**, the address will change every time it switches between cable and
> wireless. In that case, create a
> [DHCP reservation](DHCP-and-Static-IP.md#the-right-way-a-dhcp-reservation) **for both
> MAC addresses** on your router, giving them two fixed addresses you know — or
> better, get into the habit of using the hostname.

---

# Joining your local network

Saving the credentials isn't enough: **as long as a device stays connected to the
`ESPSomfyRTS` access point, the device won't switch** to your network. That's what the
blue banner at the bottom of the Connection tab reminds you.

### The procedure

1. **Disconnect** your computer or phone from the `ESPSomfyRTS` Wi-Fi network, and
   rejoin your usual network.
2. **Wait.** Seeing nobody left on its own access point, the device closes it and
   tries to join your network with the credentials you entered.
3. **The address changes.** `http://192.168.4.1` is no longer reachable: your router
   now assigns the device an IP address.

### Finding the interface again

* **By hostname (the simplest)**
  * On **macOS, iOS and Linux**: `http://<hostname>.local`
  * On **Windows**: `http://<hostname>`, provided you have turned on the **uPnP (SSDP)** option
    in [Options](Options.md). That's also where you
    set the hostname itself.
* **By IP address** — if the hostname doesn't respond straight away (mDNS sometimes
  takes a minute or two to propagate), open your router's admin interface
  to read the address assigned to the device.

### If nothing responds

* **Wait 2 minutes**, then check there's no typo in the Wi-Fi
  password — by far the most common cause.
* After a long failure, the device **turns its `ESPSomfyRTS` network back on by itself**: you
  can reconnect to it to fix the configuration.
* If it's still completely unreachable, see [Factory Reset](Factory-Reset.md).
* If the connection fails **without a password error**, read the section
  [The device won't join my Wi-Fi](#the-device-wont-join-my-wi-fi) below.

---

# The device won't join my Wi-Fi

You've entered the right network name and the right password, and yet the device never
shows up on your network. Before suspecting the hardware, go through **your
router's** settings, in this order.

## 1. The router's security protocol

**This is the most common cause, and the least obvious one to guess.** Routers left
on an old or overly permissive security mode (`WPA`, `WPA/PSK`, `WPA-TKIP`) stop the ESP32 from
associating, with no helpful error message at all.

> [!TIP]
> **The fix:** in your router's interface, Wi-Fi section, set the encryption to
> **WPA2** (or `WPA2-PSK (AES)`, or the mixed `WPA2/WPA3` mode). Then restart the
> ESPSomfy-RTS device. That's exactly what got one user going after several days of
> searching:
>
> > *"I changed the router's Wi-Fi security protocol from wpa/psk to wpa2 and then
> > everything worked."*

Conversely, a network set to **WPA3 only** can also cause problems: again, the mixed
`WPA2/WPA3` mode is the safest setting.

## 2. The frequency band

The ESP32 **only works on 2.4 GHz**. It will never see a network broadcast only on
5 GHz or 6 GHz. If your router splits its bands into two separate names, make sure you pick
the **2.4 GHz** one.

## 3. Filters and restrictions

* **MAC address filtering**: if it's on in your router, add the device's
  [MAC address](#1-the-information-block-at-the-top), or turn filtering off for the
  first connection.
* **Captive portal / guest access control**: a "guest" network that requires a login page
  won't work, as the device has no browser to sign in with.

## 4. The name and password

* **Special characters:** a password or SSID containing accents, trailing spaces
  or unusual characters is a classic cause of failure. If in doubt, test
  with a simple, long password (letters and numbers).
* **Hidden SSID:** if your network is hidden, the `Hidden Wi-Fi network` option must be on —
  the scan will never find it.

## 5. As a last resort

If nothing works, check the [serial port logs](Serial-Monitor.md): they show
the reason the association was refused in plain text, which lets you tell a rejected password
from an incompatible protocol.
