This page covers the **first installation** of ESPSomfy-RTS: writing the whole ESP32 over USB,
from a browser, without installing anything on your computer. It's the route to take in two
cases — an ESP32 that has never had this firmware, and a device currently running the
original firmware by **rstrouse**.

Once the device is up and running, you won't come back here: later versions install from
the interface in two clicks — see [Updating](Updating.md).

---

## 1. Why USB, and not from the interface

The device is made of two partitions, the firmware and the web interface, plus a **partition table**
that says where each one starts. Updates through the interface rewrite the partitions, never the
table: they assume an ESP32 already divided up to the right sizes.

The so-called **onboard** image is the only one that contains everything — bootloader, partition
table, firmware and interface. It overwrites the ESP32 from the first byte to the last, and that's
exactly what a first installation needs.

| Your situation | The route to take |
| --- | --- |
| New ESP32, or firmware from another project | **This page** — USB, `onboard` image |
| rstrouse's original firmware | **This page** — USB, `onboard` image |
| Already on this firmware | [Updating](Updating.md), from the interface |

> [!WARNING]
> **Don't move from rstrouse's firmware to this one through its Firmware page.** That route isn't
> supported: it only replaces one half of the system, and leaves an interface and a
> firmware that don't understand each other. A full USB install is the only way.

## 2. What you need

* A **computer** with **Google Chrome**, **Microsoft Edge** or **Firefox 151** or later. It all
  relies on Web Serial, the technology that lets a web page talk to the USB port.
* A **USB data cable**. Many cables that come with chargers only carry
  power: with those, no port will appear.
* The `onboard` image for your ESP32 model, unzipped.

> [!NOTE]
> **Firefox can only do this recently.** Mozilla long refused Web Serial, and only added it
> in **Firefox 151**, released in May 2026. An earlier version won't see your ESP32 — and
> that's for desktop only: Firefox for Android doesn't offer it. **Safari still doesn't
> support it**, in any version.

## 3. Download the right image

Open the page for the latest published version:
[**github.com/xkain/ESPSomfy-RTS/releases/latest**](https://github.com/xkain/ESPSomfy-RTS/releases/latest)
— the full list of versions is on
[the Releases page](https://github.com/xkain/ESPSomfy-RTS/releases).

Expand its **Assets** section: it publishes thirteen files, and for a USB install
**only one concerns you**, the one whose name contains `onboard`.

<img height="500" alt="Assets section of a release" src="https://github.com/user-attachments/assets/46319e7d-4d99-4845-9ab7-7f9e539a2d33" />

| Your ESP32 | The file to take |
| --- | --- |
| Classic ESP32, no PSRAM | `SomfyController.onboard.esp32.bin.zip` |
| ESP32 with PSRAM (WROVER) | `SomfyController.onboard.esp32wrover.bin.zip` |
| ESP32-S2 | `SomfyController.onboard.esp32s2.bin.zip` |
| ESP32-S3, 4 MB flash | `SomfyController.onboard.esp32s3_4mb.bin.zip` |
| ESP32-S3, 8 MB flash | `SomfyController.onboard.esp32s3_8mb.bin.zip` |
| ESP32-C3 | `SomfyController.onboard.esp32c3.bin.zip` |

**Unzip the archive** to get the `.bin` inside: that's the file you'll
give the browser, not the `.zip`.

> [!NOTE]
> Both **pre-assembled editions** are built on an ESP32 without PSRAM:
> take `SomfyController.onboard.esp32.bin.zip`, for the Wi-Fi model and the
> Ethernet model alike. See [Pre-assembled boxes](Pre-assembled-Boxes.md).

> [!TIP]
> The other twelve files are only for updating a device that's already installed, and what
> each one does is explained in
> [The files in a release](Updating.md#2-the-files-in-a-release).

## 4. Before overwriting: the backup

If a device is already in use — on this firmware or on rstrouse's — **take a
backup before flashing**. The `onboard` image erases the whole ESP32, configuration included:
devices, groups, rooms, network, everything goes.

In the current interface, `System` tab > `Firmware` sub-tab, the
`Configuration backup` button downloads a `.backup` file in your browser. Keep it
safe: you'll load it again after the installation.

## 5. Flash over USB

We use **web.esphome.io**, the ESPHome project's flashing tool. It doesn't install
ESPHome: with the "choose a file" option, it writes the image you give it onto the ESP32,
as it is, from the first byte. It's the `esptool` utility ported to the browser, which
talks to the ESP32's bootloader over Web Serial — exactly what a command line would do,
without the command line.

Two reasons to prefer it: **nothing to install** on your computer — no Python, no `esptool`,
no PlatformIO — and the same procedure on Windows, macOS and Linux. That's also why the
`onboard` image is published as **a single file**: the bootloader, partition table,
firmware and interface are already merged at their respective addresses, so the tool
doesn't need to know anything about the project to install it correctly.

> [!NOTE]
> **The site follows your browser's language.** The screenshots below are from the
> French version; the labels in the steps are the English ones.

1. **Plug the device** into your computer with the USB cable.
2. Open [**https://web.esphome.io/**](https://web.esphome.io/) in one of the three browsers
   above.
3. Click `Connect`.

   <img width="80%" alt="web.esphome.io Connect button" src="https://github.com/user-attachments/assets/162a2581-90fb-427a-bdc7-3c013baa8e0d" />

4. A window lists the serial ports. Choose yours — often called `USB Single Serial`,
   `CP210x` or `CH340` — then `Connect`.

   * *If no port appears: try another cable, or install the CH340 / CP210x driver
     for your board.*

   <img width="80%" alt="Choosing the serial port" src="https://github.com/user-attachments/assets/0827930e-d7a9-43d0-a531-c846c07b9005" />

5. Click `INSTALL`, to the right of the blue `Prepare for first use` button —
   that one would install ESPHome, which isn't what we want.

   <img width="80%" alt="Install button" src="https://github.com/user-attachments/assets/f703cd01-7f01-4af2-9709-19e938f1f71c" />

6. Click `Choose file` and select the `.bin` you unzipped in step 3.

   <img width="80%" alt="Choosing the binary file" src="https://github.com/user-attachments/assets/fb0aeed7-6bff-4f85-a7aa-c25cd461cd45" />

7. With the file chosen, click `INSTALL` again to start writing.
8. **The installation runs in three stages**: connecting to the device, fully erasing
   the ESP32, then writing — only at that point does a progress bar appear.
   **Don't close the tab and don't unplug the cable.**

   <img width="33%" alt="Preparing" src="https://github.com/user-attachments/assets/5da0997f-7695-4558-a199-052ef3f233ab" /><img width="33%" alt="Erasing" src="https://github.com/user-attachments/assets/de1a3248-efe4-4be9-8edf-989cecc599b4" /><img width="33%" alt="Writing" src="https://github.com/user-attachments/assets/84d5b0ec-8f2a-487b-9d03-abcb4bbe4941" />

9. A message says the installation is finished, and the device restarts by itself.

   <img width="80%" alt="Success" src="https://github.com/user-attachments/assets/acc6630c-fab2-4e38-b0fb-0695708827c1" />

> [!NOTE]
> **Some boards need a nudge to accept the write.** The D1 Mini flashes as it is,
> just by plugging it in; the WT32-ETH01 has to be put into flash mode — on the pre-assembled
> Ethernet edition, a push-button underneath does that. See
> [Pre-assembled boxes](Pre-assembled-Boxes.md) and [Components](Components.md).

## 6. First start-up

The device comes out of the factory with no network, so it opens its **own Wi-Fi access point**.

1. From a phone or computer, connect to the `ESPSomfyRTS` network, with no password.
2. Open `http://192.168.4.1`.
3. If the interface looks incomplete, force the browser to refresh: **Ctrl + F5** on
   Windows and Linux, **Cmd + Shift + R** on Mac.
4. Enter your network details — the full procedure, for Wi-Fi and Ethernet, is in [Network connection](Network-Connection.md).

> [!IMPORTANT]
> **A full installation also erases the pre-configuration of the pre-assembled boxes**:
> time zone, language, GPIO assignment and radio activation go back to the universal
> settings. The interface includes an assistant that restores all four in one go — see
> [Pre-assembled boxes](Pre-assembled-Boxes.md). Without it, the radio stays silent: nothing will be transmitted.

## 7. If you were on rstrouse's firmware

Load your `.backup` again from the `System` tab > `Firmware` sub-tab. Your **devices,
groups and remote addresses** carry over: your motors don't need to be re-paired.

* **A compatibility warning appears during the restore.** It's expected, and doesn't
  mean it failed.
* **The GPIO assignment isn't restored.** The board selector this fork introduced
  can't work it out from an older file: you have to redo it by hand in the
  `Radio` tab — see [Radio setup](Radio-Setup.md).

> [!IMPORTANT]
> If your backup won't load, [open an
> issue](https://github.com/xkain/ESPSomfy-RTS/issues). The file can be analysed and fixed
> by hand so it can be read again.

---

## Next step

* [Network connection](Network-Connection.md) — join your network, over Wi-Fi or Ethernet.
* [Dashboard](Dashboard.md) — a tour of the interface, screen by screen.
* [Updating](Updating.md) — later versions, from the interface.
