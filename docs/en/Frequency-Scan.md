The **frequency scan** measures a remote's actual frequency. It's the tool to use when a
remote doesn't show up in the [Journaux Radio](Radio-Logs.md) and you suspect it is off
frequency — see
[the rule that decides whether a remote is heard](Radio-Setup.md#the-rule-that-decides-whether-a-remote-is-heard).

You open it from the **Radio** sub-tab, with the **`SCAN`** button. A **Radio Frequency Scan**
window opens: *"Scan the surrounding frequencies to identify and configure your radio
devices."*

<img width="100%" alt="Radio Scanner interface" src="https://github.com/user-attachments/assets/476cee7d-cdc9-46a2-ab4a-2441591435c8" />

---

# Procedure

1. Click **`START`**. The device sweeps the **433.00 → 434.00 MHz** band
   in 100 kHz steps, a full pass taking **a little over 10 seconds**, and then starts again.
2. When the scan crosses the remote's frequency, a **peak** appears on the graph
   and the frequency is shown (for example `433.19 MHz`), along with the RSSI.
3. Click **`STOP`**.
4. Click **`SET FREQUENCY`** to put the measured value into the
   **Base Frequency** field of the Radio sub-tab.
5. **Essential:** click **`SAVE`** at the bottom of the Radio sub-tab. Without this, nothing
   is stored.

> [!IMPORTANT]
> **Don't expect it to work first time, and don't try to hold the button down until the scan
> finishes: that's physically impossible.** The scan only crosses your remote's frequency for
> **about 1.6 seconds in every 10-second pass** — for the other 85% of the time, your
> transmission is lost. And a Somfy or generic remote **stops transmitting after 10 to 15
> seconds** of holding the button, for safety.
>
> The right way: press, hold for 10 seconds, release, and start again straight away. No peak
> doesn't mean your remote is out of range, only that the scan hasn't crossed it yet.

> [!TIP]
> **Don't hold the remote right against the antenna.** At point-blank range the receiver
> saturates and the peak spreads across the whole band, making the measurement useless. One to
> two metres is the right distance.

---

# Reading the result honestly

The value the firmware keeps is the **top of the peak**. But that top is flat, and this is the
tool's main limitation, measured on the bench:

* Over **five consecutive passes**, with a perfectly still remote, the value kept
  spreads over **40 kHz** (from 433.190 to 433.230 MHz). The top of the peak is flat over nearly
  70 kHz: there is no clear maximum to find.
* The **edges**, on the other hand, are sharp: the signal drops by 12 dB in a single step.

**The takeaway:** don't treat the number shown as a measurement to the nearest
kilohertz. Treat it as an **estimate to ± 20 kHz**, which is plenty for what it's used for:
deciding which listening window to sit in.

> [!TIP]
> **For a more reliable measurement, look at the graph rather than the number.** Find the first
> and last steps where the signal rises, and take the **middle** of that range. That
> estimate is **four times more repeatable** than the peak: it only varies by 10 kHz
> from one pass to the next, which is simply its own step size.

---

# Understanding Signal (RSSI)

Below the graph, the scan window shows a reminder of the RSSI scale and what each level means.
It's the same scale as everywhere else in the interface, covered in detail in
[Interpreting signal quality](Radio-Setup.md#interpreting-signal-quality-rssi).

Here, the RSSI isn't used to judge the quality of a link but to **spot the peak**: what
matters is less its absolute value than how far it stands above the neighbouring steps. A peak
only 2 or 3 dB above the background noise can't be used — move closer and try again.

---

# What next?

Measuring a frequency doesn't fix anything by itself. What matters is the window you are
going to sit in, and it has to suit **all** your remotes at once.

So measure each one before deciding, then go to
[Tuning the radio](Radio-Setup.md#tuning-the-radio), and in particular the example
["6 out of 8 devices respond"](Radio-Setup.md#example-6-out-of-8-devices-respond),
which works through the full calculation.

> [!WARNING]
> **Beware the "measure, set, save" reflex.** If you click
> `SET FREQUENCY` after measuring a single remote, you re-centre the radio on that one
> — and you risk losing all the others, along with transmission to the motors that were
> working. Measure first, decide afterwards.

---

**Related pages:** [Radio setup](Radio-Setup.md) · [Radio logs](Radio-Logs.md)
