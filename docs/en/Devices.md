A device is the "digital identity" of one of your motors: its radio address, its type,
its travel times. ESPSomfy-RTS needs it to talk to the motor **and** to stay in sync
with your physical remotes, because the RTS protocol never lets it query the motor.

---

<img width="100%" src="https://github.com/user-attachments/assets/ac1bee4e-9fb2-4b01-b38f-bd06978df882" />

## 1. What to know before you start

| | |
| --- | --- |
| **Number of devices** | 30 at most |
| **Linked remotes** | 7 per device |
| **Radio address** | 24 bits, generated from the ESP32's MAC address |

> [!IMPORTANT]
> **The motor never answers.** RTS only transmits one way: no motor confirms anything,
> and none says where it is. Everything the interface shows — position,
> percentage, movement in progress — is **calculated** from the travel times you
> enter. Hence the importance of the next two sections.

## 2. Creating the device

`ADD DEVICE` opens the form. Fill it in, then `CREATE`.

> [!NOTE]
> Until you click `CREATE`, nothing is saved and the buttons in the preview
> area stay greyed out. The `PAIR`, `LINK REMOTE` and `SET ROLLING CODE` options
> only appear afterwards.

Once the device is created, `CREATE` becomes `SAVE` for your later changes.

### Identification and type

* **Name** — up to 20 characters, any printable character.
* **Room** — puts the device in a room, **Home** by default. This is what feeds the
  [Dashboard](Dashboard.md) filter — see [Rooms](Rooms.md).
* **Type** — sets the icon, the buttons available and the functions offered. Only
  blinds have tilt, only garages have a light.

   | Icon | Name | Description | Functions |
   | :---: | :--- | :--- | :--- |
   | ![Roller Shade](https://github.com/user-attachments/assets/cfe3c9dc-bcd2-41dd-8424-da4806c34011) | **Roller shade** | A solid fabric that rises or lowers on a rotating tube at the top. | Up, Down, My |
   | ![Shutter](https://github.com/user-attachments/assets/d8a43f3e-0083-47ba-be9f-1329e71ac5a6) | **Shutter** (roller shutter) | A curtain of hinged slats that rolls up into a box. | Up, Down, My, Sun |
   | ![Blind](https://github.com/user-attachments/assets/18c205d2-261b-48bd-91fe-1884e45ce93f) | **Blind** (Venetian blind) | Slats joined by cords. Often includes a tilt mechanism. | Up, Down, My, Tilt, Sun |
   | ![Drapery Left](https://github.com/user-attachments/assets/aba77bcb-0dac-448a-98fe-82035af283fd) | **Drapery (left)** | A sliding track that opens from right to left (fixed on the left). | Up, Down, My, Sun |
   | ![Drapery Right](https://github.com/user-attachments/assets/d13eaea2-0ca1-4a8a-b554-800fe0d887ea) | **Drapery (right)** | A sliding track that opens from left to right (fixed on the right). | Up, Down, My, Sun |
   | ![Drapery Center](https://github.com/user-attachments/assets/87567977-fd45-4cbf-a441-b8df6a6d735c) | **Drapery (center)** | A two-panel curtain opening from the centre out to the sides. | Up, Down, My, Sun |
   | ![Awning](https://github.com/user-attachments/assets/c242cc14-d57c-4d1b-87c9-948f6bbce7fe) | **Awning** | A horizontal mechanism that extends to cover an area (a deck or terrace). | Up, Down, My, Sun |
   | ![Garage 1](https://github.com/user-attachments/assets/c264f57a-4377-40fc-abbd-7f61b7961cc1) | **Garage (1-button)** | A motor with a single cycling function (toggle). **Note:** use the 3-button version if you can. | Cycle, Light |
   | ![Garage 3](https://github.com/user-attachments/assets/c264f57a-4377-40fc-abbd-7f61b7961cc1) | **Garage (3-button)** | A garage door using separate commands: Open, Close and Stop. | Up, Down, My, Light |
   | ![Dry Contact](https://github.com/user-attachments/assets/b6f6dc10-7a66-4c10-a734-b544cc4f2b42) | **Dry contact** | RTS devices driving simple relays (alternating ON/OFF). | Cycle |
   | ![Dry Contact 2](https://github.com/user-attachments/assets/b6f6dc10-7a66-4c10-a734-b544cc4f2b42) | **Dry contact (2-button)** | Micro-receivers using one button to open and the other to close. | Up, Down |
   | ![Gate Left](https://github.com/user-attachments/assets/57b4b929-dcea-4e42-997c-de6f7e526441) | **Gate (left)** | A controller where Up opens and Down closes. Leaf shown on the left. | Up, Down, My |
   | ![Gate Right](https://github.com/user-attachments/assets/ff351bc2-cd2b-4ee8-988e-6f2618e4813a) | **Gate (right)** | A controller where Up opens and Down closes. Leaf shown on the right. | Up, Down, My |
   | ![Gate Center](https://github.com/user-attachments/assets/148a6d29-0e8f-48f9-ad72-cfbff06c2def) | **Gate (center)** (double gate) | A two-leaf gate opening from the centre out to the sides. | Up, Down, My |


   > **Tip for garage doors:** even if your physical remote only has one button,
   > try the **Garage (3-button)** type. Most recent motors accept separate
   > commands, which are far more reliable for automation than a single toggle.

* **Protocol** — **RTS** (standard), **RTW** (ASA Motors in Europe), **RTV** (a variant fixed at
  433.92 MHz), or **IO-Relay** / **IO-Remote** for wired control, described in
  [Motor control with GPIO](Motor-Control-with-GPIO.md).
* **Bits** — **56-bit** or **80-bit**. Motors with a tilt wheel often use
  80-bit.
* **Remote ID** — this device's 24-bit address.

> [!NOTE]
> **Protocol** and **Bits** default to what you set in
> [Radio setup](Radio-Setup.md).

> [!WARNING]
> **Two absolute rules about the address.**
>
> It must be **unique** — among your devices, your groups, and the physical remotes within
> range. Two devices sharing it respond to the same commands, and their rolling codes
> get mixed up.
>
> And it must **never change after pairing**: it's the address the motor has stored.
> Changing it means losing the link, which will have to be redone.
>
> *The firmware doesn't check this uniqueness yet in v2.6.0; it will from v2.6.1.
> Until then, it's up to you.*

### The preview area

<img height="101" src="https://github.com/user-attachments/assets/58a44f58-7725-4176-a9cf-632b8b26840d" />

It lets you try out your settings without leaving the form. The buttons are **greyed out** until
the device has been created, and they only use the **saved** values: after a
change, click `SAVE` before trying.

## 3. Travel times

Everything is in **milliseconds** — 1 s = 1000 ms. The default is 10,000, i.e. ten
seconds.

* **Up / Down Time** — how long a full travel takes, in each direction.
* **Tilt Type** — only appears for a **blind**:

| Type | What it is |
| --- | --- |
| **None** | No tilt mechanism. |
| **Tilt Motor** | A separate motor, driven by long presses. |
| **Integrated** | A single motor for tilt and lift: it tilts fully before lifting. |
| **Tilt Only** | Only the tilt can be controlled. |
| **Euro Tilt** | Motors handling short and long presses. |

* **Step (80-bit only)** — the tilt wheel's step size, from 1 to 1000. It takes a little
  trial and error to find the ratio between lift and tilt.

<p align="center">
  <img alt="Step Size setting" src="https://github.com/user-attachments/assets/53470159-e318-4c74-a079-af81021aa25e" />
</p>

> [!IMPORTANT]
> **Actually time it, each direction separately.** The weight of the curtain makes going up
> slower than coming down. Since the position shown is calculated entirely from these two
> numbers, a rough value means a percentage that drifts with every movement.

## 4. Options

### Sensors

* **Sun Sensor** — shows a sun icon on the dashboard, to turn on or
  off whether the motor takes the sun into account.

    <img width="471" src="https://github.com/user-attachments/assets/e0496fcb-2e0f-4de7-aa2e-2103dced03bd" />

* **Light Sensor** — for **Garage** types only, shows a light bulb icon.

   <img width="463" src="https://github.com/user-attachments/assets/ed4c5cea-ee0b-422b-a204-35f459f5f56a" />

> [!NOTE]
> These two options don't make anything up: they assume a physical sensor really is linked to the
> motor. And the sensor must also be linked to ESPSomfy-RTS for the interface to know what it has
> triggered — see section 7.

### Direction and display

* **Command (Invert)** — if the device goes down when you ask it to go up.
* **Position (Invert %)** — by default **100% = closed**, the Somfy convention. Tick it if you
  prefer the opposite.

> [!TIP]
> Inverting the commands is a band-aid: if the motor goes down when told to go up, it's
> the motor's own direction that should be fixed, on the motor. The box is there for cases where that isn't
> possible.

### Reliability

* **Repeat Commands** — from **No Repeat** to **20 times**, one repeat by default.
* **Favorite (Simulate)** — if the motor can't store a My position, the device simulates
  the stop by calculating the travel time. This relies entirely on your travel times.

> [!IMPORTANT]
> Only increase the repeats for a motor that misses commands — typically a battery motor
> that is slow to wake up. **While it's transmitting, the device isn't listening**: every
> unnecessary repeat is listening time lost, and your physical remotes depend on that
> listening.

## 5. Pairing the motor

Pairing writes ESPSomfy-RTS's address into the motor's memory. It's exactly what you
would do to add a physical remote.

> [!IMPORTANT]
> **The jog is your only indicator.** The motor sends back no confirmation: the only
> proof that a step worked is the brief back-and-forth movement, the "jog".

1. `PAIR` opens the assistant, which walks through the steps.
2. **Open the motor's memory**: on your original remote, hold `PROG` on the back
   until it jogs.
3. Click `PROG` in the assistant. A second jog means it's stored. **If it doesn't
   move, don't confirm**: go back to step 2.
4. `PAIRING SUCCESSFUL` closes the assistant. The `PAIR` button becomes `UNPAIR`.

<img width="33%" src="https://github.com/user-attachments/assets/4803ab5c-43ac-4d44-a59c-f5ff98635e23" />
<img width="33%" src="https://github.com/user-attachments/assets/ee10d254-ef84-43a4-b610-ca4d0299e0a8" />
<img width="33%" src="https://github.com/user-attachments/assets/db5520ed-7f4c-4954-8820-cf1f7e42f953" />

> [!WARNING]
> **Don't confirm a movement that didn't happen.** Pairing and unpairing are the
> **same command**: the motor flips from one state to the other. If you confirm by mistake, you no longer know
> which state it's in, and you'll need to unpair to start again cleanly. A device
> that jogs more than once has probably just been detached.

> [!NOTE]
> **Unpairing** follows exactly the same procedure.
>
> **Range is almost never the problem**: 150 to 200 metres with nothing in the way. A pairing that
> fails is most often down to the motor's programming mode closing too quickly.

### Expert mode

An **Expert Mode** switch at the top of the assistant removes the in-between steps and
puts everything on one page: only `PROG`, `PAIRING SUCCESSFUL` and `CANCEL` remain. Handy
when you're doing a lot of devices in a row and already know how the jog works.

It's the same setting as in a group's linking assistant — see
[Groups](Groups.md) — and it goes back to guided mode when the page reloads.

<img width="400" src="https://github.com/user-attachments/assets/27953a13-623b-4488-840b-3b44433dd445" />

## 6. Linking your physical remotes

Without this, **the position shown becomes wrong as soon as someone uses a real
remote**: the device has no way of knowing the motor has moved. Linking a remote means
asking it to listen for that address and update its calculation.

1. `LINK REMOTE` puts the interface into listening mode.
2. Press a button on the real remote — `UP` is the simplest.
3. The address is captured and the assistant closes by itself.

<img width="828" alt="Screenshot_20260520_113543" src="https://github.com/user-attachments/assets/f520a33b-047b-447d-9888-6ad002d8d7a4" />

A block then appears with the remote's address and rolling code.

> [!IMPORTANT]
> **A group remote must be linked to every device it controls.** A Telis
> channel that drives four shades is linked four times, once per device — otherwise only the ones
> you linked will keep the display up to date.

> [!NOTE]
> **7 remotes at most per device**, sensors included. To remove one, use the red
> cross in the list of linked remotes.

<img width="877" alt="Screenshot_20260520_113114" src="https://github.com/user-attachments/assets/86ea8168-6f24-478f-8095-2c9a0458b089" />

## 7. Linking a sensor

A sun or wind sensor — **Soliris**, **Eolis** — is linked like a remote, with the
same `LINK REMOTE`. It doesn't send button commands, but ESPSomfy-RTS intercepts its
frames and works out the action from them: without the link, your interface won't know the awning has
retracted for safety.

The tricky part is getting it to transmit while the device is listening:

* spin the anemometer fast — a hair dryer or leaf blower will do;
* cover the sun sensor to simulate a change in brightness;
* briefly press its `PROG` button, if it has one.

## 8. Setting the rolling code

<img width="800" src="https://github.com/user-attachments/assets/966a95fe-166c-404e-8d89-fe45996f2165" />

Every command sent increments a counter by 1, on the device **and** on the motor. That's
what stops a recorded frame from being replayed.

> [!CAUTION]
> **Only change this value if you know why.** If the code sent falls outside the small
> tolerance window the motor accepts, the motor ignores the command — and recovering
> often means fully resetting its memory.
>
> `SET ROLLING CODE` is mainly for **reading** the value, or restoring it after restoring a
> configuration onto a different module.

---

## Next step

* [Groups](Groups.md) — command several devices with a single frame.
* [Dashboard](Dashboard.md) — the cards, the buttons and the positioning windows.
* [Virtual Remote](Virtual-Remote.md) — transmit without a physical remote.
