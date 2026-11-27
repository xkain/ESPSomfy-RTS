ESPSomfy-RTS includes a signal repeater function. The device "listens" for the radio frames from your physical remotes and retransmits them instantly.

<img width="100%" src="https://github.com/user-attachments/assets/aaf9ad38-1a64-4b46-a261-017064c22063" />

### Why use the Repeater?
This is useful when a physical remote is too far from a shade to operate it directly. ESPSomfy-RTS picks up the signal and sends it again with the power of its own radio, acting as a "bridge" between the remote and the motor.

### ⚙️ How it works
* **Frame analysis**: every time it receives a frame, ESPSomfy-RTS checks whether the source address is in its list of repeaters.
* **A moment of silence**: to avoid radio collisions (two transmitters talking at once), the system waits for a short moment of radio silence after the original transmission ends before repeating the frame.
* **Range**: ESPSomfy-RTS usually has a longer range than a small remote, so the repeated signal reaches the target motors more easily.


### ⚠️ Precautions and limitations
Using repeaters increases radio traffic. Overusing them can saturate the 433 MHz band.

> [!CAUTION]
> **Risk of an infinite loop:**
> If you have several ESPSomfy-RTS devices, **never set up the same remote as a repeater on more than one device**.
> The devices would bounce the signal back and forth forever (A repeats to B, B repeats to A, and so on), completely paralysing your radio installation. **One remote = one repeater device only.**


###  Setting up a Repeater

The scan function makes this automatic:

1.  **Access**: go to the `Somfy` section > `Repeaters` tab.
2.  **Start the scan**: click the `SEARCH REMOTE` button.
3.  **Capture**: the assistant opens. Press any button on your physical remote.

    <img width="500" src="https://github.com/user-attachments/assets/fdef6143-d291-44ab-aee6-5b74795da43d" />

4.  **Confirmation**: as soon as the signal is heard, the assistant closes and the remote's address is added to the list of active repeaters.

    <img width="500" src="https://github.com/user-attachments/assets/1fce0791-a3d0-490a-aeaa-8adce6a38129" />
