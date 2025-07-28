# Dictator — speak to Cursor with real‑time voice‑to‑text

<p align="left">
<a href="https://www.buymeacoffee.com/echosys" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" height="40"></a>
<a href="https://www.paypal.com/donate/?hosted_button_id=QTFKNZEVZDBGY" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-blue.svg" alt="Donate via PayPal" height="40"></a>
</p>

Dictator adds voice recording and transcription to Cursor AI’s chat interface so you can talk to your code assistant instead of typing. It runs entirely in your browser using OpenAI’s Whisper models, so your audio never leaves your machine.

## Why Dictator?

- **Faster brainstorming** – speak your thoughts and see them appear instantly in Cursor’s chat. Perfect for long prompts or hands‑free coding.
- **Multilingual** – supports 90+ languages including English, Spanish, Mandarin, French and more.
- **Choose your model** – pick from Whisper’s Base, Small, Medium or Large models depending on your hardware.
- **Privacy by design** – all audio processing happens locally; no recordings are sent to external servers.

## Demo

![Dictator for Cursor](https://echosys.dev/images/others/Dictator.png)
![Dictator language and model selection](https://echosys.dev/images/others/Dictator2.png)

## Getting started

### Installation

1. Install the Dictator extension in VS Code or Cursor.
2. Open the command palette (`Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on macOS).
3. Run **“Enable Dictator”**.
4. Restart Cursor when prompted. You’ll see a microphone button in the chat interface.

### Usage

- Click the microphone button to start recording; click stop to end. Dictator will transcribe your speech and insert it into the chat.
- Use `Ctrl+Shift+Y` (Windows/Linux) or `Cmd+Shift+Y` (Mac) to toggle recording.
- Right‑click the microphone to choose your language and model.

## Troubleshooting

If Dictator doesn’t appear or stops working, try these steps:

- Make sure you’ve run the **“Enable Dictator”** command and restarted Cursor.
- Verify that your browser supports WebGPU and you have at least 4 GB of RAM (16 GB+ recommended for larger models).
- See the **Troubleshooting** section in the original documentation for more tips.

## Contributing

Contributions are welcome! Please open an issue to report bugs or suggest features. See CONTRIBUTING.md for guidelines.

## License

This project is licensed under the MIT License. See `LICENSE.txt` for details.
