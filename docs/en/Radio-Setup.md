The **CC1101** module is the 433 MHz transceiver that talks to your Somfy devices. This
page covers the **Radio** sub-tab, where you declare the wiring and then tune the radio.

| Page | What it's for |
|---|---|
| **Radio** *(this page)* | Turn the radio on, declare the pins, tune the frequency. |
| **[Radio logs](Radio-Logs.md)** | See the frames received, live: the diagnostic dashboard. |
| **[Frequency scan](Frequency-Scan.md)** | Measure a remote's actual frequency. A tool started from this page. |

<img width="100%" src="https://github.com/user-attachments/assets/3a7f8522-5f9f-4915-8cfe-2e26dfc9a4b9" />

> [!TIP]
> **Box owners:** if you bought one of my ready-made ESPSomfy-RTS boxes, the
> configuration is as simple as it gets. The radio is already on and the GPIO profile is
> pre-configured:
> * Wi-Fi box: `ESP32-D1 mini`
> * Ethernet & Wi-Fi box: `WT32-ETH01`
>
> **Your only step is to adjust the `protocol`, the `bit` setting and the frequency if needed.**

---

# Protocols and defaults

These settings define what is applied **by default** when you add any new
device, without affecting the ones already saved.

* **Radio**: off by default, so you can check your GPIO pins before putting it into
  service. The status shown under the switch tells you where you stand: *Radio is enabled*,
  *Radio is disabled*, or *Save to apply changes* if you've just
  flipped the switch without saving.
* **Protocol**: **RTS** (standard), **RTW** or **RTV**.
* **Bit**: **56-BIT** for RTS, **80-BIT** available depending on your devices.

> [!TIP]
> Not sure which protocol to choose? Don't guess: use your original remote
> and read the **Bits** column in the
> [Radio logs](Radio-Logs.md#identifying-the-protocol-bits-column). The suffix shown
> (`-S`, `-W`, `-V`) gives you the exact answer.

> [!CAUTION]
> **Ethernet users:** make sure no radio pin is shared with your
> Ethernet module (PHY). Nothing in the interface will warn you of such a conflict, and the result
> can range from Ethernet not coming up to "destroying" components.

---

# GPIO Assignment

The **GPIO Assignment** drop-down list declares how your CC1101 is wired to the ESP32. Two
cases: a ready-made **profile**, or **manual configuration**.

## Ready-made profiles

Choosing a profile fills in all six pins and **hides the detailed fields**: there's nothing
else to do. The list only offers profiles compatible with the chip detected.

### Default (auto-detection)

**This is the recommended option**, and the one active at the start. The device identifies your
chipset and applies the matching standard pins — you don't have to enter any numbers.

<details>
<summary>👉 The pins used for your chip (Standard, S2, S3, C3)</summary>

| CC1101 | Standard ESP32 | ESP32-S2 | ESP32-S3 | ESP32-C3 |
|---|---|---|---|---|
| SCLK | GPIO18 | GPIO36 | GPIO12 | GPIO15 |
| CSN | GPIO05 | GPIO34 | GPIO10 | GPIO14 |
| MOSI | GPIO23 | GPIO35 | GPIO11 | GPIO16 |
| MISO | GPIO19 | GPIO37 | GPIO13 | GPIO17 |
| GDO0 (TX) | GPIO13 | GPIO15 | GPIO15 | GPIO13 |
| GDO2 (RX) | GPIO12 | GPIO14 | GPIO14 | GPIO12 |

*Standard ESP32 = WROOM, WROVER, Devkit C/V1.*

</details>

> Even so, check that your model matches these GPIOs before wiring.

### Board profiles

If your board is in this list, choosing it saves you entering anything.

| Profile | SCLK | CSN | MOSI | MISO | TX (GDO0) | RX (GDO2) |
|---|---|---|---|---|---|---|
| ESP32-D1 mini | 18 | 5 | 23 | 19 | 21 | 22 |
| WT32-ETH01 | 14 | 12 | 15 | 4 | 2 | 35 |
| Olimex ESP32-PoE/EVB | 14 | 13 | 15 | 16 | 4 | 36 |
| LilyGO T-Internet POE | 14 | 12 | 15 | 16 | 4 | 35 |
| wESP POE | 18 | 5 | 13 | 32 | 4 | 39 |
| ESP-PoE-32 | 14 | 5 | 13 | 32 | 4 | 35 |
| ESP32s3 Mini | 7 | 6 | 9 | 8 | 3 | 4 |
| XIAO-ESP32-C3 | 8 | 6 | 10 | 9 | 3 | 4 |
| ESP32c3 SuperMini | 4 | 7 | 6 | 5 | 21 | 20 |

## Set manually (advanced user)

This option is for when your board isn't in the list, or you've wired to non-standard
pins. It replaces the drop-down lists with **free fields**: you can enter
any pin number, including one that doesn't exist or is already
in use. That's exactly what makes it risky, and why the interface has **two safeguards
in a row**.

<img width="800" alt="GPIO selector" src="https://github.com/user-attachments/assets/0fe42fdd-2a9b-497e-abc0-c8e4b866afd0" />

### 1. The safety switch

When you switch to manual mode, a switch appears under the six fields:

> **"I understand the risks of misconfiguring the GPIOs."**

It doesn't apply any setting: it simply **unlocks saving**. While it's
Off, the `SAVE` button refuses to write and shows *"Enabling the safety switch is
required to save the manual GPIO configuration."* Its only job is to make sure
nobody enters pins at random without reading the warning.

This switch **only** applies to manual mode: with a profile, it doesn't appear and
saving happens directly.

### 2. The confirmation question

Once the switch is on, `SAVE` opens one last question:

> **Are you sure about your manual settings?**
> *Incorrect GPIO pins can cause your ESP32 to crash or bootloop.*

Answering **No** cancels without writing anything. Answering **Yes** saves and applies the
configuration.

> [!CAUTION]
> The boot loop isn't a figure of speech: a pin reserved for the ESP32's start-up
> or shared with the Ethernet chip can make the device unreachable, and the only
> way out is then reflashing over USB. Read the six numbers through again before confirming.

> [!NOTE]
> * **SPI interface:** **SCLK, CSN, MOSI and MISO** must match the physical wiring
>   exactly. If the *"Radio is disabled"* message or the radio icon crossed out in red
>   persists, check these four pins first.
> * **GDO0 / GDO2:** transmission (TX) **must** go through GDO0. Reception (RX) can
>   use GDO0 or GDO2.
> * **Multiplexed mode:** save a pin by connecting only GDO0 and
>   setting the same GPIO number for RX and TX. The device switches the function by itself.
>   Especially useful on Ethernet boards, where free pins are scarce — see
>   [Components → Pin configuration](Components.md#pin-configuration).
> * **Quick diagnosis:** if the RSSI moves but no frames appear in the
>   logs, your RX and TX pins are probably swapped.

---

# Tuning the radio

This is the step that decides whether your remotes are heard and your motors obey. It's
worth understanding before trying things at random.

<p align="center">
  <img alt="Full Radio interface" src="https://github.com/user-attachments/assets/5c6a5a81-04b0-4d18-9f03-c9eb4a826b26" width="800" />
</p>

The sliders are for broad adjustments, the **<** **>** buttons for fine precision, and the
`1` `10` `100` selectors set the step size.

## Who does what

| Setting | Range | Default | What it really controls |
| :--- | :--- | :--- | :--- |
| **Base Frequency** | 433.000 → 434.399 MHz | **433.420 MHz** | The centre frequency, used **for both receiving and transmitting**. The only setting that affects transmission. |
| **RX Bandwidth** | 58.03 → 812.50 kHz | **99.97 kHz** | The width of the listening window, **for receiving only**. |
| **Frequency Deviation** | 1.58 → 380.85 kHz | **47.60 kHz** | **No effect on reception** — see the box below. |
| **TX Power** | −30 → 12 dBm | **10 dBm** | The transmit power. At 10 dBm the range is already well beyond a Somfy remote's. |

> [!IMPORTANT]
> **Deviation plays no part in reception.** It's counter-intuitive, and the
> interface's tooltip still suggests otherwise, but it has been measured: with the same
> bandwidth, the same remote held down gave **68 frames decoded at 47.60 kHz
> deviation, and 68 frames decoded at 380.85 kHz** — the chip's maximum — with an identical
> RSSI.
>
> The reason lies in the modulation: the radio works in **ASK/OOK**, meaning the
> carrier is simply switched on or off. The CC1101 is only an envelope detector, and
> it's the software that measures the pulse lengths. Deviation would only matter in
> 2-FSK, where two separate tones have to fit in the filter.
>
> **In practice: leave the deviation at its default value.** Changing it won't fix
> reception, and won't break it either.
>
> Its effect on **transmission**, however, hasn't been established yet. That's why
> the setting stays in the interface: until the question is settled, removing it
> would be premature.

## The rule that decides whether a remote is heard

A remote is only decoded if its frequency falls within the listening window:

> **| remote frequency − Base Frequency | ≤ RX Bandwidth ÷ 2**

That's all. Two practical consequences:

* **At factory values** (433.420 MHz and 99.97 kHz), the window runs from **433.370 to 433.470 MHz**,
  i.e. ± 50 kHz. A remote that has drifted to 433.19 MHz is 230 kHz away: it's silent, whatever
  else you do.
* **At maximum bandwidth** (812.50 kHz), the window covers **433.014 to 433.826 MHz**.
  Almost every Somfy remote on the market falls inside it, at the cost of a little more noise.

> [!TIP]
> Bandwidth is your **free diagnostic tool**: widening it to the maximum risks
> nothing and only costs a little sensitivity. If a silent remote starts appearing in
> the logs as soon as you widen it, the problem is **frequency calibration**, not
> hardware or wiring. You've just ruled out half the possibilities in one
> step.

> [!WARNING]
> **Transmission doesn't know about bandwidth.** There's no bandwidth setting for
> transmission: the device transmits on the **Base Frequency**, full stop. Widening the band
> fixes reception of a remote, but will never make a motor obey whose receiver
> is tuned elsewhere. For transmission, only the centre frequency counts.

## Tuning procedure

1. **Start from the factory values.** Base Frequency `433.420 MHz`, Bandwidth `99.97 kHz`.
   Save. If everything works, stop there: there's nothing to optimise.
2. **Test at 1 metre.** Open the [Radio logs](Radio-Logs.md), take a remote and
   press. A line should appear.
3. **Note the RSSI.** The closer to 0, the better — see
   [Interpreting the RSSI](#interpreting-signal-quality-rssi). A good module such as the E07-M1101D
   can get down to −32 dBm at this distance; a standard module will be nearer −60 dBm.
4. **Go through all your remotes**, one by one, before drawing conclusions. That's where
   the differences show up.
5. **If one stays silent**, widen the band to the maximum to confirm it really is a
   frequency offset, then measure its actual frequency with the
   [Frequency scan](Frequency-Scan.md).

> [!TIP]
> **Placement:** never put the device on a microwave or right next to a
> Wi-Fi router (leave at least two metres) or a switch-mode power supply. The noise they
> produce drowns out your devices' signal, and no setting will make up for a bad
> spot.

## Example: 6 out of 8 devices respond

Here is the typical case, and how to untangle it.

**The situation.** Eight devices saved. Six work perfectly. The last two
don't move, and above all: **when you press their original remote, nothing appears
in the logs**.

**What this symptom already tells you.** Six devices responding proves the wiring, the
pins and the module are fine. So the problem is neither hardware nor software: it's about
**frequency**, and it only affects those two. Somfy remotes age, and their
crystal drifts — two remotes from the same batch can end up 200 kHz apart
after a few years.

**Step 1 — Confirm the theory.** Push the **RX Bandwidth** to the maximum (`812.50 kHz`),
save, then press the two stubborn remotes again.

* *Frames appear* → it really is a frequency offset. Carry on.
* *Still nothing appears* → the problem is elsewhere. These remotes may be out of
  action (battery), or you're on the wrong protocol. Go to
  [troubleshooting in the logs](Radio-Logs.md#troubleshooting-guide).

**Step 2 — Measure.** For each of the eight remotes, note its frequency with the
[Frequency scan](Frequency-Scan.md). Suppose the result is:

| Remote | Measured frequency |
|---|---|
| The six that work | 433.40 to 433.44 MHz |
| The two silent ones | 433.19 and 433.21 MHz |

**Step 3 — Re-centre and widen.** The total spread runs from 433.19 to 433.44 MHz, i.e. **250 kHz**.
So you need a window at least 250 kHz wide, centred in the middle:

* **Base Frequency** = (433.19 + 433.44) ÷ 2 = **433.315 MHz**
* **RX Bandwidth** ≥ 250 kHz → leave a margin, for example **325 kHz**

With these values, the window runs from 433.153 to 433.478 MHz: **all eight remotes are in the
window**. Save, and check in the logs that all eight appear.

**Step 4 — What about transmission?** This is the point many people forget. You've just fixed
**reception**, but you've also moved the **transmit** frequency from 433.420 to
433.315 MHz — 105 kHz lower. The six motors that were working may now stop
obeying, since transmission has no bandwidth to make up the difference.

So test a command on each of the eight devices from the interface. If all eight
obey, you've found your setting: keep it. If not, go to the next step.

**Step 5 — Find the frequency that suits them all.** If the six original motors no longer
obey, don't undo everything: you haven't tried the right setting yet, you've only tried
one. The method now is to **change only one setting**.

1. **Leave the bandwidth at the maximum** (`812.50 kHz`). That way reception doesn't constrain
   you at all: your eight remotes will stay heard whatever centre frequency
   you try. You've just reduced the problem to **a single unknown**.
2. **Vary only the Base Frequency**, in steps of 20 to 30 kHz between the two groups —
   in our example, from 433.20 up to 433.44 MHz.
3. **At each value, save and test a command on all eight devices.** Note how many
   respond. You get a curve: 6 here, 7 there, maybe 8 somewhere.
4. **Keep the value that satisfies the most.** There's a good chance one step suits
   all eight: Somfy receivers are generally more tolerant than the CC1101's receive
   window.

> [!IMPORTANT]
> **"433.420 MHz" isn't the value you should go back to.** It's the Somfy
> standard's frequency, but it isn't necessarily the number *your* device should show. CC1101
> modules are tuned to within a few hundred ppm, which means **more than
> 100 kHz of error** at 433 MHz: a module may well need to be set to 433.15 MHz to
> actually transmit on 433.42.
>
> In other words, the right frequency is something **to calibrate for your device**, not a
> reference value to restore. If an unusual setting makes all eight devices work,
> that's the correct one — and "resetting" it to 433.420 would break your installation.

**If no value satisfies all eight.** This is the hard case, and there are two ways out:

* **Live with the widened band and the best compromise.** Nothing forces you back to the
  factory values: a setting that works for seven devices out of eight beats the one
  that worked for six.
* **Re-pair the stubborn devices** at the frequency you've settled on, from the
  [virtual remote](Virtual-Remote.md) or through
  [pairing](Devices.md#5-pairing-the-motor). The motor then learns to listen to the device
  directly, and the offset from its original remote no longer matters.

> [!TIP]
> **Write your values down before you start, and change one setting at a time.** Base Frequency,
> bandwidth, deviation: three numbers on a piece of paper, and you can always go back to the
> state that worked for six devices out of eight. A backup from
> [Firmware](Firmware.md) does the same job and
> captures the whole configuration.

> [!NOTE]
> **Why does it take trial and error?** Because the firmware has only **one** frequency setting,
> shared by transmission and reception: it's impossible to optimise them separately. And because
> the tolerance of Somfy receivers can't be measured from the interface. The only
> instrument you have is trying.

---

# RSSI diagnosis

The **RSSI** is the signal strength indicator, shown at the top of the Radio sub-tab:

* **The score**: the closer to 0, the stronger the signal.
* **The counter**: the small number next to it shows how many frames have been received. Handy for
  testing how responsive a remote is without leaving the page.

## Interpreting signal quality (RSSI)

* **🟢 −30 to −60 dBm — Excellent**: very strong signal, perfect communication.
* **🟡 −70 to −85 dBm — Weak**: borderline signal, risk of lost commands.
* **🔴 −90 to −110 dBm — Noise**: signal too weak or too noisy.

> [!NOTE]
> An RSSI that moves without any frames appearing in the logs does **not** mean
> reception works. It means the radio is picking up energy in its window without
> managing to decode anything: RX/TX pins swapped, wrong frequency, or
> simply ambient noise.

---

**Related pages:** [Radio logs](Radio-Logs.md) ·
[Frequency scan](Frequency-Scan.md) ·
[Components → Pin configuration](Components.md#pin-configuration)
