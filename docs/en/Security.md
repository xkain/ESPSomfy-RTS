This page covers the **Security** sub-tab of the **System** tab. It protects access to
the interface so nobody can change your devices or configuration without your say-so.

---
<img width="100%" src="https://github.com/user-attachments/assets/ffc2087c-297f-4e47-be7c-cb765639d570" />

## 1. Security type

One list, three choices. While **None** is selected, the rest of the page stays
hidden.

| Choice | What is asked for |
| --- | --- |
| **None** | Nothing. Anyone on your local network can use the interface. This is the factory setting. |
| **Pin Code** | Four digits, entered in four separate boxes. |
| **Password** | A username and a password, 32 characters at most each. The password must be entered twice; the eye icon lets you check what you're typing. |

> [!NOTE]
> The PIN code is exactly **4 digits**, no more, no less — the interface only accepts one
> digit per box. It isn't a strong secret; it's there to stop accidental changes, not to
> withstand an attack.

## 2. Secure configuration only

This switch only appears once a security type is chosen. It decides **how much** is
protected, and it's the most important setting on this page.

| State | What stays open | What needs authentication |
| --- | --- | --- |
| **On** | Viewing the list of devices, rooms and groups, and sending them commands (up, down, My, position, tilt). | Every setting: system, network, MQTT, radio, GPIO, and creating, changing or deleting a device, room or group. |
| **Off** | Nothing, apart from the login page itself. | Everything, including just reading your devices' state. |

> [!IMPORTANT]
> **If you use Home Assistant, enter the PIN code or password in the
> integration.** It asks for them during setup, and asks you to sign in again on its
> own if the key stops being valid. Without them, it gets a `401` error on every one
> of its requests and its real-time connection is refused over and over: the device keeps
> working, but it disappears from Home Assistant — see [Home Assistant](Home-Assistant.md).
>
> This authentication needs integration **v2.6.0 or newer**. Earlier versions
> couldn't present a key and were cut off completely as soon as security was
> turned on. Leaving **Secure configuration only** on avoids the issue: the integration
> only needs the access this mode leaves open.


## 3. Saving

The `Save` button at the bottom of the page applies the protection. A confirmation window
then appears.

> [!IMPORTANT]
> Write down your code or password before leaving the page. If you lose it, the way out
> is the **network and security reset**: three power cycles, which turn off
> security and erase the Wi-Fi, but **keep your devices, groups, rooms,
> radio and MQTT**. The device then restarts on its own `ESPSomfyRTS` network and you need to
> reconnect it. Only on the **sixth** cycle is everything erased — see [Factory Reset](Factory-Reset.md).

## 4. What happens when you log in

Once protection is on, the interface asks for the code or password when it opens.

* **As long as you stay in the same tab, you aren't asked again.** The session survives
  page reloads. It does disappear when you **close the tab**;
  reopening the interface then asks for authentication again.
* **After three failed attempts, you have to wait.** The fourth error locks out
  the address that tried for 15 seconds, and each new failure doubles that delay —
  30 seconds, 1 minute, 2 minutes… up to a ceiling of 15 minutes. The failure count
  clears itself after 15 minutes without any attempt; a lockout that has already started
  runs to the end.
* **The screen tells you where you are.** Each failure shows the attempt number under the
  form — `Attempt 2/3`. When locked out, the **Login** button is disabled and the message
  becomes *Too many attempts. Retry in 15s*, counting down every second, then the button is
  enabled again by itself when the countdown ends.

> [!NOTE]
> This on-screen feedback arrived in **v2.6.1**. In v2.6.0, a failure didn't say how many
> attempts were left, and you only found the lockout by running into it.

> [!NOTE]
> The lockout only applies to **the address that gets it wrong**. Another device in the house,
> or Home Assistant, keeps working normally in the meantime.

## What security doesn't cover

* **Traffic isn't encrypted.** The interface is served over plain HTTP and the MQTT link is
  unencrypted on the local network. A PIN code or password controls who can act; it doesn't make
  the traffic private.
* **The authentication key is tied to the client's IP address.** A device whose address
  changes (a renewed DHCP lease) has to log in again. That's one more reason to set up a
  DHCP reservation — see [DHCP and static IP](DHCP-and-Static-IP.md).
* **Wi-Fi and MQTT passwords are never written into a backup.** After a
  restore, you have to enter them again — see [Backup file anatomy](Backup-File-Anatomy.md).

---

## Next step

* [Firmware](Firmware.md) — device status, updates, backup and restore.
* [Options](Options.md) — hostname, time, language and appearance.
