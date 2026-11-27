<img width="100%"  src="https://github.com/user-attachments/assets/c655bbf5-957a-4d88-87ba-7e45202c4237" />

While it runs, the device writes a running commentary of what it's doing over the
**USB cable**: what it starts up, which network it connects to, what the radio receives, and —
above all — what happened just before a crash. This stream is called the **serial port**,
or *serial monitor*.

It's the only witness still talking when the web interface stops responding. This page
explains how to read it **without installing anything**, from a plain web page, then lists
the usual tools for those who already have them.

## When do you need it?

Never in day-to-day use. You come to it in four situations:

- the device **won't start**, or keeps restarting in a loop;
- it **won't join the network**, or gets no IP address;
- it **crashes at random** and you're looking for what comes before it cuts out;
- you're asked for a log to **go with a bug report**.

> [!NOTE]
> For radio-only problems — a motor that doesn't respond, a remote
> that isn't recognised — the interface already has its own view, the **Radio Log**, which is
> much easier to read. The serial port only adds something if the device itself is in trouble.

## What you need

| Item | Why | Common trap |
|---|---|---|
| A **computer** | the reading is done over the cable | can't be done from a phone |
| A **USB data cable** | it has to carry a signal, not just power | many cables only charge: **the number one cause of failure** |
| The board's **USB-serial driver** | it's what makes the port appear | CP2102 or CH340 depending on the model |
| A **compatible browser** | Chrome, Edge, Brave, Opera, or Firefox from version 151 | Safari can't talk to the serial port |

Nothing else: no account, no software to install.

> [!NOTE]
> The communication **speed** is **115,200 baud**. That's the firmware's speed, and
> the page uses it automatically — you don't need to set anything. Remember it all the
> same: with another tool, the wrong speed doesn't give an error, it gives
> **garbled characters**.

---

## The easy way: web.esphome.io

> [!IMPORTANT]
> **Why a page from ESPHome, which is a different firmware?** Because its serial console
> is **generic**: it opens the USB port and shows what comes out, whatever
> firmware is running on the other end. We are **not** going to install ESPHome, only borrow
> its reading window.

> [!CAUTION]
> On this page, **two buttons must never be touched**:
>
> | Button | What it actually does |
> |---|---|
> | **Prepare for first use** (blue button, rocket icon) | erases the chip and installs ESPHome on it |
> | **Install** (up-arrow icon) | writes a different firmware in place of yours |
>
> Either way, ESPSomfy-RTS, your configuration **and your pairings** are gone.
> We'll only use the **Logs** button.

### 1. Plug in the device

Connect it to the computer with the USB cable. It can stay powered and keep working
normally: reading the serial port doesn't interrupt it.

> [!WARNING]
> **Pre-assembled box, Ethernet & Wi-Fi Edition:** on this model, the built-in USB module is
> wired to the reset line. The log window **stays empty** until you
> click **Reset device** (step 4), and that click **restarts** the box:
> it leaves the network for a few seconds. See
> [Pre-assembled boxes](Pre-assembled-Boxes.md#-reading-the-serial-monitor).


### 2. Open the page and connect

Go to **[web.esphome.io](https://web.esphome.io)**. A card titled **ESP
Device** appears, marked **Not connected**, with a **Connect** button.

> [!NOTE]
> The page is translated according to your browser's language. The labels quoted here are
> the English ones; in French they read *Connection*, *Journaux*, *Installer*,
> *Préparation pour la première utilisation*.

Click it. A small window opens, listing your computer's serial ports.
This window comes **from the browser**, not the site: it's the browser asking you for
permission to access the hardware. Choose your device, then **Connect**.

<img height="500" src="https://github.com/user-attachments/assets/caa4e00f-41cf-4ff4-b7ee-f8df6d897159" />

> [!TIP]
> **No port in the list?** Four causes, most common first:
>
> 1. the cable only carries power — try another one, this is the most common case;
> 2. the USB-serial driver isn't installed (the page itself offers links for CP2102, CH340, CH9102);
> 3. the browser doesn't support the serial port (Safari, or Firefox before 151);
> 4. the device was plugged in **after** the window opened — close it and start again.

### 3. Open the logs

Once connected, the card turns green and shows **Connected**. A row of buttons
replaces the connect button: a large blue button, then three small icons, then
disconnect.

The one you want is **the second of those three icons, the one shaped like a page of
text**. Its tooltip, when you hover over it, says **Logs** — hover to make sure rather
than counting positions. It's the only button on this card you need.

### 4. Read

A black window opens, first showing *"Waiting for serial port…"*, then the lines
arrive as they come, with timestamps.

Because the device was already running, you join **in the middle** of what it's saying. To see the
start-up from the very first line — that's almost always where the
answer is — click **Reset device**: it restarts without being unplugged, and
you see its whole boot sequence.

Four controls, at the top right of the window:

| Control | Effect |
|---|---|
| **Reset device** | restarts it so you can see start-up from the beginning |
| **Download logs** | saves everything shown to a text file |
| **Clear** | empties the display, without touching the device |
| **Stop** / **Start** | pauses reading, then resumes it |

To attach a log to a report, the right way is: **Reset device**,
let it run until the problem happens again, then **Download logs**.

### 5. Close

Click **Disconnect** when you've finished.

> [!WARNING]
> **The serial port can't be shared.** While this console is open, no other
> tool can read the port — and above all, **no firmware installation is
> possible**. An installer that says "port busy" is almost always telling you
> that a console has been left open in another tab.

---

## When nothing shows up

| What you see | Most likely cause | What to do |
|---|---|---|
| No port offered | power-only cable, or missing driver | change the cable, then install the driver |
| "Failed to open serial port" | another console, an IDE or an installer already holds the port | close the other window, unplug/replug if needed |
| The window stays empty | the device only talks when it has something to say; on the **Ethernet & Wi-Fi Edition**, it's waiting for that click | click **Reset device**: a start-up always talks |
| Garbled characters | wrong speed, or board left in write mode | check 115,200 baud; unplug and replug the device |
| Text, then nothing, while the device is running | reading has been paused | click **Start** |

---

## For advanced users

All the tools below read exactly the same stream. Which one you choose is a matter
of habit — with one exception: **only one program at a time** can open the port.

> [!NOTE]
> On the **Ethernet & Wi-Fi Edition** of the pre-assembled boxes, these tools **restart
> the device** when they open the port. The stream then starts again from boot, but the
> network drops for a few seconds. With PlatformIO, the options `monitor_dtr = 0` and
> `monitor_rts = 0` in `platformio.ini` avoid this restart.

### VS Code

Two routes, depending on what you have installed:

- **PlatformIO extension** — the plug icon in the status bar opens the monitor on the
  detected port. The speed is read from `platformio.ini` (`monitor_speed = 115200`), so
  there's nothing to set. On the command line: `pio device monitor -b 115200` (and `pio device list`
  to find the port name);
- **Serial Monitor extension** (published by Microsoft) — a panel next to the terminal:
  choose the port, set **115200**, then *Start Monitoring*. Lighter if you don't
  compile the firmware yourself.

### Arduino IDE

**Tools → Port** to choose the device, then **Tools → Serial Monitor**. In the
window, set the speed at the bottom right to **115200 baud**. Make this a habit:
by default the IDE offers 9,600, which only produces gibberish.

### On the command line

| System | Command |
|---|---|
| Linux | `tio -b 115200 /dev/ttyUSB0` (quit: `Ctrl+T` then `q`) |
| Linux | `screen /dev/ttyUSB0 115200` (quit: `Ctrl+A` then `K`) |
| Linux | `minicom -D /dev/ttyUSB0 -b 115200` |
| macOS | `screen /dev/cu.usbserial-0001 115200` |
| Windows | **PuTTY**, in *Serial* mode: `COM3`, speed `115200` |
| Anywhere | `pio device monitor -b 115200` if PlatformIO is installed |

**On Linux**, if the port exists but access is denied, it's a permissions
issue: your account must belong to the group that owns the port — `dialout` on
Debian and Ubuntu, `uucp` on Arch.

```bash
sudo usermod -aG dialout $USER
```

You need to **log out and back in** for this change to take effect.

> [!TIP]
> **To keep a log in a file**, use the tool's own recording function
> (`tio -l`, or the **Download** button in the web consoles) rather than redirecting the
> terminal: several monitors — including PlatformIO's — **refuse to work**
> as soon as their output isn't a real terminal, and you lose exactly the trace
> you wanted to keep.

---

## Before you publish a log

A log is plain text, and it describes your installation. **No password
appears in it** — the firmware replaces them with asterisks — but you will find:

- your **Wi-Fi network name**, and those of nearby networks;
- the **IP and MAC addresses** of your installation;
- the **radio addresses** of your devices and remotes.

Nothing dangerous in itself, but read the file through before attaching it to a public post,
and replace anything you don't want to publish. A partly redacted log is still
perfectly usable for diagnosis.

> [!NOTE]
> All of this happens **between your browser and the USB cable**. Neither ESPHome's page nor
> the project's sends anything to a server: nothing leaves your
> computer unless you publish the file yourself.
