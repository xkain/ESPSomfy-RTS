> [!NOTE]
> This page documents the binary format of the `.backup` file produced by **Backup**
> (see [Backup and restore](Firmware.md#backup-and-restore)) —
> a revised and updated version of the
> [Backup File Anatomy](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Backup-File-Anatomy) page
> of the original project (rstrouse). It's for anyone who wants to inspect, hand-edit or
> script a backup file — you don't need it to back up and
> restore day to day.

## Versioning

Every file carries a header version number. The firmware uses it to keep
reading older backups correctly as new fields are added — a field that appeared later is
simply missing from an old file, and the reader leaves it at its default value instead of
shifting everything else. Each field documented below shows the header version from which it is
present.

**Current v2.x.x versions write header version 25.**

> [!NOTE]
> This format is also used, in a reduced form, for the internal `/shades.cfg` file the
> device keeps during normal operation: it only contains the
> Room, Device, Group and Repeater records, without the Settings, Network and Radio blocks, which
> only exist in a `.backup` produced by **Backup**. That fuller file
> is the one documented here.

## General principle

As in the original format, the file is entirely readable text: a header on
the first line, then one record per line. Each value is separated by a
comma, numbers are right-aligned and padded with spaces, fixed-width text is
left-aligned and padded with spaces, and variable-length text is wrapped in
double quotes (so it can contain a comma itself without ambiguity).

> [!NOTE]
> All the values in the file below are **made up** — radio addresses, rolling codes,
> network and server ID were invented for the example; a real file is never
> shared as it is (this information makes it possible, among other things, to send radio commands
> in place of the original device). The structure, however, strictly follows the
> version 25 format described on this page. The names in the example are in French
> (*Salon* = lounge, *Cuisine* = kitchen, *Chambre* = bedroom, *Volet* = shutter,
> *Portail* = gate), and are left as they are because changing them would change the padding.

```
 25, 76,   29,  3,  276, 10,  200,  3,   77,  1,  102,  182,   78,A1B2C3   
  1,Salon               ,  0
  2,Cuisine             ,  1
  3,Chambre             ,  2
  1,true ,  4,    100101,Volet Chambre 1     ,  0,  0, 56,     17500,     17000,      7000,  100,         0,         0,         0,         0,         0,         0,         0,   42,  1,    -1.00000,    -1.00000,     0.00000,     0.00000,false,false,  3,  0,  0,  0,  0,  0,  3
  2,true ,  4,    100102,Volet Chambre 2     ,  0,  0, 56,     17000,     16400,      7000,  100,         0,         0,         0,         0,         0,         0,         0,   18,  1,    -1.00000,    -1.00000,    45.00000,     0.00000,false,false,  3,  1,  0,  0,  0,  0,  3
  3,true ,  4,    100103,Volet Atelier       ,  0,  0, 56,     17000,     16500,      7000,  100,         0,         0,         0,         0,         0,         0,         0,    7,  0,    -1.00000,    -1.00000,     0.00000,     0.00000,false,false,  0,  2,  0,  0,  0,  0,  0
  4,true ,  4,    100104,Volet Salon         ,  0,  0, 56,     30000,     26300,      7000,  100,         0,         0,         0,         0,         0,         0,         0,  247, 20,    -1.00000,    -1.00000,     0.00000,     0.00000,false,false,  2,  3,  0,  0,  0,  0,  1
  5,true ,  1,    100105,Store Vénitien     ,  2,  0, 56,     10000,     10000,      7000,  100,         0,         0,         0,         0,         0,         0,         0,   20,131,    71.00000,     0.00000,    71.00000,    31.00000,false,false,  0,  4,  0,  0,  0,  0,  1
  6,true , 13,    100106,Portail             ,  0,  0, 80,     10000,     10000,      7000,  100,         0,         0,         0,         0,         0,         0,         0,   22,  0,    -1.00000,    -1.00000,     0.00000,     0.00000,false,true ,  0,  5,  0,  0,  0,  0,  0
  7,true ,  4,    100107,Volet Salon Droit   ,  0,  0, 56,     10000,     10000,      7000,  100,         0,         0,         0,         0,         0,         0,         0,   14,128,    26.00000,    -1.00000,    26.00000,     0.00000,false,false,  0,  6,  0,  0,  0,  0,  1
  8,true ,  4,    100108,Volet Cuisine Droit ,  0,  0, 56,     10000,     10000,      7000,  100,         0,         0,         0,         0,         0,         0,         0,   11,128,    -1.00000,    -1.00000,     0.00000,     0.00000,false,false,  0,  7,  0,  0,  0,  0,  2
  9,true ,  4,    100109,Volet Cuisine Gauche,  0,  0, 56,     10000,     10000,      7000,  100,         0,         0,         0,         0,         0,         0,         0,   16,128,    -1.00000,    -1.00000,    19.00000,     0.00000,false,false,  0,  8,  0,  0,  0,  0,  2
 10,true ,  9,    100110,Lampe Terrasse      ,  0,  8, 56,     10000,     10000,      7000,  100,         0,         0,         0,         0,         0,         0,         0,    0,  8,    -1.00000,    -1.00000,     0.00000,     0.00000,false,false,  0,  9, 32, 33,  0,  1,  1
  1,  0,    200101,Rez-de-chaussée    ,  0, 56,  4,  7,  8,  9,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  2,  0,false,  0,    0
  2,  0,    200102,Chambres            ,  0, 56,  1,  2,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,false,  3,    0
  3,  0,    200103,Ouvertures          ,  0, 56,  6, 10,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  3,  2,false,  0,    0
    100199,         0,         0,         0,         0,         0,         0
"v2.6.0","ESPSomfyRTS-Demo","pool.ntp.org","CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00","#1a5fb4",true ,true ,  1
  1,true ,"192.168.1.50","192.168.1.1","255.255.255.0","192.168.1.1","0.0.0.0","mqtt://","192.168.1.10", 1883,true ,"espsomfy-a1b2c3","homeassistant",  0,  0,  0,   0,  -1,  23,  18
true ,  0, 56,  1, 18,  5, 23, 19, 21, 22,   433.420,    99.97,    47.60,  10
```

This file contains 3 rooms, 10 devices that are all **paired**, 3 groups with devices
actually linked, and 1 repeater record (7 addresses), followed by the settings
(102 bytes), network (182 bytes) and radio (78 bytes) blocks. It's the first line, the header, that
announces all this — each record is detailed in the rest of the page.

> [!IMPORTANT]
> **The padding isn't cosmetic: it's what keeps the file aligned.** A
> fixed-width text field (a device name, for example) is always padded
> to exactly its declared width minus one character, then followed by the separator. A single
> misaligned field shifts all the ones after it: the record no longer ends at the
> announced length, the whole file is rejected and the [serial monitor](Serial-Monitor.md)
> shows `Shade record length is … and should be …`.
>
> Watch out for accented characters in particular: the padding counts **bytes**, not
> characters. A name containing an `é` will therefore take up one column less on screen than the
> others — that's normal, and intended.

When reading a restore file, the firmware checks that the header is consistent
(version ≥ 1, plausible Device and Group record sizes) and then, for each
Room, Device and Group record, that the end of the line falls **exactly** at the
length announced in the header. If it doesn't, the restore is refused. The
three final blocks — Settings, Network, Radio — aren't checked this way: the
reader re-syncs on the end-of-line character if it didn't land exactly.

A few pointers to find your way around it — each of the fields mentioned is described, section
by section, in the rest of the page:

* **Device 5** ("Store Vénitien", Venetian blind) is the only one with tilt (tilt type
  `2`, integrated) — its current and tilt positions (`71.00000`/`31.00000`) show it
  part-way. Its name contains an accent, so its column is one character shorter than
  the others, for the same number of bytes.
* **Device 6** ("Portail", gate) is the only one using **80-bit** frames, and the only one with *Invert
  position* set to `true`.
* **Device 10** ("Lampe Terrasse", deck lamp) is a **dry contact** (type `9`) driven not by
  radio but by the ESP32's pins: its protocol is `8` (GP_Relay), its *GPIO
  Up* and *GPIO Down* fields are `32` and `33`, and its second-to-last field, *GPIO flags*,
  is `1` — low-level trigger. See [Motor control with GPIO](Motor-Control-with-GPIO.md).
* **Group 1** ("Rez-de-chaussée", ground floor) links 4 devices (4, 7, 8, 9) — their IDs
  appear at the start of the long run of zeros representing the 32 member slots.
* **Group 2** ("Chambres", bedrooms) has its **Room Id** set to `3` (Chambre): unlike
  devices, a group can be attached to a room even if its members aren't
  individually.
* The **repeater** (the line before the settings) carries only one address out of the 7 possible —
  the other six slots at `0` are simply unused.
* The **time zone** in the Settings record itself contains commas
  (`M3.5.0/02:00:00,M10.5.0/03:00:00`): this is exactly the case the double quotes of a
  variable-length field are meant to protect.
* The Settings record length announced in the header is `102`, whereas the
  line is actually **116**: that's the 14-byte gap explained in
  [the Settings record](#settings-record).

## Header record

A single record, always on the first line of the file, entirely fixed-width.

| Name | Length | Comment | Since version |
| --- | --- | --- | --- |
| Version | 3 | The version of this backup file | 1+ |
| Header length | 3 | The total length of the header, in bytes (76 in version 25) | 1+ |
| Room record length | 5 | 29 in version 25 | 19+ |
| Number of Room records | 3 | | 19+ |
| Device record length | 5 | 276 in version 25. Stored in 3 characters before version 13 | 1+ |
| Number of Device records | 3 | | 1+ |
| Group record length | 5 | 200 in version 25. Stored in 3 characters before version 13 | 11+ |
| Number of Group records | 3 | | 11+ |
| Repeater record length | 5 | 77 in version 25 | 21+ |
| Number of Repeater records | 3 | Always 1 | 21+ |
| Settings record length | 5 | 0 if absent | 14+ |
| Network record length | 5 | 0 if absent | 14+ |
| Radio record length | 5 | 0 if absent — 78 in version 25 | 14+ |
| Server ID | 9 | 6 hexadecimal characters derived from the chip's MAC address, padded with spaces. Also used for the Home Assistant MQTT discovery topic (`espsomfy-<id>`) — see [MQTT](MQTT.md#mqtt-auto-discovery) | 14+ |

> [!NOTE]
> This last field is called **Chip Id** in the original format. It decides what
> happens to the Ethernet settings on restore: if the file's ID doesn't match
> the device being restored, the EMAC wiring block (board type, PHY,
> clock, pins) is deliberately ignored, since it describes a board that isn't the one
> in front of you. Everything else in the Network block is restored normally.

> [!NOTE]
> **Why 14 rooms and not 16, 30 devices and not 32, 14 groups and not 16?** The
> file format does reserve 16 slots for rooms and groups, and 32 for
> devices — those are the *raw* capacities carried by the header fields and the
> IDs below. But the algorithm that assigns a new ID in the firmware
> (`getNextRoomId()` / `getNextShadeId()` / `getNextGroupId()`) never hands out either
> ID **0** (reserved as a sentinel value — for a room, that's exactly
> **Home**, the default room that is always present) or the **very last** ID in the
> range. So two slots out of 16 (or 32) are always out of reach from
> the interface, whatever number the file declares. Rather than let
> the user run into this low-level failure with no explanation, the interface sets this
> lower ceiling itself up front, so it can show a clear message that the limit has been
> reached. That lower number — **14, 30, 14** — is the one used everywhere else in this
> wiki.

## Room record

One record per room declared (up to 16, of which 14 can actually be reached from the
interface — see the note above). Entirely fixed-width, unchanged since the original
format. Total length: **29 bytes**.

| Name | Length | Comment | Since version |
| --- | --- | --- | --- |
| Room Id | 3 | 1 to 16, but only 1 to 14 are assigned automatically by the interface | 19+ |
| Name | 20 | | 19+ |
| Sort order | 3 | | 19+ |

See [Rooms](Rooms.md).

## Device record

One record per configured device (up to 32, of which 30 can actually be reached
from the interface — see the note above). Total length: **276 bytes**.

| Name | Length | Comment | Since version |
| --- | --- | --- | --- |
| Device Id | 3 | 1 to 32, but only 1 to 30 are assigned automatically by the interface | 1+ |
| Paired | 5 | `true`/`false` | 1+ |
| Device type | 3 | See the table of types below | 1+ |
| Address | 10 | The Somfy address (24 bits) assigned to the device | 1+ |
| Name | 20 | | 1+ |
| Tilt type | 3 | 0=None, 1=Tilt motor, 2=Integrated, 3=Tilt only, 4=Euro tilt | 1+ |
| Protocol | 3 | 0=RTS, 1=RTW, 2=RTV, 8=GP_Relay, 9=GP_Remote | 7+ |
| Frame length | 3 | 56 or 80 bits | 2+ |
| Up time | 10 | In ms | 1+ |
| Down time | 10 | In ms | 1+ |
| Tilt time | 10 | In ms — see [Travel times](Devices.md#3-travel-times) | 1+ |
| Step size | 5 | 1 to 1000 | 6+ |
| Linked remote 1 to 5 | 10 each | The remote's address | 1+ |
| Linked remote 6 and 7 | 10 each | | 5+ |
| Last rolling code | 5 | | 1+ |
| Sensor flags | 3 | Bitmask, see the table below | 8+ |
| My position | 12 | 5 decimals, -1 = not set | 1+ |
| My tilt position | 12 | 5 decimals, -1 = not set | 4+ |
| Current position | 12 | 5 decimals, 0-100 | 1+ |
| Current tilt position | 12 | 5 decimals, 0-100 | 1+ |
| Invert commands | 5 | Up becomes Down and vice versa | 9+ |
| Invert position | 5 | 0% becomes closed or open | 10+ |
| Repeats | 3 | Number of repeats per command sent | 12+ |
| Sort order | 3 | | 13+ |
| GPIO Up | 3 | If GP_* protocol — see [Motor control with GPIO](Motor-Control-with-GPIO.md) | 15+ |
| GPIO Down | 3 | If GP_* protocol | 15+ |
| GPIO My | 3 | If GP_Remote protocol | 16+ |
| GPIO flags | 3 | Bit 1 (`0x01`) = low-level trigger | 17+ |
| Room Id | 3 | | 19+ |

### Sensor flags

The *Sensor flags* field is a bitmask, written in decimal. So the values
seen in a file are sums: `131` = `0x80 | 0x02 | 0x01`.

| Bit | Name | Meaning |
| --- | --- | --- |
| `0x01` | SunFlag | The sun sensor is enabled for this device |
| `0x02` | SunSensor | The device has a sun sensor |
| `0x04` | DemoMode | Demo mode |
| `0x08` | Light | The device exposes a light output (Garage types) |
| `0x10` | Windy | Last wind state received |
| `0x20` | Sunny | Last sun state received |
| `0x40` | Lighted | Last state of the light output |
| `0x80` | SimMy | The My position is simulated by the firmware |

See [Linking a sensor](Devices.md#7-linking-a-sensor).

### Device types

17 device types in total:

| Code | Type |
| --- | --- |
| 0 | Roller shade |
| 1 | Blind |
| 2 | Drapery (left) |
| 3 | Awning |
| 4 | Shutter |
| 5 | Garage (1-button) |
| 6 | Garage (3-button) |
| 7 | Drapery (right) |
| 8 | Drapery (center) |
| 9 | Dry contact (1-button) |
| 10 | Dry contact (2-button) |
| 11 | Gate (left) |
| 12 | Gate (center) |
| 13 | Gate (right) |
| 14 | Gate (1-button left) |
| 15 | Gate (1-button center) |
| 16 | Gate (1-button right) |

These 17 codes, and their numeric values, are those of the original format: only the
labels shown by the interface have changed. See
[Identification and type](Devices.md#identification-and-type) for a description of each.

## Group record

One record per group (up to 16, of which 14 can actually be reached from the interface
— see the note above), absent from files before version 11. Total length:
**200 bytes**.

| Name | Length | Comment | Since version |
| --- | --- | --- | --- |
| Group Id | 3 | 0 to 16, but only 1 to 14 are assigned automatically by the interface (0 is, as for rooms, never handed out) | 11+ |
| Group type | 3 | Always 0 currently | 11+ |
| Address | 10 | The Somfy address assigned to the group | 11+ |
| Name | 20 | | 11+ |
| Protocol | 3 | 0=RTS, 1=RTW, 2=RTV, 8=GP_Relay, 9=GP_Remote | 11+ |
| Frame length | 3 | 56 or 80 bits | 11+ |
| Member Id 1 to 32 | 3 each | ID of the member device, 0 = empty slot | 11+ |
| Repeats | 3 | | 12+ |
| Sort order | 3 | | 13+ |
| Invert commands | 5 | | 18+ |
| Room Id | 3 | | 19+ |
| Last rolling code | 5 | | 24+ |

> [!NOTE]
> Real capacity: since the maximum number of devices on the unit (30, see the note
> above) is lower than the number of member slots in the format (32), at least two of
> these 32 slots are always empty — see [Groups](Groups.md) for the
> effective limit.
>
> When read back, empty slots are compacted: if a group's members are
> scattered through the list, they end up grouped at the start. So the order of the IDs in
> the file doesn't matter.

## Repeater record

A single record, 7 addresses in a row — absent from files before
version 21. Total length: **77 bytes**.

| Name | Length | Comment | Since version |
| --- | --- | --- | --- |
| Repeater address 1 to 7 | 10 each | 0 = unused slot. See [Repeaters](Repeaters.md) | 21+ |

## Settings record

A single record, of **variable** length (it depends on the actual length of the
text it contains). Absent from files before version 14. The fields described
here are listed in the order the interface shows them — see
[Options](Options.md).

| Name | Type | Comment | Since version |
| --- | --- | --- | --- |
| Firmware | Variable text | Firmware version at the time of the backup | 14+ |
| Hostname | Variable text | | 14+ |
| NTP server | Variable text | | 14+ |
| Time zone | Variable text | In POSIX format | 14+ |
| Accent colour | Variable text | Hex colour code, `#1a5fb4` by default — see the note below | 25, firmware v2.5.1+ |
| uPnP broadcast (SSDP) | 5 | `true`/`false` | 14+ |
| Update check | 5 | `true`/`false` | 20+ |
| Language | 3 | Index of the active language: 0=English, 1=French, 2=German, 3=Spanish | 25+ |

> [!WARNING]
> **The announced length of this record is shorter than its real length.** The
> *Accent colour* arrived with firmware v2.5.1 without the header version
> moving from 25 to 26, and the size calculation that feeds the header didn't keep up: it leaves out this
> field, and the *Language*. The gap is **14 bytes** on a file produced by
> v2.5.1 or later.
>
> The consequence for anyone parsing a file by hand: the sum
> `header + rooms + devices + groups + repeaters + settings + network + radio`
> comes out 14 bytes short of the file's real size, and the Settings record
> is the only one whose announced length mustn't be used to move through the file. Rely on the end
> of line. This is also why the `File size is not correct` message appears in the
> [serial monitor](Serial-Monitor.md) on every restore.

## Network record

A single record, of variable length — absent from files before
version 14. As in the original format, **no password** (Wi-Fi, MQTT) is included.

| Name | Type | Comment | Since version |
| --- | --- | --- | --- |
| Connection type | 3 | 0=Not set, 1=Wi-Fi, 2=Ethernet, 3=Ethernet preferred, 4=Access point — see [Network connection](Network-Connection.md) | 14+ |
| DHCP | 5 | `true`/`false` — see [DHCP and static IP](DHCP-and-Static-IP.md) | 14+ |
| IP address | Variable text | | 14+ |
| Gateway | Variable text | | 14+ |
| Subnet mask | Variable text | | 14+ |
| DNS 1 | Variable text | | 14+ |
| DNS 2 | Variable text | | 14+ |
| MQTT protocol | Variable text | `mqtt://` | 22+ |
| MQTT host | Variable text | | 22+ |
| MQTT port | 5 | | 22+ |
| Publish MQTT discovery | 5 | `true`/`false` | 22+ |
| MQTT root topic | Variable text | | 22+ |
| MQTT discovery topic | Variable text | | 22+ |
| Ethernet board type | 3 | 0=Manual, 1=WT32-ETH01, 2=ESP32-POE (Olimex), 3=ESP32-EVB (Olimex), 4=T-Internet POE (LilyGO), 5=wESP32 v7+, 6=wESP32 <v7, 7=EST-PoE-32 | 14+ |
| PHY type | 3 | 0=LAN8720, 1=TLK110, 2=RTL8201, 3=DP83848, 4=DM9051, 5=KZ8081 | 14+ |
| Clock mode | 3 | 0=GPIO0 In, 1=GPIO0 Out, 2=GPIO16 Out, 3=GPIO17 Out | 14+ |
| PHY address | 4 | | 14+ |
| PWR pin | 4 | -1 = none | 14+ |
| MDC pin | 4 | | 14+ |
| MDIO pin | 4 | | 14+ |

> [!NOTE]
> Ethernet board type 7 (**EST-PoE-32**) is new compared with the original format;
> the seven earlier values are unchanged. The last four fields, along with the PHY type
> and clock mode, are only restored if the file's server ID is
> the device's own — see the note on the header record.

## Radio record (Transceiver)

A single record, entirely fixed-width — absent from files before
version 14. Total length: **78 bytes**.

| Name | Length | Comment | Since version |
| --- | --- | --- | --- |
| Enabled | 5 | `true`/`false` | 14+ |
| Protocol | 3 | 0=RTS, 1=RTW, 2=RTV | 14+ |
| Frame length | 3 | 56 or 80 bits | 14+ |
| Board preset | 3 | See [Components](Components.md) | 25+ |
| SCK pin | 3 | | 14+ |
| CSN pin | 3 | | 14+ |
| MOSI pin | 3 | | 14+ |
| MISO pin | 3 | | 14+ |
| TX pin | 3 | | 14+ |
| RX pin | 3 | | 14+ |
| Frequency | 10 | In MHz, 3 decimals | 14+ |
| RX bandwidth | 9 | In kHz, 2 decimals | 14+ |
| Frequency deviation | 9 | In kHz, 2 decimals — plays no part in reception, see [Tuning the radio](Radio-Setup.md#tuning-the-radio) | 14+ |
| Transmit power | 4 | In dBm | 14+ |

> [!NOTE]
> The *Board preset* field didn't exist before version 25. Since adding it didn't
> come with a new version number, the reader detects it another way: a
> Radio record shorter than 78 bytes is from an older file, and the preset is
> then treated as 0 (auto-detection).
