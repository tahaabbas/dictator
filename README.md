# Dictator - Voice Recording for Cursor AI

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/tahaabbas/dictator)

Dictator is a powerful VSCode extension that adds voice recording capabilities to Cursor AI's chat interface. Speak your thoughts and have them transcribed directly into the chat using state-of-the-art speech-to-text technology.

## Features

- 🎤 **Voice Recording**: Click the microphone button to start/stop recording
- 🧠 **AI-Powered Transcription**: Uses OpenAI's Whisper models for accurate speech-to-text
- 🌍 **Multi-Language Support**: Supports 90+ languages including English, Spanish, French, German, Chinese, and more
- ⚙️ **Model Selection**: Choose from different Whisper models (Base, Small, Medium, Large) based on your needs
- 🔥 **Real-time Processing**: Live audio visualization and streaming transcription
- 📝 **Smart Text Integration**: Transcribed text is automatically inserted into Cursor's chat
- ⌨️ **Keyboard Shortcuts**: Use Cmd+Shift+Y (Mac) or Ctrl+Shift+Y (Windows/Linux) to toggle recording

## Installation

1. Install the extension in VSCode/Cursor
2. Open the Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`)
3. Run the command: **"Enable Dictator"**
4. Restart VSCode/Cursor when prompted
5. The microphone button will appear in Cursor's chat interface

## Usage

### Basic Recording
1. Open Cursor's chat interface
2. Click the microphone button (🎤) to start recording
3. Speak your message
4. Click the stop button (⏹️) to stop recording
5. Your speech will be transcribed and inserted into the chat

### Keyboard Shortcut
- Press `Cmd+Shift+Y` (Mac) or `Ctrl+Shift+Y` (Windows/Linux) to toggle recording

### Language & Model Selection
1. Right-click on the microphone button
2. Select your preferred language from the dropdown
3. Choose a Whisper model based on your needs:
   - **Base** (142MB): Balanced speed and quality (Default)
   - **Small** (466MB): Better quality, slower processing
   - **Medium** (1.5GB): High quality, requires more resources
   - **Large** (2.9GB): Best quality, very resource-intensive

## Model Comparison

| Model | Size | Quality | Speed | Memory Usage | Recommended For |
|-------|------|---------|-------|--------------|-----------------|
| Base | 142MB | Good | Medium | Medium | Most users (Default) |
| Small | 466MB | High | Slow | High | Better accuracy needed |
| Medium | 1.5GB | High | Slow | High | Professional use |
| Large | 2.9GB | Excellent | Very Slow | Very High | Maximum accuracy |

## System Requirements

- **WebGPU Support**: Required for AI model processing
- **Microphone Access**: Browser will request permission
- **Memory**: Minimum 4GB RAM (16GB+ recommended for larger models)
- **Internet**: Required for initial model download

## Supported Languages

The extension supports 90+ languages including:
- English, Spanish, French, German, Italian, Portuguese
- Chinese (Mandarin), Japanese, Korean, Arabic, Hindi
- Russian, Ukrainian, Polish, Dutch, Swedish, Norwegian
- And many more...

## Troubleshooting

### Common Issues

**Extension not working after installation:**
- Make sure you ran "Enable Dictator" command
- Restart VSCode/Cursor completely
- Check if you have admin privileges (may be required)

**No microphone button visible:**
- Ensure you're in Cursor's chat interface
- Try refreshing the page or restarting the application
- Check browser console for any errors

**WebGPU not supported:**
- Your browser/system doesn't support WebGPU
- Try updating your browser or GPU drivers
- Use a WebGPU-compatible browser (Chrome 113+, Edge 113+)

**Model loading fails:**
- Check your internet connection
- Try a smaller model (Base instead of Large)
- Clear browser cache and try again

**Poor transcription quality:**
- Try a larger model (Small or Medium)
- Ensure good microphone quality and quiet environment
- Check if the correct language is selected

## Commands

- **Enable Dictator**: Installs and enables the voice recording functionality
- **Disable Dictator**: Removes the voice recording functionality
- **Reload Dictator**: Reloads the extension (useful after updates)

## Configuration

You can configure the extension through VSCode settings:

```json
{
  "dictator.statusbar": true  // Show status indicator in statusbar
}
```

## Security & Privacy

- All speech processing happens locally in your browser
- No audio data is sent to external servers
- Models are downloaded once and cached locally
- Your voice recordings are not stored permanently

## Development

This extension is built on top of:
- OpenAI's Whisper models via Hugging Face Transformers
- WebGPU for efficient AI model execution
- Web Audio API for recording and processing

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Open an issue on [GitHub](https://github.com/tahaabbas/dictator/issues)
3. Include your browser version, OS, and error messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: If VSCode shows a "corrupted" warning after installation, click "Don't Show Again". This is normal for extensions that modify the interface.
