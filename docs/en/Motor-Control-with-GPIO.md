ESPSomfy-RTS can drive motors through GPIO pins, either with external relays or by modifying an existing remote (a "dissected remote"). This lets you mix radio motors with wired motors controlled by relays, or triggered from an unsupported remote. You can use any free output pin on your ESP32 to command up or down.

# IO-Relay protocol
As well as the radio protocols, ESPSomfy-RTS supports two separate GPIO protocols. If you bought "bare" motors without a controller, you can simply trigger them with a pair of relays.
>[!IMPORTANT]
>Don't confuse the `IO-Relay protocol` with the `IO protocol`: they are two completely different things.

## How it works
When you choose IO-Relay as a motor's protocol, ESPSomfy RTS powers the selected up or down pin depending on the direction wanted. When the target position is reached, the pin is switched off automatically.

* **Movement logic**: the ESP32 activates (pulls high) the up pin to move up and the down pin to move down. At rest, both pins are off (pulled low).
* **Just like radio**: in this setup, the motors work as if they were driven by radio. Every function, such as the "My" button, works perfectly. Even positioning is supported!
* **Interoperability**: if you have a free channel on a radio remote, you can even link it to move this non-radio motor. You can also link this motor to a sun or wind sensor.

## Setup

Select the IO-Relay protocol for the shade. Two drop-down menus appear for choosing the Up and Down relay pins.

* **Timing**: remember to set your travel times so the motor knows when to stop, especially if you have no limit switches.
* **Dry contact**: if the type is "Dry Contact", ESPSomfy RTS simply toggles the relay (On/Off). Useful for adding simple switches (only one pin used).

<img width="100%" src="https://github.com/user-attachments/assets/97c602a6-6721-4374-80e4-4c7c26dcf082" />

>[!NOTE]
>Only one pin is active at a time, so no conflicting commands ever reach the motor. How long it stays on is set by your up/down travel times (handy if your motor is slower going up than coming down).


# IO-Remote protocol
If you have an unsupported radio protocol, you can add your own support by dissecting an original remote. ESPSomfy-RTS then simulates presses of the Up, Down and My buttons.

>[!IMPORTANT]
>Don't confuse the `IO-Remote protocol` with the `IO protocol`: they are two completely different things.

## How it works
As with the IO-Relay protocol, every function remains available. However, because you get no status feedback from the motor while it runs, you should only control the motor through the ESPSomfy-RTS interface to keep it accurate.

## Setup
Select IO-Remote. Depending on how many buttons the remote you are emulating has, you get between 1 and 3 pin selections. For example, a dry contact or a single-button garage door only shows the "Down" pin.

<img width="100%" src="https://github.com/user-attachments/assets/0604b870-7b34-48de-81da-8244fdebeabf" />

>[!NOTE]
>It's worth searching the web for the wiring. Many remotes work perfectly when powered from the ESP32's 3.3V pins. The middle pin of each button is then connected to the pin provided for the `up`, `down` and/or `my` buttons.
