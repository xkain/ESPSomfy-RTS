This page covers the dedicated **ESPSomfy-RTS enhanced** integration, installing it through HACS,
and compatibility with rstrouse's original integration. To control the device from Home
Assistant **without** a dedicated integration, see [MQTT](MQTT.md#mqtt-auto-discovery) or
the [REST API](Integrations.md#rest-interface-api).

Integrating **ESPSomfy-RTS** with **Home Assistant** isn't just an option, it's the natural next step for your installation. If ESPSomfy-RTS is the "brain" that talks to your motors, Home Assistant is the "conductor" that brings your home to life.

<img width="800px" src="https://github.com/user-attachments/assets/56f95aab-334b-446b-b64c-8e2f672b0e66" />
<img width="800px" src="https://github.com/user-attachments/assets/80c82ee9-625d-4cbb-a3d2-32525225eba3" />




# Why is it a winning combination?

Using the dedicated integration (through **HACS**) transforms your experience:

* **Native "Cover" handling:** your shades are recognised as standard entities ("Cover" objects). This lets you control them by voice through **Alexa, Google Assistant or Siri**, add them to polished touch dashboards, or operate them from the mobile app, whether you're in your lounge room or on the other side of the world.
* **Examples of advanced automations:** go beyond a simple button. Build a home that anticipates your needs:
    * *Arriving home:* the gate and garage open automatically as soon as your phone is detected 100 metres from home.
    * *Presence simulation:* while you're on holiday, Home Assistant moves your shades at random to simulate real activity and deter intruders.
    * *Circadian rhythm:* schedule a gentle wake-up with shades opening gradually 10 minutes before you get up, and closing automatically right at sunset.
* **Perfect sync:** unlike a normal remote that sends a signal "into the void", this integration reports the shades' state in real time. And every group created in ESPSomfy-RTS is imported into Home Assistant straight away, with all its commands.
* **Completely cloud-free:** the whole system runs on your local network. No dependence on Somfy's servers, nothing stops if the internet goes down, and almost no latency. Your shades respond instantly.

Once your automations are set up for the way you live, you'll never need to look for a remote again. It's a real **game changer** for the comfort of your home: the technology fades into the background and everyday life just flows.



# Installation via HACS

If you use Home Assistant, forget tedious manual configuration. Go to the integration's repository for an easy install in a few clicks:

| Resource | Download link |
| :--- | :--- |
| **Integration repository** | [ESPSomfy-RTS enhanced for Home Assistant](https://github.com/xkain/ESPSomfy-RTS-enhanced) |

<br />

<a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=xkain&repository=ESPSomfy-RTS-enhanced">
  <img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.">
</a>

---

# Integration documentation

Once the integration is installed, everything it exposes in Home Assistant — entities, services,
attributes, events — is documented in its **own wiki** (in French):

> ### 📘 [ESPSomfy-RTS enhanced wiki](https://github.com/xkain/ESPSomfy-RTS-enhanced/wiki)

| To… | Page |
| :--- | :--- |
| See what the integration creates (devices, groups, sensors, buttons) | [Exposed entities](https://github.com/xkain/ESPSomfy-RTS-enhanced/wiki/entites) |
| Track the device's state: network, Wi-Fi, Ethernet, memory | [Diagnostics](https://github.com/xkain/ESPSomfy-RTS-enhanced/wiki/diagnostics) |
| Read a position or the last command in a template | [Attributes in templates](https://github.com/xkain/ESPSomfy-RTS-enhanced/wiki/attributs) |
| React to a press on a physical remote | [Events](https://github.com/xkain/ESPSomfy-RTS-enhanced/wiki/evenements) |
| Call the services: movement, tilt, recalibration, sun and wind, raw RTS commands | [Services](https://github.com/xkain/ESPSomfy-RTS-enhanced/wiki/Services) |
| Start from complete, commented examples | [Automation recipes](https://github.com/xkain/ESPSomfy-RTS-enhanced/wiki/automatisations) |
| Understand what the RTS protocol can't do | [Pitfalls and limits](https://github.com/xkain/ESPSomfy-RTS-enhanced/wiki/pieges-et-limites) |

> [!IMPORTANT]
> The integration's domain is **`espsomfy_rts_enhanced`**. So your services are called in
> the form `espsomfy_rts_enhanced.<service>`, not `espsomfy_rts.<service>` as in
> the original integration. Keep this in mind if you reuse an automation found elsewhere.

Home Assistant's standard services (`cover.open_cover`, `cover.set_cover_position`,
`cover.stop_cover`…) also work on all of the integration's `cover` entities.

---

# Compatibility with rstrouse's integration (`ESPSomfy-RTS-HA`)

If you currently use rstrouse's original integration ([ESPSomfy-RTS-HA](https://github.com/rstrouse/ESPSomfy-RTS-HA)), the system will mostly work. **However, there is a critical problem with version tracking.**

The firmware's release notes won't show in Home Assistant when an update is available.

>[!IMPORTANT]
> **Why is this critical?** <br>
> The upcoming firmware **v3.0.0** will require a manual update procedure (a dedicated page will be added to the documentation). Without visible release notes, you risk starting an automatic update that will fail.

### Fix: correct the "Read release announcement" button

For the original integration to point to the right repository and show the release notes properly, you need to edit one of the integration's files by hand.

1. Open this file on your Home Assistant server:
   `/config/custom_components/espsomfy_rts/update.py`
2. Find the `release_url` function, around **line 155**.
3. Replace the existing block of code:

```python
@property
def release_url(self) -> str | None:
    """URL to the full release notes of the latest version available."""
    if (version := self.latest_version) is None:
        return None
    return f"https://github.com/rstouse/ESPSomfy-RTS/releases/tag/{version}"
```

with

```python
@property
def release_url(self) -> str | None:
    """URL to the full release notes of the latest version available."""
    if (version := self.latest_version) is None:
        return None
    return f"https://github.com/xkain/ESPSomfy-RTS/releases/tag/{version}"
```

and restart Home Assistant.
