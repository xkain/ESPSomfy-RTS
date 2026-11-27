This page details the **three update windows** in the **Firmware** sub-tab, and the
files they use. For a tour of the tab itself — status readout, status
banner, backup and restore — see [Firmware](Firmware.md).

---

## 1. Two halves, three windows

The device comes in two pieces, in two separate partitions:

* the **firmware**, the core of the system: the radio, the network, MQTT, the web server;
* **LittleFS**, the file partition: the web interface you're looking at, and the
  language files.

The three windows differ in which halves they write.

| Window | Writes | File source |
| --- | --- | --- |
| `GitHub Update` | **both** | downloaded by the device from GitHub |
| `Firmware Update` | the firmware only | a `.bin` from your computer |
| `LittleFS Update` | LittleFS only | a `.bin` from your computer |

> [!TIP]
> In the vast majority of cases, `GitHub Update` is the right answer: it's the
> only one that keeps both halves in step. The other two are for repairing a damaged
> half, installing a version you compiled yourself, or trying a fix
> before it is released.

## 2. The files in a release

A *release* publishes **thirteen files**, in three families. The sizes below are those
of v2.6.0, as a rough guide.

### The firmware, one variant per ESP32 model

| File | For |
| --- | --- |
| `SomfyController.ino.esp32.bin` | Classic ESP32, no PSRAM |
| `SomfyController.ino.esp32wrover.bin` | ESP32 with PSRAM (WROVER) |
| `SomfyController.ino.esp32s2.bin` | ESP32-S2 |
| `SomfyController.ino.esp32s3_4mb.bin` | ESP32-S3, 4 MB flash |
| `SomfyController.ino.esp32s3_8mb.bin` | ESP32-S3, 8 MB flash |
| `SomfyController.ino.esp32c3.bin` | ESP32-C3 |

About 1.1 to 1.3 MB each. **This is the file the Firmware Update window asks for.**

### The interface, one file for every ESP32

| File | For |
| --- | --- |
| `SomfyController.littlefs.bin` | every ESP32, no distinction |

About 1.4 MB. It does **not** carry a model name, and that's not an oversight: this partition
only holds files — pages, scripts, images, languages — and no code compiled for a
particular processor. That's also why the LittleFS window doesn't ask which model you
have. **This is the file the LittleFS Update window asks for.**

### The full image, for installing over USB

| File | For |
| --- | --- |
| `SomfyController.onboard.<model>.bin.zip` | one variant per model, the same six as above |

About 0.9 MB compressed. This image holds **everything**: the bootloader, the **partition
table**, the firmware and LittleFS. It's the only one that replaces the partition table, and so
the only way to do a first install or to cross from v2.x.x to v3
(see below).

> [!NOTE]
> The device ignores these archives completely: no remote update uses them.
> They are only for flashing over USB from a computer.

## 3. GitHub Update

<img width="500" alt="GitHub update window" src="https://github.com/user-attachments/assets/77bdf8ff-029f-40cb-8ae4-f5de26d8457e" />

The window shows the installed version, the list of available versions, and the release notes
for the one you select. A **Read the announcement on GitHub** link goes to the
*release* page. Get into the habit of reading them before starting anything: that's where
changes that need action from you are flagged. If need be, run them through a
translator.


### The device picks its own file

You don't choose a file: the device reads its ESP32 model and works out the name from it.

| ESP32 detected | Criterion | File used |
| --- | --- | --- |
| ESP32-S3 | flash ≥ 8 MB | `esp32s3_8mb` |
| ESP32-S3 | otherwise | `esp32s3_4mb` |
| ESP32-S2 | — | `esp32s2` |
| ESP32-C3 | — | `esp32c3` |
| ESP32 | PSRAM present | `esp32wrover` |
| ESP32 | no PSRAM | `esp32` |

Then, once the firmware is installed, it moves on to `SomfyController.littlefs.bin`. **Your configuration
is written to flash between the two**, which is why an update keeps it.

So the progress bar follows two downloads in a row. **Don't cut the
power.** At the end, the device restarts.

### What the list contains

| Type | Label | What it is |
| --- | --- | --- |
| **Stable** | `vX.Y.Z` | A published, tested version for everyday use. This is currently the only type published. |
| **Pre-release** | `vX.Y.Z` followed by `- Pre` | A version marked *pre-release* on GitHub. Selecting it shows a warning in red. |

### Why a version may be missing from the list

The list isn't GitHub's raw list of *releases*. For each version, the device reads the
**list of file names** published and works out which models are covered. Two filters then
apply.

* **The firmware for your ESP32 must be published in that version.** If its name isn't there, the
  version isn't offered to you — and just as well.
* **Only the last five *releases* are checked.** The device doesn't ask GitHub for more:
  a version older than those five will never appear, whatever your
  ESP32.

### Moving between v2.x.x and v3

If the selected version changes major number, the `Update` button is **disabled**
and a red message explains why:

> Upgrade to v3.0.0 is not possible due to a major partition table change.
> Manual USB flashing via the 'onboard' image is mandatory.

The block applies **both ways**: a v3.x.x, and every version to come, won't be able to
go back down to v2.x.x through this window. The reason is in
[The files in a release](#2-the-files-in-a-release) — only the `onboard` image carries the
partition table, and it can only be installed over USB.

### Before you start

> [!IMPORTANT]
> The window offers a `Configuration backup` button, which downloads a
> `.backup` file in your browser. Take it. An update normally keeps the
> configuration, but it's the only precaution that costs nothing.

## 4. Firmware Update

<img height="500" alt="Manual firmware update" src="https://github.com/user-attachments/assets/f7f5df90-a36e-45cb-98c4-ee6979695b83" />

Installs a `SomfyController.ino.<model>.bin` you already have on your computer. **The core of the
system only**: the web interface isn't touched.

The window checks the file's **name** before sending it. A name that doesn't contain `.ino.`
or doesn't end in `.bin` is rejected, with the message *This file is not a valid firmware
binary file.* So you can't pick the wrong half.

> [!WARNING]
> This check is on the name, **not the model**. A binary meant for a different ESP32 has a
> perfectly valid name and will be accepted: the device then goes silent and has to be reflashed
> over USB. Check yourself that the end of the name matches the **Chip** line in the status readout.

## 5. LittleFS Update

<img height="500" alt="Manual interface update" src="https://github.com/user-attachments/assets/92d8f4bd-cf32-4af1-bd95-9cc17210da81" />

Installs `SomfyController.littlefs.bin`. **The web interface only**: useful for repairing a
broken display without touching the firmware. Same name check, with the message *This file is not
a valid LittleFS binary file.*

> [!NOTE]
> This partition also holds the language files: replacing LittleFS reinstalls
> them all. A full USB flash, on the other hand, erases them — the chosen language may seem to have gone back to
> English until they are downloaded again.

## 6. After an update

Clear the browser cache — the `Clear cache` button in the [Firmware](Firmware.md) tab, or your
browser's own cache if the display still looks odd. Otherwise, the browser may keep
serving the old interface on top of the new firmware.

---

## Next step

* [Firmware](Firmware.md) — the whole tab: device status, backup and restore.
* [Backup file anatomy](Backup-File-Anatomy.md) — what a `.backup` contains, field by field.
* [Factory Reset](Factory-Reset.md) — start from scratch when nothing responds.
