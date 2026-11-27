This page covers the **Options** sub-tab of the **System** tab, described in the order the
settings appear on screen.

---

<img width="100%" src="https://github.com/user-attachments/assets/ec2ad1b2-6961-48ef-9d35-f81025734e37" />

## 1. The two assistants (at the top)

Before the settings, two buttons each open a help window. They don't change anything on
their own.

* **Box bought online** — a four-step pre-configuration assistant: time zone
  `Europe/Paris`, French interface, the box's own GPIO assignment, and turning the radio on.
  It is only for ready-made boxes — see [Pre-assembled boxes](Pre-assembled-Boxes.md).
* **Home Assistant** — explains what the integration is for and how to install it. The
  details are on the [Home Assistant](Home-Assistant.md) page.

> [!NOTE]
> The **Box bought online** button **only appears when the interface is in French**. In
> English, German or Spanish it stays hidden: the assistant only configures boxes sold in
> France.

## 2. Identity and time

| Setting | What it does |
| --- | --- |
| **Hostname** | The device's name on the network (32 characters at most). If you have several boxes, give them different names, otherwise they fight over the same name. |
| **Time zone** | Sets the local time. This is the time shown in the [Radio logs](Radio-Logs.md). |
| **Language** | **French**, **English**, **German** or **Spanish**. |
| **NTP Server** | The server that provides the time (32 characters at most). `pool.ntp.org` by default; enter your own if your network has no internet access. |

> [!NOTE]
> Changing the language reloads the page straight away; the choice is stored
> on the device without needing to click `Save`.

## 3. Network and updates

Two switches.

* **uPnP Broadcast (SSDP)** — the device announces itself on the network so other devices
  can find it on their own. On Windows, it then shows up in *File Explorer >
  Network*.
* **Updates** — the device periodically asks GitHub whether a newer version exists. When
  one does, a banner appears in the interface and in Home Assistant. The details are on the
  [Firmware](Firmware.md) page.

> [!NOTE]
> This switch only controls the **check**. Nothing ever installs itself:
> an update is always something you start.

## 4. Appearance

* **Display mode** — **Browser dependent** (the device follows your system's light or
  dark preference), **Dark mode** or **Light mode**.
* **Color** — the accent colour of buttons and menus, `#1a5fb4` by default.

> [!IMPORTANT]
> The colour is applied on screen as soon as you pick it, but it is **not saved
> yet**. Without a click on `Save`, it goes back to the previous one the next time the page
> loads.

## 5. The two buttons at the bottom

* `Reboot` — restarts the device. Unsaved settings are lost.
* `Save` — stores everything you changed on this page. Go through the options from top to
  bottom, then click once at the end.

---

## Next step

* [Security](Security.md) — protect access to the interface.
* [Firmware](Firmware.md) — device status, updates, backup and restore.
