This sub-tab manages the device's **IP address** on your network: the one you type into
your browser, and the one Home Assistant will use. It is in the **Network** tab,
second sub-tab, next to [Connexion](Network-Connection.md) and
[MQTT](MQTT.md).

> [!NOTE]
> This page is only for **fixing** the address. If the device isn't on your network yet,
> start with [Connexion](Network-Connection.md), which covers Wi-Fi, Ethernet and
> connection troubleshooting.

---

# What you see on screen

From top to bottom:

* **`IP Address`** — read-only, the address the device is currently using.
* **`DHCP`** — *"Automatically obtain an IP address (DHCP)"*. **On by default**: your
  router assigns the address.
* **The manual addressing fields**, which only appear if you **turn off** DHCP:
  `Static IP Address`, `Subnet Mask`, `Gateway`, `DNS Server 1` and `DNS Server 2`.
* **The `SAVE` and `REBOOT` buttons**, with a reminder above them: *"Settings will only be
  applied after restarting the ESPSomfy RTS module"*.

> [!IMPORTANT]
> Unlike the interface's other settings, an addressing change **only takes effect
> after a restart**. Save, then use the `REBOOT` button right next to it.

<img width="1600" alt="Screenshot 2026-05-21 at 18 01 13" src="https://github.com/user-attachments/assets/0cd70e4c-0d45-46a8-933f-592c055dbac0" />

---

# Why fix the address?

By default, your router assigns the device an address, and **nothing guarantees it
stays the same**. After a power cut or a router restart, the device may well get a
different address. The result: your browser bookmark stops working, and a Home Assistant
integration set up by IP gets disconnected.

There are two ways to solve this. **They are not equally good** — the first is
much better.

## The right way: a DHCP reservation

The most reliable method is **not** in this interface: it means creating a
**DHCP reservation** (also called a *static lease* or *fixed IP*, depending on the router) in
your router's settings, using the device's
[MAC address](Network-Connection.md#1-the-information-block-at-the-top). You then leave
`DHCP` on in ESPSomfy-RTS, and the router always hands it the same
address.

**Why is this better?** Because your router keeps track of the addresses on
your network. By leaving it in charge, you avoid any risk of an address conflict, and
the device stays reachable even if mDNS (`.local`) is slow to propagate.

> [!TIP]
> **Where do you find the MAC address?** In the information block at the top of the
> [Connexion](Network-Connection.md#1-the-information-block-at-the-top) sub-tab.

> [!NOTE]
> A reservation only covers **one** MAC address. Wi-Fi and Ethernet are two separate
> interfaces, each with its own: if you use Ethernet, or the
> `Wi-Fi fallback`, you need **one reservation per interface** — see
> [The IP address has changed](Network-Connection.md#d-the-ip-address-has-changed).

## Static IP (advanced users)

If you'd rather manage addressing by hand, turn off the `DHCP` switch, fill in the
five fields, then `SAVE` and `REBOOT`.

| Field | What to enter |
|---|---|
| `Static IP Address` | A free address on your network, **outside the range your router hands out**, so it can't be assigned twice. |
| `Subnet Mask` | Almost always `255.255.255.0` on a home network. |
| `Gateway` | Your router's address (often `192.168.1.1` or `192.168.0.1`). |
| `DNS Server 1` | Usually your router's address, the same as the gateway. |
| `DNS Server 2` | Optional — a backup DNS server. |

> [!CAUTION]
> **A mistake here makes the device invisible on your network.** If you aren't sure of your
> subnet's address range, your gateway and your DNS servers, leave these settings alone:
> stay on `DHCP` and make a reservation on your router.

> [!TIP]
> **If you lock yourself out:** after a long connection failure, the device
> turns its `ESPSomfyRTS` access point back on by itself, and you can reconnect to it at
> `http://192.168.4.1` to fix the addressing. If it is still unreachable, see
> [Factory Reset](Factory-Reset.md).
