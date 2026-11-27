This page covers the **Firmware** sub-tab of the **System** tab: the ESP32's health,
updates, backup and restore, and the project credits. The
settings are described in the order they appear on screen.

---

<img width="100%" src="https://github.com/user-attachments/assets/6bfb8200-0776-439b-9a37-20602d2540a5" />

## 1. Device status

The first block can't be changed: it's a readout.

| Line | What it shows |
| --- | --- |
| **Chip** | The ESP32 model detected (`ESP32`, `ESP32-S2`, `ESP32-S3`, `ESP32-C3`…). |
| **Processor** | The number of cores and the processor frequency, for example `Dual-Core @ 240 MHz`. |
| **System Memory (RAM)** | The bytes currently free, then two markers: **Min Level**, the lowest ever reached since start-up, and **Max Block**, the largest contiguous block that can still be allocated. |
| **Flash Memory** | The total flash size in MB and **its** bus speed in MHz, then the file system's free space out of its total, in KB, and the percentage used. |
| **Uptime** | How long the device has been running, and how long its network connection has held. |

> [!NOTE]
> The MHz on the **Flash Memory** line are the flash bus's, not the processor's —
> that one is on the **Processor** line just above. It's normal to see two
> different frequencies.

> [!NOTE]
> The **Uptime** line only appears in this tab on narrow screens. On a wide screen,
> the information is already shown all the time in the top bar, so it isn't
> repeated here.

The two RAM markers are for diagnosis. **Max Block** often matters more than the total
free: an encrypted connection needs a single unbroken block, and can fail even
though there seems to be memory left — it's just scattered. A **Max Block** that collapses
over the hours is the sign to watch for.

## 2. The status banner

Just below, a banner sums up the situation.

| Colour | Message | Meaning |
| --- | --- | --- |
| Green | *Your system is up to date* — *No action is required* | The installed version is the latest published. |
| Red | *Update available* — *Version X is ready to be installed* | A newer version exists. |
| Red | *Manual action required* — *Version X requires a mandatory USB flash* | The jump requested can't be done remotely — see [Updating](Updating.md). |

<img width="850" height="57" alt="Update available banner" src="https://github.com/user-attachments/assets/63f7ae77-81e8-4602-85db-137e7e4b3c03" />

> [!TIP]
> The red banner is **clickable**: it opens the GitHub update window directly.
> The same warning also appears at the top of the interface's other pages, also
> clickable.

If you turned off **Updates** in [Options](Options.md), this banner stays green whatever
happens: without checking, the device can't know a new version exists.

## 3. Updates

Three buttons, each opening a window.

| Button | What it says |
| --- | --- |
| `GitHub Update` | *Recommended update (Firmware + LittleFS)* — the device downloads both halves from GitHub and picks the right files for your chip itself. |
| `Firmware Update` | *Local update of the system core (.bin)* — a file from your computer; the web interface isn't touched. |
| `LittleFS Update` | *Local update of the web interface only (.bin)* — the reverse: the interface and languages, without touching the firmware. |

> [!TIP]
> `GitHub Update` is the right answer in the vast majority of cases: it's the
> only one that keeps both halves in step.

The details of each window, the files published by a *release* and choosing the one that
matches your chip, why a version may not appear in the
list, and moving between v2 and v3: see **[Updating](Updating.md)**.

## 4. Clear cache

Forces the browser to reload the interface. Do this every time **after** an update:
otherwise, the browser may keep showing the old interface, with odd things on
screen. If that persists, clear the cache from your browser itself.

## 5. Documentation and reporting

* `Documentation` — opens this configuration guide.
* `Report an issue` — opens a pre-filled bug report form on GitHub.

> [!IMPORTANT]
> This form is for **firmware bugs** only. For a configuration question or an
> installation to fine-tune, use this documentation,
> [Discussions](https://github.com/xkain/ESPSomfy-RTS/discussions) or the
> [HACF forum](https://forum.hacf.fr/t/espsomfy-rts-pour-la-gestion-de-vos-volets-rts-nouvelle-version/77935) (in French):
> you'll get an answer faster there.

## Backup and restore

<img  height="720" alt="Restore window" src="https://github.com/user-attachments/assets/52fce7f6-ac2f-45d6-86ee-640d18b1d6a8" />

* **Backup** — downloads a `.backup` file containing your whole configuration.
  Keep it somewhere other than the device. Its format is documented on the
  [Backup file anatomy](Backup-File-Anatomy.md) page.
* **Restore System** — opens the window above: you first choose **what** you
  want to restore, then the file, then you upload.

### The six restore boxes

| Box | What it brings back | Ticked by default |
| --- | --- | --- |
| **Restore devices and groups** | Rooms, devices and groups, with their radio addresses and rolling codes | Yes |
| **Restore repeaters** | The repeater addresses | No |
| **Restore system settings** | Hostname, time zone, NTP server, language, colour, uPnP, update checks | No |
| **Restore network settings** | Connection type, DHCP or fixed IP, and the Ethernet wiring | No |
| **Restore MQTT settings** | Host, port, topics and discovery | No |
| **Restore radio settings** | Frequency, bandwidth, power, pins and board preset | No |

> [!WARNING]
> **Tick "Restore system settings" whenever you tick network, MQTT or radio.**
>
> The declared length of the system settings block is shorter than the real block. When
> this box is unticked, the device skips that block using the declared length and starts
> reading the following ones fourteen bytes too early: the network or radio settings are then
> rebuilt from shifted data, and saved as they are. In one measured case, the
> connection type came back as "not set" and the IP address as `1`.
>
> Ticking "Restore system settings" puts the reading back on track and has no downside.
> See [Backup file anatomy](Backup-File-Anatomy.md) for details of the format.

> [!NOTE]
> Two things never come back from a backup:
> * **The** Wi-Fi and MQTT **passwords**, which aren't written into it. You have to enter them again.
> * **The Ethernet wiring**, if you restore to a different device from the one that made the
>   file. This is deliberate: that wiring describes the original board, not yours.

## Credits

* **Project Author** — **xkain**, development of this interface and this version.
* **Historical Author** — **rstrouse**, author of the original ESPSomfy-RTS project.
* **Project Contributors** — **glich34**, **dirstel** and **jcrespoc**

---

## Next step

* [Updating](Updating.md) — the three windows in detail, and the files in a *release*.
* [Backup file anatomy](Backup-File-Anatomy.md) — the `.backup` file format, record by record.
* [Factory Reset](Factory-Reset.md) — back to factory state, in two levels.
* [Serial monitor](Serial-Monitor.md) — read the device's messages when the interface isn't enough.
