The **Logs** sub-tab (`Radio → Logs`) shows the radio frames received, live. It's
the central diagnostic tool: until a remote shows up here, nothing will work.

<img width="100%" alt="Radio logs" src="https://github.com/user-attachments/assets/4b8438c7-721c-4ae5-82be-9e2f318a5009" />

The most recent frames appear **at the top** of the list. Every press on an original
remote creates one line.

---

# The columns

| Column | Contents |
| :--- | :--- |
| **Key** | The frame's obfuscation key. Depending on the protocol, it also holds the raw command value: the device extracts the command byte from it for the RTW and RTV protocols. |
| **Address** | The 24-bit address of the remote that sent it. |
| **Command** | The button pressed (see the list below). |
| **Code** | The rolling code carried by the frame. |
| **RSSI** | The received signal strength for this frame. |
| **Bits** | The number of bits in the frame, and the protocol. Usually 56 or 80. |
| **Time** | Local time, using the time zone set in [Options](Options.md). |

<details>
<summary>👉 The possible values in the "Command" column</summary>

`Up` · `Down` · `My` · `My+Up` · `My+Down` · `My+Up+Down` · `Up+Down` · `Prog` · `SunFlag` ·
`Sensor` · `Step Up` · `Step Down`

</details>

## The buttons

* **`COPY`**: copies the whole log to the clipboard.
* **`CLEAR`**: empties the list, so you can start a clean test session.

## Asking for help

The copied log is **the most useful attachment** you can provide: it holds
your remotes' addresses, the protocol, the RSSI and the timestamps. Start with
`CLEAR`, reproduce the problem, then `COPY`: you get a short, readable trace
instead of hundreds of lines.

Three places, depending on what you're after:

| Your situation | Where to go |
| :--- | :--- |
| **A question, a setting that won't behave, an installation to fine-tune** | There is a thread dedicated to ESPSomfy-RTS on the [HACF forum](https://forum.hacf.fr/t/espsomfy-rts-pour-la-gestion-de-vos-volets-rts-nouvelle-version/77935) (in French). Other users may be able to answer before I can. |
| **Unsure how something should work, an idea, a request** | The repository's [GitHub Discussions](https://github.com/xkain/ESPSomfy-RTS/discussions). |
| **A reproducible firmware fault** | A [GitHub issue](https://github.com/xkain/ESPSomfy-RTS/issues): the expected behaviour, what you saw, and the firmware version. |

> [!TIP]
> If in doubt, the **forum** first. A configuration problem usually gets an answer
> there faster, and if it turns out the firmware is at fault, the issue can be opened afterwards
> with the diagnosis already narrowed down.

> [!NOTE]
> As well as the log, remember to include: the **firmware version** (shown in
> [Firmware](Firmware.md)), your **board model**,
> and your radio settings — base frequency, bandwidth and so on.

---

# Identifying the protocol (Bits column)

This is the most useful thing on this page: knowing what to choose when you add a device.

| Value shown | Protocol to select |
|---|---|
| **56-S** | Standard **RTS** (56 bits) |
| **80-S** | Extended **RTS** (80 bits) |
| **56-W** | **RTW** (often ASA-brand motors) |
| **56-V** | **RTV** |

> [!TIP]
> Not sure what type your motors are? Don't guess: open this page, use the
> original remote, and read the suffix. `-S`, `-W` or `-V` tells you the exact
> configuration to apply in [Radio setup](Radio-Setup.md#protocols-and-defaults)
> or on the device itself.

---

# Interpreting the RSSI

The scale of values is given once and for all in
[Interpreting signal quality](Radio-Setup.md#interpreting-signal-quality-rssi).

What's specific to this page is reading it **frame by frame**: a low RSSI on a frame that
still shows up isn't necessarily a problem, since the frame was
decoded. What should worry you is a remote that **only shows up one time in
three**: the signal is then on the edge of dropping out. Move the device closer, or rethink
where it sits.

---

# Troubleshooting guide

## The radio is disabled, or the radio icon stays crossed out in red

The ESP32 can't talk to the CC1101 module. The problem is before the radio itself:

* **Wiring**: check the solder joints and the pin order. Careful: the order reverses
  (right/left) when you flip the CC1101 module over to connect it.
* **Configuration**: check that the GPIOs entered in
  [GPIO Assignment](Radio-Setup.md#gpio-assignment) match the actual wiring,
  SCLK/CSN/MOSI/MISO first.
* **GPIO conflict**: on an Ethernet board, make sure no SPI pin is shared with
  the network controller.

## The RSSI moves, but nothing appears in the logs

The radio picks up energy but can't decode anything. Three causes, in this order:

1. **RX and TX pins swapped.** This is the most common, and the quickest to rule out.
2. **Listening window in the wrong place.** Push the **RX Bandwidth** to the maximum
   (`812.50 kHz`) and save: if frames appear, it's a frequency offset, and
   the [tuning procedure](Radio-Setup.md#tuning-the-radio) is what you need.
3. **Ambient noise.** A microwave, Wi-Fi router or switch-mode power supply right next to it.

> [!NOTE]
> Don't look at the **deviation**, despite what you often read: it has
> **no effect on reception**; this has been measured. The explanation is in
> [Who does what](Radio-Setup.md#who-does-what).

## Some remotes show up, others don't

That's a calibration gap between your remotes, not a fault. The case is worked through step by step in
["6 out of 8 devices respond"](Radio-Setup.md#example-6-out-of-8-devices-respond).

## Reception works but transmission doesn't

Frames scroll past when you use the remote, but the interface doesn't move any
device:

* **RX/TX swapped**: the CC1101 can only transmit through **GDO0**. If GDO0 and GDO2 are swapped
  in your settings, reception will work and transmission will fail — exactly this symptom.
* **Transmit frequency**: transmission only uses the **Base Frequency**, with no bandwidth
  to make up for an offset. If you moved the frequency off-centre to pick up a remote on
  reception, you may have lost transmission to the other motors.
* **Motor memory**: Somfy motors have a limited number of slots. If it's full,
  the motor ignores new pairing attempts.

---

**Related pages:** [Radio setup](Radio-Setup.md) ·
[Frequency scan](Frequency-Scan.md) · [Devices](Devices.md)
