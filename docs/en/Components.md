This guide explains how to build an ESPSomfy-RTS device. No soldering iron or advanced development knowledge is needed: just a few components and Dupont connectors.

### Required components
* 1 - ESP32 module
* 1 - CC1101 transceiver module
* 8 - Dupont jumper wires (female/female)

## Choosing your ESP32
First you need to choose between a Wi-Fi or an Ethernet connection.

**Minimum specifications**: the board must have at least 4 MB of flash memory.<br>
**Updates**: once the first flash is done, software updates happen remotely (OTA) without touching the module.


### Wifi
Most boards meet the specifications above.

Supported boards:
* ESP-WROOM-32
* ESP32s2
* ESP32s3
* ESP32c3.

### Ethernet
Supported Ethernet boards (PoE or wired):
* Wireless Tag WT32-ETH01
* Olimex ESP32-POE
* Olimex ESP32-EVB
* LILYGO T-Internet POE
* Silicognition wESP32 (all versions)
* Everything Smart EST-PoE-32


> Note: Ethernet models often have fewer pins available, and you may need to disconnect the CC1101 for the first serial flash.

> [!IMPORTANT]
> Always check your board's configuration. Although these settings are based on the latest manufacturer data, technical specifications can vary from one batch to the next. A wrong Ethernet configuration can cause permanent hardware damage to your ESP32.

## Choosing the CC1101 module
Preferred model: the E07-M1101D-SMA (recognisable by its blue PCB). It's the most reliable module for this project, with the best receive sensitivity and the best range.

* **Models to avoid**: boards marked D-SUN. Testing showed poor reliability (hardware failures, unstable reception and range limited to under 5 metres).
* **Antenna**: prefer versions with an SMA connector (removable "duck" antenna) over soldered spring antennas, for a more stable signal.

> [!TIP]
> To identify the right module easily, look for the blue PCB identical to the picture below.
![20260317_225207](https://github.com/user-attachments/assets/dc4dc101-2836-4af1-b17b-8dd1a6cfc18d)


### Improving range (antenna)
Although the 5 cm "duck" antenna supplied by default performs surprisingly well, some environments (thick stone walls, render, or installation in a server rack) may need a stronger signal.

* **Antennas to avoid**: be wary of cheap 433 MHz antennas or ones meant for other uses (e.g. gate motors). Testing showed that some badly tuned antennas can literally "kill" ESPSomfy's range.
* **Recommended antennas**: a 10 cm (4 inch) 3dBi antenna can take a signal from, for example, -56 dBm to -31 dBm (the closer the number is to zero, the better the signal).

With this one simple change, the device can sit in a metal patch cabinet or behind several load-bearing walls without a single failed command. The gain in reception is huge, far better than Somfy's own hardware. It can pick up remotes from the furthest corners of the house and beyond (up to 150-200 metres at most with no obstacles or electromagnetic interference).

If you still have reception problems after this change, the antenna won't be the cause: check your frequency settings instead.

>[!TIP]
>https://fr.aliexpress.com/item/1005005200440286.html?spm=a2g0o.order_list.order_list_main.5.69225e5bxbuO2V&gatewayAdapt=glo2fra#nav-specification

### Assembling the hardware
Assembly is very simple and needs no soldering or breadboard. Eight female-female Dupont wires (10 cm) are enough to connect the CC1101 transceiver directly to the ESP32.

Connection tips:

* **Identifying the pins**: on many CC1101 modules, the pins aren't named, just numbered. Always refer to the wiring diagram in the next section.
* **10-pin variant**: if you have a 10-pin module, it's a standard version with doubled VCC and GND pins. You can use either of the two power connections.
* **Ethernet (PoE) models**: the wiring is different because the Ethernet port takes up a lot of GPIO pins.
    * RX: preferably use an "input-only" pin (typically GPIO 32 or above).

>[!NOTE]
> If you use a standard Wi-Fi model, you don't even need to disconnect the radio to program the device. The software handles it all transparently.


# Pin configuration

The settings below are suggestions for the most common ESP32 models.

ESPSomfy-RTS can use one and the same pin for transmitting (TX) and receiving (RX). The software switches the pin's state automatically as needed.

* **Wiring**: connect only the CC1101's GDO0 pin to the ESP32.
* **Software configuration**: in the radio settings, assign the same GPIO number to the RX and TX fields.
* **Advantage**: this frees up a pin on your ESP32, which is especially useful on Ethernet (PoE) models where pins are scarce.

>[!NOTE]
>This simplified setup works with every board model listed in this documentation.

## ESP-WROOM-32 / ESP32S
This is the simplest, most reliable and cheapest option for a Wi-Fi connection. These boards usually have a built-in USB port, which makes the first programming much easier.

| Pin | Description | ESP32 Pin |
| --- | ----------- | ------- |
| 1 | GND | GND |
| 2 | VCC | 3v3 |
| 3 | GDO0 - this is the TX pin | GPIO 13 |
| 4 | CSN | GPIO 5 |
| 5 | SCK | GPIO 18 |
| 6 | MOSI | GPIO 23 |
| 7 | MISO | GPIO 19 |
| 8 | GDO2 - this is the RX pin | GPIO 12 |

<sup>Note: this diagram is based on the E07-M1101D module. If you use a different CC1101 model, go by the functions in the middle column.</sup>

Installation tips:
* **Touch pins**: don't choose "Touch" (capacitive) pins for radio signals (such as GDO0), as they are extremely sensitive to electromagnetic interference as soon as your hand gets near the case.
* **Flexibility**: you can change these predefined assignments in the software interface, but the diagram above is tested and confirmed to work without conflicts.

![image](https://user-images.githubusercontent.com/47839015/227078539-9b7a5f0d-21a4-45c5-b96b-cabfaceafcbb.png)


## ESP32 D1 mini
This miniature ESP32 variant combines the compact size of the old D1 Mini format (ESP8266) with all the power and Bluetooth of the standard ESP32. Its small, standardised format makes it the ideal choice, and it has a native USB-C/Micro-USB port.

| Pin | Description | ESP32 Pin |
| --- | ----------- | ------- |
| 1 | GND | GND |
| 2 | VCC | 3v3 |
| 3 | GDO0 - this is the TX pin | GPIO 21 |
| 4 | CSN | GPIO 5 |
| 5 | SCK | GPIO 18 |
| 6 | MOSI | GPIO 23 |
| 7 | MISO | GPIO 19 |
| 8 | GDO2 - this is the RX pin | GPIO 22 |

<sup>Note: this diagram is based on the E07-M1101D module. If you use a different CC1101 model, go by the functions in the middle column.</sup>



## WT32-ETH01
The WT32-ETH01 model can connect over an Ethernet cable or Wi-Fi. Careful: the Ethernet port takes up a large share of the ESP32's pins, which greatly reduces the number available for the transceiver.

| Pin | Description | ESP32 Pin |
| --- | ----------- | ------- |
| 1 | GND | GND |
| 2 | VCC | 3v3 |
| 3 | GDO0 - this is the TX pin | GPIO 02 |
| 4 | CSN | GPIO 12 |
| 5 | SCK | GPIO 14 |
| 6 | MOSI | GPIO 15 |
| 7 | MISO | GPIO 04 |
| 8 | GDO2 - this is the RX pin | GPIO 35 |

<sup>Note: this diagram is based on the E07-M1101D module. If you use a different CC1101 model, go by the functions in the middle column.</sup>

## Olimex ESP32-PoE/EVB
These boards support Power over Ethernet (PoE), so the device gets power and data over a single network cable. They are more flexible than the WT32-ETH01 thanks to the UEXT connector.

| Pin | Description | ESP32 Pin |
| --- | ----------- | ------- |
| 1 | GND | GND |
| 2 | VCC | 3v3 |
| 3 | GDO0 - this is the TX pin | GPIO 04 |
| 4 | CSN | GPIO 13 |
| 5 | SCK | GPIO 14 |
| 6 | MOSI | GPIO 15 |
| 7 | MISO | GPIO 16 |
| 8 | GDO2 - this is the RX pin | GPIO 36 |

<sup>Note: this diagram is based on the E07-M1101D module. If you use a different CC1101 model, go by the functions in the middle column.</sup>

Tips and safety:
* **Simplicity**: all the suggested pins are grouped on the UEXT connector. You can make a direct adapter without using a breadboard.
* **Flashing**: the board has a built-in micro-USB port, making the first programming easy without an external converter.
* **Warning (non-ISO models)**: if you don't have the isolated (ISO) version, never connect the PoE Ethernet cable and the USB cable at the same time, or you risk damaging the board.


## LilyGO T-Internet POE
Another compact option that supports Power over Ethernet (PoE). Although the number of available pins is limited, it's still enough to connect the CC1101 transceiver.

![image](https://github.com/rstrouse/ESPSomfy-RTS/assets/47839015/8569735b-8397-4a1c-9603-9975442d88c7)

<sup><sub>Thanks to Oliver for this diagram</sub></sup>

| Pin | Description | ESP32 Pin |
| --- | ----------- | ------- |
| 1 | GND | GND |
| 2 | VCC | 3v3 |
| 3 | GDO0 - this is the TX pin | GPIO 04 |
| 4 | CSN | GPIO 12 |
| 5 | SCK | GPIO 14 |
| 6 | MOSI | GPIO 15 |
| 7 | MISO | GPIO 16 |
| 8 | GDO2 - this is the RX pin | GPIO 35 |

<sup>Note: this diagram is based on the E07-M1101D module. If you use a different CC1101 model, go by the functions in the middle column.</sup>

>[!NOTE]
>**Programming**: this board needs a small interface board (the "programmer card") for the first firmware flash. Once that's done, the device can be updated remotely (OTA).


## wESP POE
This board is interesting because it has more pins available than most other Ethernet options.

| Pin | Description | ESP32 Pin |
| --- | ----------- | ------- |
| 1 | GND | GND |
| 2 | VCC | 3v3 |
| 3 | GDO0 - this is the TX pin | GPIO 04 |
| 4 | CSN | GPIO 05 |
| 5 | SCK | GPIO 18 |
| 6 | MOSI | GPIO 13 |
| 7 | MISO | GPIO 32 |
| 8 | GDO2 - this is the RX pin | GPIO 39 |

<sup><sub>Note: this diagram is based on the E07-M1101D module. If you use a different model, go by the functions in the middle column.</sub></sup>

>[!NOTE]
>**Programming**: as with other compact models, you'll need a serial converter (USB dongle) for the first firmware flash. Later updates can be done over the network (OTA).

## ESP-PoE-32
A robust solution for a wired Ethernet connection with PoE support. Here is the recommended pin configuration:

![image](https://github.com/user-attachments/assets/f0999ec4-aa52-425c-8004-01a11f60c85e)

| Pin | Description | ESP32 Pin |
| --- | ----------- | ------- |
| 1 | GND | GND |
| 2 | VCC | 3v3 |
| 3 | GDO0 - this is the TX pin | GPIO 04 |
| 4 | CSN | GPIO 05 |
| 5 | SCK | GPIO 14 |
| 6 | MOSI | GPIO 13 |
| 7 | MISO | GPIO 32 |
| 8 | GDO2 - this is the RX pin | GPIO 35 |

<sup><sub>Note: this diagram is based on the E07-M1101D module. If you use a different model, go by the functions in the middle column.</sub></sup>


# ESP32s3 Mini
This is a tiny postage-stamp-sized board, ideal for extreme miniaturisation projects. Despite its small size, it performs very well. Visit the following [wiki](https://github.com/rstrouse/ESPSomfy-RTS/wiki/Mini-ESP32s3-Device-Build) for an example miniaturised build. Here are pinouts that work really well:

![image](https://github.com/rstrouse/ESPSomfy-RTS/assets/47839015/56a660f0-209a-4074-ba78-827f126099cb)

| Pin | Description | ESP32 Pin |
| --- | ----------- | ------- |
| 1 | GND | GND |
| 2 | VCC | 3v3 |
| 3 | GDO0 - this is the TX pin | GPIO 03 |
| 4 | CSN | GPIO 06 |
| 5 | SCK | GPIO 07 |
| 6 | MOSI | GPIO 09 |
| 7 | MISO | GPIO 08 |
| 8 | GDO2 - this is the RX pin | GPIO 04 |

<sup><sub>Note: this diagram is based on the E07-M1101D module. If you use a different model, go by the functions in the middle column.</sub></sup>
