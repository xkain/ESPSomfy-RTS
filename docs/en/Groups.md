A group commands several devices **in a single radio transmission**, on an address of its
own. It isn't a loop that sends the command to each one in turn: the motors
receive the same frame at the same moment and start together.

---

<img width="100%" src="https://github.com/user-attachments/assets/b00222df-bf72-4b75-9520-d9d95111085d" />

## 1. What a group does, and what it doesn't

A group has its own **remote address**, exactly like a physical
remote. Each member motor stores this address in its memory; after that, a single frame
reaches them all.

| | |
| --- | --- |
| **Number of groups** | 14 at most |
| **Devices per group** | 30, i.e. all of your devices |
| **Commands available** | **Up**, **My**, **Down** |
| **Position as a percentage** | no |

> [!NOTE]
> **Why no percentage?** Reaching an in-between position means timing
> the motor's travel, then stopping it. The motors in a group don't have the same travel or the
> same speed: a shared stop would leave them at different heights. So the group sticks
> to the three commands that don't depend on any timing.

After transmitting, the device updates the position of **each member** in its internal tracking,
without sending anything more. That's what makes the cards of the devices
involved move on the [Dashboard](Dashboard.md) even though only one frame went out.

> [!TIP]
> Saving radio traffic isn't a minor detail. Ten devices commanded individually means ten
> frames and their repeats on the same frequency, with the risk that some collide.
> A group is one frame.

## 2. Creating a group

1. **Access**: `Somfy` > `Groups`.
2. **Add**: `ADD GROUP` opens a blank panel. Give the group a name, then `CREATE`.

Once the group is created, `CREATE` becomes `SAVE` for your later changes. The
`CLOSE` button next to it goes back to the list **without saving anything**.

### What only appears after creation

> [!IMPORTANT]
> **Until the group is created, two things aren't shown at all** — not greyed out, not
> inactive: **missing from the page**.
>
> * the preview area and its three buttons **Up**, **My** and **Down**;
> * the `LINK A DEVICE` button.
> <img width="880" src="https://github.com/user-attachments/assets/213a06d2-3e78-41ca-bc72-e2d46ae6783a" />
>
> They appear on the first save. Before that, the group has no address and no members:
> there is nothing to command and nothing to link to.

Since a group with no members is useless, `LINK A DEVICE` starts to **pulse** gently
as soon as it appears: the interface is pointing you to the only step left. The glow goes out
once the first device is linked.

## 3. The settings

### Identification

* **Name** — up to 20 characters, any printable character.
* **Room** — puts the group in a room, **Home** by default. This is what feeds the
  [Dashboard](Dashboard.md) filter — see [Rooms](Rooms.md).

### Radio

* **Protocol** — **RTS** (standard), **RTW** (the ASA Motors brand in Europe) or **RTV** (a variant
  fixed at 433.92 MHz).
* **Bits** — **56-bit** or **80-bit**. Motors with a tilt wheel often use
  80-bit.
* **Remote ID** — the group's own 24-bit address, the one the motors will remember.

> [!NOTE]
> **Protocol** and **Bits** default to what you chose in
> [Radio setup](Radio-Setup.md). If you set RTW and 80-bit there, a new group starts as RTW
> 80-bit.

> [!WARNING]
> **The group's address must never change after the first link.** It's the address every
> motor's memory has stored: changing it means losing the link with all the members
> at once. It must also be **unique** — among your groups, your devices and the
> physical remotes within range.

### Behaviour

* **Command (Invert)** — if the group goes down when you ask it to go up.
* **Repeat Commands** — from **No Repeat** to **7 times**, one repeat by default.

> [!TIP]
> **Inverting the commands is a band-aid.** If a motor goes down when told to go up,
> it's the motor's own direction that needs fixing, on the motor. The box exists for cases where
> that isn't possible.

> [!IMPORTANT]
> **Only increase the repeats if you need to** — typically a battery motor that is slow
> to wake up. While it's transmitting, the device isn't listening: every unnecessary repeat is
> listening time lost.

### The preview area

<img width="445" src="https://github.com/user-attachments/assets/c0b0bec2-83a6-4dc4-99a0-622bed944ce2" />

Three buttons to try the group without leaving the configuration page, which saves
going back and forth to the dashboard.

They stay **greyed out** until a device is linked: with no members, the frame wouldn't
move anything.

## 4. Linking a device

The group's address has to go into each motor's memory. It's a radio operation, to
repeat for each member.

> [!IMPORTANT]
> **The jog is your only indicator.** The motor sends back no confirmation: the only
> proof that a step worked is the brief back-and-forth movement, the "jog".

### Step by step

1. **Start the assistant** with `LINK A DEVICE`.

   <img width="729" src="https://github.com/user-attachments/assets/b52a65d8-9ef4-4793-8ef5-e7e0ed2c3085" />

2. **Choose the device**, then `NEXT`.

   <img width="729" src="https://github.com/user-attachments/assets/f32bc497-cef9-48fa-a9b6-2c9495a3961f" />

3. **Open the motor's memory**: on this device's own remote, hold
   the `PROG` button on the back until the motor jogs.

   <img width="729" src="https://github.com/user-attachments/assets/c0811c73-da71-4067-8a8e-9fbe062e3bcc" />

4. **Confirm** that the movement happened.

   <img width="729" src="https://github.com/user-attachments/assets/76237059-b23c-46ad-aaf8-4deb701cb0e0" />

5. **Confirm** with `PAIR TO GROUP`. The motor jogs a second time: it has just
   stored the address.

   <img width="768" src="https://github.com/user-attachments/assets/39bfa784-d590-401d-bd87-fafd137fc612" />

6. **Confirm** whether it did the second jog, and the assistant closes.

> [!NOTE]
> **If the motor doesn't move, don't confirm.** Answer `NO` to the confirmation question:
> the assistant stays where it is, and you can open the motor's memory again and retry. Its
> programming mode had simply closed too quickly. Range is almost never the cause —
> 150 to 200 metres with nothing in the way.


The device appears in the member list, and the preview buttons become active.

<img width="800" src="https://github.com/user-attachments/assets/14ffd268-539d-4a5a-b0db-802ec035adb8" />

### Expert mode

An **Expert Mode** switch at the top of the assistant removes the in-between steps and
puts everything on one page: the device picker, `OPEN MEMORY`,
`PAIR TO GROUP` and `CANCEL`. The step titles, the explanation boxes and the
`NEXT` and `GO BACK` buttons disappear. Handy when you're doing several members in a row and already know
how the jog works.

The removal assistant has the same switch; it leaves only `OPEN MEMORY` and
`UNPAIR FROM GROUP`.

<img width="600" src="https://github.com/user-attachments/assets/0490a61a-e46f-49bb-8a6d-3685cbbdb9dc" />

> [!NOTE]
> It's the **same setting** as in a device's pairing assistant: turning it on in one
> turns it on in the other. It lasts for the current browsing session, and the interface goes back to
> guided mode when the page reloads.

> [!CAUTION]
> **Expert mode only shortens the explanations, not the procedure.** The order stays the same —
> open the motor's memory, wait for the jog, then pair — and nothing is automated.
> Without the steps to hold you back, it's easier to confirm a pairing that didn't
> happen.

## 5. Removing a device

The **red cross** next to a member, in the list of linked devices. The assistant
runs the same radio procedure in reverse, and is confirmed with `UNPAIR FROM GROUP`.

> [!IMPORTANT]
> **Removal isn't just a setting.** The group's address is written in the motor's memory,
> not in the device: without this procedure, the motor would keep responding to the
> group's commands even after it disappeared from the list. So don't delete a group before
> removing its members — otherwise you'll have to recreate a group at the same address to detach them.

---

## Next step

* [Devices](Devices.md) — create a device and pair it with its motor.
* [Dashboard](Dashboard.md) — the group card, and the room filter.
* [Rooms](Rooms.md) — organise groups and devices.
