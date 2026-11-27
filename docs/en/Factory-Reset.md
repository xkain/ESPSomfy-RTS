## Troubleshooting & Factory Reset

If you lose access to the web interface (a network configuration mistake or a forgotten password), or if the device behaves erratically, you can reset it to restore its "out-of-the-box" state.


> [!TIP]
> Use these procedures as a last resort, if the "Restore" button in the web interface is no longer reachable.

> [!IMPORTANT]
> **No indicator LED on v2.x.x versions.** Whatever your board and whatever your case, no light
> will guide you: the procedure is done **blind**, by counting the seconds. GPIO 02 was freed up
> to widen compatibility across ESP32 variants; the indicator LED will come back in v3.0.0.
>
> **The firmware doesn't change:** after a reset, you stay on the version you had.

# Resetting by power cycles

There are two levels, so you don't needlessly lose your devices, rooms and everything else.

**The window is 5 seconds.** Each time it is plugged in, the device waits five seconds before
starting up for real. Unplugging within that time counts as one cycle. Letting the five seconds
pass doesn't just miss the cycle: **the counter goes back to zero**, and you have to start again
from the beginning.

<table>
  <tr>
    <td width="60%" valign="top">
      <strong>Power cycle procedures (v2.5.1+):</strong>
      <ol>
        <li>
          <strong>Network & security reset (3 cycles):</strong>
          Unplug and plug back in 3 times, each time within the five seconds.
          <br><em>Result: Wi-Fi erased and security turned off. Your devices and MQTT are kept. The device restarts in Access Point mode (SSID: ESPSomfyRTS).</em>
        </li>
        <br>
        <li>
          <strong>Full factory reset (6 cycles):</strong>
          Carry on at the same pace until the 6th time it is plugged in.
          <br><em>Result: back to the "out-of-the-box" state. All settings are lost. The device restarts in Access Point mode (SSID: ESPSomfyRTS).</em>
        </li>
      </ol>
    </td>
    <td width="40%" align="center" valign="middle">
    <img alt="Hard Reset Process" src="https://github.com/user-attachments/assets/2d46f592-6959-4767-869b-7ae56e155404" />
      <br />
      <em>Animation of the reset sequence. <b>The blue LED it shows doesn't exist on
      v2.x.x versions</b>: just follow the rhythm.</em>
    </td>
  </tr>
</table>

### The timing, cycle by cycle

| After plugging in | What to do |
| :--- | :--- |
| **The first 5 seconds** | Unplug to count one cycle. |
| **After 5 seconds** | Too late: the device starts up and the counter goes back to zero. |
| **On the 3rd or 6th cycle** | Don't unplug again. Let the device finish and restart on its own. |


> [!TIP]
> Once you have access again (http://192.168.4.1), remember to back up your configuration. That saves you having to re-pair your devices if you ever need a full reset again.


> [!IMPORTANT]
> **Availability:** this two-level system has existed since **v2.5.1**. Earlier versions
> don't offer this manual reset.
