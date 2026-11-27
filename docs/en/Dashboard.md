This page covers the **Dashboard** screen, the one shown when the interface opens:
the frame around it, the room filter, and the cards that control your groups and
devices. The settings have their own pages — see [Options](Options.md), [Security](Security.md) and
[Firmware](Firmware.md).

---

<img width="100%" src="https://github.com/user-attachments/assets/fd4ff78c-536e-4eff-a0b7-72536cec61c9" />


## 1. Two layouts, depending on screen width

The interface switches at **780 pixels** wide. It isn't a setting: the window's width
decides, and simply resizing is enough to switch from one layout to the other.

| | Wide screen | Narrow screen |
| --- | --- | --- |
| Top bar | shown | **hidden** |
| Sidebar | shown | **hidden** |
| In-page header | hidden | **shown**, with the gear |
| Navigation | the sidebar | the gear |

> [!NOTE]
> On a narrow screen, the *Uptime* readout disappears with the top bar. That's
> why the [Firmware](Firmware.md) tab shows it again at that width, and only at that width.

## 2. The top bar

Three things, to the right of the logo.

* **Connection** — three badges, `WIFI`, `LAN` and `POE`. The one matching the mode actually
  in use is highlighted; see [Network connection](Network-Connection.md).
* **Uptime — Device** — how long since the device last restarted.
* **Uptime — Network** — how long its connection has held. The two
  values differ as soon as the network has dropped and come back without the device restarting: a
  gap between the two is therefore a hint of an unstable link.

## 3. The sidebar

**Dashboard** at the top, then four expandable groups — **System**, **Network**, **Somfy** and
**Radio** — that lead to the configuration pages.

At the bottom, two buttons:

* an **update** button, which only appears when a newer version has been found;
  it opens the GitHub update window directly — see [Updating](Updating.md);
* `Reboot`, which restarts the device.

> [!NOTE]
> If the radio is disabled, the word **disabled** appears next to the **Radio** group. No
> command will go out while it stays that way.

## 4. On a narrow screen

The top bar and sidebar disappear; a header takes their place in the page,
with a **gear** button on the right. It opens a row of four icons — System, Network,
Somfy, Radio — then a second row for the sub-tab. The dashboard stays the default
view: closing the gear brings you back to it.

<img width="20%" src="https://github.com/user-attachments/assets/d4af5010-457a-4db2-91ae-de75f3a920c8" />
<img width="20%" src="https://github.com/user-attachments/assets/58bab382-b8a0-467f-86b2-a52f604f3d05" />



The update warning, for its part, is shown as a banner above the header, where the wide
screen puts it in the sidebar.

## 5. The welcome page for getting started

While no room, device or group exists, the dashboard makes way for
a welcome page: a welcome message, then four cards that each lead to the
matching step — **Network**, **Radio**, **System** and **Add a device**. A fifth
entry offers the pre-configuration assistant for boxes bought online.

<img width="100%" src="https://github.com/user-attachments/assets/8372668d-c0ca-4314-b755-0f4df4df2f90" />

> [!NOTE]
> This page **disappears for good** as soon as a room, device or group is created.
> It isn't a tab: you can't go back to it, and that's intentional.

## 6. The room filter

A strip of badges at the top of the dashboard, the first one called **Home**.

* **Home** shows everything.
* Any other badge shows only the devices **and groups** attached to that room.
* The two arrows on either side scroll the strip when it's wider than the screen.

If the chosen room contains no devices, the dashboard shows *No devices are currently
assigned to this room*. You assign a device to a room in
[Devices](Devices.md), and the rooms themselves are managed in [Rooms](Rooms.md).

## 7. Group cards

These sit above the device cards.

| Item | What it shows |
| --- | --- |
| Room and name | the group's room, then its name |
| **Members** | the number of devices attached to the group |
| Buttons | **Up**, **My**, **Down** — sent to the whole group in a single frame |
| Sun | only present if the group is set up with a sun sensor |

A group card has no wind indicator, no position and no positioning window: a
group talks to several motors at once and reports no state of its own. See
[Groups](Groups.md).

## 8. Device cards

This is the centrepiece of the screen. From top to bottom:

* the **handle** on the left edge, with an arrow — it opens the positioning window
  ([The target position](#the-target-position)). The arrow flips when the window is
  open;
* the device's **name**;
* the **room** the device was added to (optional);
* the **icon**, which depends on the type and **fills up to the current position**: it's
  the most immediate indicator on the screen;
* the **room**, then `Pos: 42%` and, if the device tilts, `Tilt: 39%`.

<img width="500" height="186" src="https://github.com/user-attachments/assets/1bee6293-ad95-42aa-842e-720e34c198dd" />

### The command buttons

They differ depending on the device type.

| Type | Buttons shown |
| --- | --- |
| Most types | **Up**, **My**, **Down** |
| *Garage (1-button)*, *Gate (1-button …)*, *Dry Contact (1-button)* | a single wide **toggle** button |
| *Dry Contact (2-button)* | **Up** and **Down**, without **My** |

> [!TIP]
> **A two-second long press has its own function.** On **Up** or **Down**, and
> only if the device tilts, it sends the **tilt** command instead of the
> movement. On **My**, it opens the settings window for [The My position](#the-my-position) — provided
> the device is stopped.

### The status bar, at the bottom of the card

On the left, the indicators and markers:

| Item | When it appears |
| --- | --- |
| **Wind** | only when the device has received a wind alert. It **flashes** for as long as the alert lasts. |
| **Sun** | only when the device is in sunny conditions. |
| **My** | always: the stored position, or `---` if none is stored. |
| **My Tilt** | if the device tilts. |

On the right, the buttons:

| Button | What it does |
| --- | --- |
| **Light bulb** | present if the device controls a light; toggles it. |
| **Sun** | present if the device has a sun sensor; turns on or off whether the motor takes it into account. |
| `Favorite` | opens the settings window for [The My position](#the-my-position). |

> [!NOTE]
> The **Wind** and **Sun** indicators on the left are *states received*: you can't click them. The
> **Sun** button on the right is a *command*. Two suns, two roles.

> [!TIP]
> **These indicators light up even though your device has no sensor?** They almost
> always come from the virtual remote. Its two **Sun** and **Wind** boxes, confirmed with the
> **Send** button, set those states on the selected device — whether it has a sensor or
> not, since simulating what a sensor would send is exactly what that page is for.
> To turn them off: go back to [Virtual Remote](Virtual-Remote.md), untick both
> boxes and send again.

## 9. The two sliding windows

Both slide out from the edge of the card and close on your next click elsewhere on the page.

### The target position

<img width="500" src="https://github.com/user-attachments/assets/38878725-800d-4feb-9275-4b3e95ca6bfd" />

Opened with the **handle** on the left edge. One or two sliders depending on the device: *Target
position*, and *Target tilt position* if it tilts. The command goes out **when you release the
slider**, not while you're moving it.

The percentage is followed by *Close* or *Open* depending on the direction set for the device: an
awning is open when it's extended, so its display is reversed compared with a
shutter.

> [!NOTE]
> This window **doesn't open** for single-button types or dry contacts. Those
> devices have no in-between position: there would be nothing to set.

### The My position

<img width="500" src="https://github.com/user-attachments/assets/f58119f8-3f76-449a-ab4b-dfe6b4ad0636" />

Opened with the `Favorite` button, or a long press on **My**. The same sliders, but they don't
command anything: they **save** the position the motor will go to on a
short press on **My**.

The confirm button changes depending on what you're setting: **Set "My" Position** usually,
and **Clear "My" Position**, in orange, as soon as the sliders are back at the value already
stored. So the same button both sets and removes it.

> [!TIP]
> **Your device already has a My position, which works from your physical remote,
> but the interface's My button does nothing?** That's normal. That position is stored
> **in the motor**, and the RTS protocol only transmits one way: there is no way for
> ESPSomfy-RTS to read it. If you don't tell it your My is at 45%, it
> can't guess — and while no value is stored, it **sends no frame**:
> the button has no effect and the motor doesn't move.
>
> Save it here once, with the sliders, and the interface's **My** button will behave
> like the one on your remote.

---

## Next step

* [Devices](Devices.md) — create a device, pair it and attach it to a room.
* [Groups](Groups.md) — bring several devices together under a single command.
* [Rooms](Rooms.md) — organise the dashboard.
* [Virtual Remote](Virtual-Remote.md) — simulate a remote, and the two boxes that
  light up the sun and wind indicators.
