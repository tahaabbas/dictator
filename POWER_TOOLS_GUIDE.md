# ⚡ Power Tools for Cursor - Developer's Guide

Power Tools extends your Dictator voice recording plugin with advanced developer-focused features and customizable AI workflows. This guide will help you maximize your productivity with these new capabilities.

## 🚀 Quick Start

1. **Install/Enable Dictator** - Run the "Enable Dictator" command from VS Code command palette
2. **Look for the Flash Icon** - Next to the microphone in Cursor's chat interface, you'll see a ⚡ flash icon
3. **Right-click or Left-click** the flash icon to open the Power Tools context menu
4. **Customize Templates** - Use "⚙️ Power Tool Settings" to add your own prompt templates

## 🎯 Core Features

### 1. **Predefined Prompt Templates**
Ready-to-use AI prompts for common development tasks:

- **🧪 Generate Tests** (`Cmd+Shift+T`) - Creates comprehensive unit tests
- **🐛 Bug Analysis** (`Cmd+Shift+B`) - Analyzes code for potential issues
- **📚 Generate Docs** (`Cmd+Shift+D`) - Creates documentation and comments
- **👀 Code Review** - Provides thorough code quality analysis
- **🔄 Refactor Code** - Suggests improvement and refactoring
- **💡 Explain Code** - Breaks down complex code logic

### 2. **Smart Context Integration**
- **Automatic Code Selection** - Templates automatically include selected code
- **Intelligent Prompting** - Prompts adapt based on your selection
- **Chat Integration** - Seamlessly injects prompts into Cursor's chat

### 3. **Customizable Hotkeys**
- Each template can have its own keyboard shortcut
- Default hotkeys follow VS Code conventions
- Fully customizable through settings

### 4. **Category Organization**
Templates are organized by category:
- **Development** - Code generation, refactoring, testing
- **Debugging** - Bug analysis, troubleshooting
- **Documentation** - Comments, docs, explanations
- **Learning** - Code explanation, tutorials
- **General** - Custom templates

## ⚙️ Settings & Customization

### Opening Settings
- Click the ⚡ flash icon → "⚙️ Power Tool Settings"
- Or use the VS Code command: "⚡ Power Tool Settings"
- Or use hotkey: `Cmd+Shift+,`

### Adding Custom Templates

1. **Open Power Tool Settings**
2. **Fill out the form:**
   - **Name**: Display name for your template
   - **Description**: Brief explanation of what it does
   - **Category**: Group it with similar templates
   - **Prompt**: The actual AI prompt text
   - **Hotkey**: Optional keyboard shortcut (e.g., `cmd+shift+x`)
   - **Icon**: Codicon class name for the menu icon

3. **Click "Add Template"**

### Template Examples

#### Custom Code Optimizer
```
Name: ⚡ Optimize Performance
Description: Analyze and optimize code for better performance
Category: development
Prompt: Analyze the selected code for performance bottlenecks and suggest specific optimizations. Consider memory usage, algorithmic complexity, and runtime efficiency.
Hotkey: cmd+shift+o
Icon: codicon-rocket
```

#### Architecture Review
```
Name: 🏗️ Architecture Review
Description: Review system architecture and design patterns
Category: development
Prompt: Review the selected code from an architectural perspective. Evaluate design patterns, SOLID principles, separation of concerns, and suggest improvements for maintainability and scalability.
Hotkey: cmd+shift+a
Icon: codicon-organization
```

#### Security Audit
```
Name: 🔒 Security Audit
Description: Check for security vulnerabilities
Category: debugging
Prompt: Perform a security audit of the selected code. Look for potential vulnerabilities including SQL injection, XSS, authentication issues, data validation problems, and suggest fixes.
Hotkey: cmd+shift+s
Icon: codicon-shield
```

## 🎨 UI Customization

The Power Tools interface is designed to match VS Code's theme and styling:

- **Adaptive Theming** - Automatically matches your VS Code theme
- **Responsive Design** - Works on different screen sizes
- **Keyboard Navigation** - Full keyboard accessibility
- **Visual Feedback** - Hover effects and state indicators

## 🔧 Advanced Usage

### Template Variables
Templates automatically include selected code when available:

```
Your prompt text here.

Code to analyze:
```
[selected code will be automatically appended]
```

### Workflow Chaining
You can create templates that work together:

1. Use "🐛 Bug Analysis" to identify issues
2. Follow up with "🔄 Refactor Code" for fixes
3. Finish with "🧪 Generate Tests" for validation

### Integration with Monaco Editor
Power Tools integrates with VS Code's Monaco editor:
- Automatically detects selected text
- Preserves syntax highlighting context
- Works with multiple selections

## 📋 Default Templates Reference

| Template | Hotkey | Purpose |
|----------|--------|---------|
| 🧪 Generate Tests | `Cmd+Shift+T` | Create unit tests with edge cases |
| 🐛 Bug Analysis | `Cmd+Shift+B` | Find bugs and security issues |
| 📚 Generate Docs | `Cmd+Shift+D` | Create JSDoc and documentation |
| 👀 Code Review | - | Quality and best practices review |
| 🔄 Refactor Code | - | Improvement suggestions |
| 💡 Explain Code | - | Detailed code explanation |

## 🛠️ Configuration Options

Power Tools stores settings in localStorage with these options:

```javascript
{
  preferences: {
    showHotkeys: true,        // Show hotkeys in menu
    groupByCategory: true,    // Group templates by category
    compactMode: false,       // Compact menu display
    autoFocusInput: true,     // Auto-focus chat input
    enableTTS: false,         // Text-to-speech (future)
    preferredModel: 'gpt-4',  // Default AI model
    maxTokens: 4000          // Token limit
  }
}
```

## 🔮 Future Roadmap

### Tier 2 Features (Coming Soon)
- **AI Commit Messages** - Generate commit messages from git diff
- **Built-in TTS** - Voice responses to complement ASR
- **Theme Switcher** - Quick theme switching
- **Prompt Chaining** - Link multiple templates together

### Tier 3 Features (Advanced)
- **Multi-LLM Support** - Switch between GPT, Claude, Mistral
- **Stack Overflow Integration** - Search and integrate solutions
- **Clipboard History** - Smart copy-paste with AI enhancement
- **Plugin System** - Load custom JavaScript modules

## 🐛 Troubleshooting

### Flash Icon Not Appearing
1. Ensure Dictator is enabled: Run "Enable Dictator" command
2. Restart VS Code/Cursor
3. Check browser console for errors

### Templates Not Working
1. Verify power-tools.js is loaded (check browser console)
2. Try refreshing Cursor interface
3. Check localStorage permissions

### Hotkeys Not Working
1. Ensure no conflicts with existing VS Code shortcuts
2. Try different key combinations
3. Check if focus is in chat interface

### Settings Not Saving
1. Check browser localStorage permissions
2. Try private/incognito mode to test
3. Clear localStorage and reconfigure

## 💡 Tips & Best Practices

1. **Start with Defaults** - Use built-in templates before creating custom ones
2. **Consistent Naming** - Use clear, descriptive names for templates
3. **Category Organization** - Group related templates together
4. **Test Hotkeys** - Ensure no conflicts with existing shortcuts
5. **Iterative Improvement** - Refine prompts based on AI responses
6. **Backup Settings** - Export/backup your custom templates

## 🤝 Contributing

Want to improve Power Tools? Here's how:

1. **Feature Requests** - Open an issue on GitHub
2. **Bug Reports** - Include console logs and reproduction steps
3. **Template Sharing** - Share useful templates with the community
4. **Code Contributions** - Submit PRs for new features

## 📚 Additional Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Codicon Icons Reference](https://microsoft.github.io/vscode-codicons/dist/codicon.html)
- [AI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)

---

**Happy Coding with Power Tools! ⚡**

> Power Tools transforms Cursor into a true AI-powered development environment. With customizable templates and intelligent workflows, you'll code faster and smarter than ever before. 