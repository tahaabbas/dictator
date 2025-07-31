/**
 * POWER TOOLS - Advanced Features for Cursor Chat Interface
 * Extends the Dictator voice recording plugin with developer-focused tools
 */

"use strict";

// Configuration and State Management - Uses new factory/custom structure
class PowerToolsConfig {
  constructor() {
    this.extensionName = 'dictator';
  }

  load() {
    return {
      templates: this.loadTemplates(),
      categories: this.loadCategories(),
      preferences: this.loadPreferences()
    };
  }

  loadPreferences() {
    try {
      return {
        showHotkeys: this.getSetting('powerTools.showHotkeys', true),
        groupByCategory: this.getSetting('powerTools.groupByCategory', true),
        compactMode: this.getSetting('powerTools.compactMode', false),
        autoFocusInput: this.getSetting('powerTools.autoFocusInput', true)
      };
    } catch (error) {
      return {
        showHotkeys: true,
        groupByCategory: true,
        compactMode: false,
        autoFocusInput: true
      };
    }
  }

  // Ensure backward compatibility for templates
  normalizeTemplate(template) {
    // If template already has emoji and displayName, return as is
    if (template.emoji && template.displayName) {
      return template;
    }

    // Extract emoji and displayName from combined name for backward compatibility
    const name = template.name || '';
    const match = name.match(/^([^\w\s]+)\s*(.*)$/);
    
    if (match) {
      return {
        ...template,
        emoji: match[1].trim(),
        displayName: match[2].trim() || 'Unnamed Template'
      };
    } else {
      // No emoji found, use default
      return {
        ...template,
        emoji: '🎯',
        displayName: name || 'Unnamed Template'
      };
    }
  }

  loadTemplates() {
    const templates = {};
    
    // Load factory templates
    const factoryTemplates = this.getSetting('powerTools.factoryTemplates', this.getDefaultFactoryTemplates());
    if (factoryTemplates && typeof factoryTemplates === 'object') {
      Object.values(factoryTemplates).forEach(template => {
        if (template.enabled !== false) {
          const normalizedTemplate = this.normalizeTemplate(template);
          templates[normalizedTemplate.id] = {
            ...normalizedTemplate,
            isFactory: true
          };
        }
      });
    }
    
    // Load custom templates
    const customTemplates = this.getSetting('powerTools.customTemplates', []);
    if (Array.isArray(customTemplates)) {
      customTemplates.forEach(template => {
        if (template.enabled !== false) {
          const normalizedTemplate = this.normalizeTemplate(template);
          templates[normalizedTemplate.id] = {
            ...normalizedTemplate,
            isFactory: false
          };
        }
      });
    }

    return templates;
  }

  loadCategories() {
    const categories = {};
    
    // Load factory categories
    const factoryCategories = this.getSetting('powerTools.factoryCategories', this.getDefaultFactoryCategories());
    console.log('[PowerTools] Loaded factory categories:', factoryCategories);
    if (factoryCategories && typeof factoryCategories === 'object') {
      Object.values(factoryCategories).forEach(category => {
        if (category.enabled !== false) {
          categories[category.id] = {
            ...category,
            isFactory: true
          };
        }
      });
    }
    
    // Load custom categories
    const customCategories = this.getSetting('powerTools.customCategories', []);
    console.log('[PowerTools] Loaded custom categories:', customCategories);
    if (Array.isArray(customCategories)) {
      customCategories.forEach(category => {
        if (category.enabled !== false) {
          categories[category.id] = {
            ...category,
            isFactory: false
          };
        }
      });
    }

    console.log('[PowerTools] Final loaded categories:', categories);
    console.log('[PowerTools] Category orders:', Object.values(categories).map(c => ({ id: c.id, name: c.name, order: c.order })));
    return categories;
  }

  getDefaultFactoryCategories() {
    return {
      development: {
        id: 'development',
        name: 'Development',
        emoji: '⚙️',
        description: 'Code development and programming tasks',
        color: '#007acc',
        order: 0,
        enabled: true,
        isFactory: true
      },
      debugging: {
        id: 'debugging',
        name: 'Debugging',
        emoji: '🐛',
        description: 'Bug analysis and troubleshooting',
        color: '#f14c4c',
        order: 1,
        enabled: true,
        isFactory: true
      },
      documentation: {
        id: 'documentation',
        name: 'Documentation',
        emoji: '📚',
        description: 'Documentation and API reference',
        color: '#22c55e',
        order: 2,
        enabled: true,
        isFactory: true
      },
      learning: {
        id: 'learning',
        name: 'Learning',
        emoji: '💡',
        description: 'Code explanation and learning',
        color: '#f59e0b',
        order: 3,
        enabled: true,
        isFactory: true
      },
      general: {
        id: 'general',
        name: 'General',
        emoji: '🔧',
        description: 'General purpose templates',
        color: '#6b7280',
        order: 4,
        enabled: true,
        isFactory: true
      }
    };
  }

  getDefaultFactoryTemplates() {
    return {
      testGeneration: {
        id: 'test-generation',
        name: '🧪 Generate Tests',
        description: 'Generate comprehensive unit tests',
        prompt: 'Generate comprehensive unit tests for the selected code. Include edge cases, error scenarios, and mock dependencies where appropriate. Use the same testing framework as the existing codebase.',
        category: 'development',
        hotkey: 'cmd+shift+t',
        icon: 'codicon-beaker',
        autoSend: false,
        order: 0,
        enabled: true,
        isFactory: true
      },
      bugAnalysis: {
        id: 'bug-analysis',
        name: '🐛 Bug Analysis',
        description: 'Analyze potential bugs and issues',
        prompt: 'Analyze the selected code for potential bugs, performance issues, and security vulnerabilities. Provide specific recommendations for fixes.',
        category: 'debugging',
        hotkey: 'cmd+shift+b',
        icon: 'codicon-bug',
        autoSend: false,
        order: 1,
        enabled: true,
        isFactory: true
      },
      documentation: {
        id: 'documentation',
        name: '📚 Generate Docs',
        description: 'Create comprehensive documentation',
        prompt: 'Generate comprehensive documentation for the selected code including JSDoc comments, usage examples, and API documentation.',
        category: 'documentation',
        hotkey: 'cmd+shift+d',
        icon: 'codicon-book',
        autoSend: false,
        order: 2,
        enabled: true,
        isFactory: true
      },
      codeReview: {
        id: 'code-review',
        name: '👀 Code Review',
        description: 'Perform detailed code review',
        prompt: 'Perform a thorough code review of the selected code. Check for code quality, best practices, performance, security, and maintainability issues.',
        category: 'development',
        hotkey: '',
        icon: 'codicon-eye',
        autoSend: false,
        order: 3,
        enabled: true,
        isFactory: true
      },
      refactor: {
        id: 'refactor',
        name: '🔄 Refactor Code',
        description: 'Suggest refactoring improvements',
        prompt: 'Suggest refactoring improvements for the selected code. Focus on readability, maintainability, performance, and following current best practices.',
        category: 'development',
        hotkey: '',
        icon: 'codicon-sync',
        autoSend: false,
        order: 4,
        enabled: true,
        isFactory: true
      },
      explainCode: {
        id: 'explain-code',
        name: '💡 Explain Code',
        description: 'Explain how the code works',
        prompt: 'Explain how this code works in detail. Break down the logic, describe the purpose of each section, and explain any complex algorithms or patterns used.',
        category: 'learning',
        hotkey: '',
        icon: 'codicon-lightbulb',
        autoSend: false,
        order: 5,
        enabled: true,
        isFactory: true
      }
    };
  }

  getSetting(key, defaultValue) {
    try {
      // First try the synced VS Code settings
      const vsCodeSettings = localStorage.getItem('dictator.powerTools.vsCodeSettings');
      if (vsCodeSettings) {
        try {
          const settings = JSON.parse(vsCodeSettings);
          if (settings[key] !== undefined) {
            return settings[key];
          }
        } catch (parseError) {
          console.warn('[PowerTools] Failed to parse VS Code settings:', parseError);
        }
      }
      
      // Fallback to individual localStorage entries
      const stored = localStorage.getItem(`dictator.${key}`);
      if (stored !== null) {
        try {
          // Try to parse as JSON first (for objects/arrays)
          return JSON.parse(stored);
        } catch (parseError) {
          // If JSON parsing fails, treat as string/boolean
          return key.includes('enabled') || key.includes('show') || key.includes('group') || key.includes('compact') || key.includes('auto') 
            ? stored === 'true' 
            : stored;
        }
      }
    } catch (error) {
      console.warn(`[PowerTools] Failed to load setting ${key}:`, error);
    }
    
    return defaultValue;
  }

  getTemplates() {
    return this.load().templates;
  }

  getPreferences() {
    return this.load().preferences;
  }
}

// Power Tools UI Manager
class PowerToolsUI {
  constructor() {
    this.config = new PowerToolsConfig();
    this.isInitialized = false;
    this.contextMenuId = 'power-tools-context-menu';
    this.currentChatInput = null;
    this.hotkeyHandlers = [];
  }

  initialize() {
    if (this.isInitialized) return;
    
    this.injectStyles();
    this.setupEventListeners(); // This now handles both initial creation and ongoing observation
    this.registerHotkeys();
    
    this.isInitialized = true;
    console.log('[PowerTools] UI initialized successfully');
  }

  injectStyles() {
    const styleId = 'power-tools-styles';
    if (document.getElementById(styleId)) return;

    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
      /* Flash Icon Styles */
      .power-tools-flash-btn {
        cursor: pointer;
        padding: 4px;
        border-radius: 10px;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        position: relative;
        color: #fbbf24;
        background: rgba(251, 191, 36, 0.1);
        margin-right: 2px;
      }

      .power-tools-flash-btn:hover {
        background: rgba(251, 191, 36, 0.2);
        color: #f59e0b;
        transform: scale(1.05);
      }

      .power-tools-flash-btn.loading {
        color: #06b6d4;
        background: rgba(6, 182, 212, 0.1);
      }

      @keyframes flash-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .power-tools-flash-btn.active {
        animation: flash-pulse 1s infinite;
      }

      /* Context Menu Styles - Compact and Professional */
      .power-tools-context-menu {
        position: absolute;
        z-index: 10000;
        background-color: var(--vscode-menu-background, #252526);
        border: 1px solid var(--vscode-menu-border, #3c3c3c);
        color: var(--vscode-menu-foreground, #cccccc);
        min-width: 240px;
        max-width: 280px;
        max-height: 350px;
        overflow-y: auto;
        overflow-x: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        padding: 2px 0;
        border-radius: 3px;
        font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif);
        font-size: 12px;
      }

      .power-tools-menu-header {
        padding: 6px 7px 9px 6px;
        font-weight: 500;
        font-size: 11px;
        color: var(--vscode-descriptionForeground, #cccccc99);
        text-transform: uppercase;
        letter-spacing: 0.3px;
        border-bottom: 1px solid #525252;
        margin-bottom: 4px;
        pointer-events: none;
      }

      .power-tools-menu-category {
        font-weight: 500;
        font-size: 10px;
        color: var(--vscode-descriptionForeground, #888);
        text-transform: uppercase;
        letter-spacing: 0.2px;
        margin-top: 6px;
        margin-bottom: 1px;
        pointer-events: none;
        background-color: #1b1b1bde;
        padding: 5px 8px;
      }

      .power-tools-menu-item {
        padding: 6px 12px;
        cursor: pointer;
        white-space: nowrap;
        transition: background-color 0.1s ease;
        position: relative;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
      }

      .power-tools-menu-item:hover {
        background-color: var(--vscode-menu-selectionBackground, #04395e);
        color: var(--vscode-menu-selectionForeground, #ffffff);
      }

      .power-tools-menu-item-icon {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--vscode-icon-foreground, #cccccc);
        flex-shrink: 0;
        display: none;
      }

      .power-tools-menu-item-content {
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }

      .power-tools-menu-item-title {
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .power-tools-menu-item-description {
        font-size: 11px;
        color: var(--vscode-descriptionForeground, #cccccc99);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 2px;
      }

      .power-tools-menu-item-hotkey {
        font-size: 10px;
        color: var(--vscode-descriptionForeground, #888);
        background: var(--vscode-badge-background, #4d4d4d);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: monospace;
        flex-shrink: 0;
        display: none;
      }

      .power-tools-menu-separator {
        height: 1px;
        background-color: var(--vscode-menu-separatorBackground, #454545);
        margin: 8px 0;
      }



      /* Settings Button */
      .power-tools-settings-item {
        border-top: 1px solid #525252;
        margin-top: 8px;
        padding-top: 2px;
      }

      .power-tools-settings-item .power-tools-menu-item {
        opacity: 0.9;
      }



      /* Scrollbar Styles - Exact match with dictator.js */
      .power-tools-context-menu::-webkit-scrollbar {
        width: 6px;
      }

      .power-tools-context-menu::-webkit-scrollbar-track {
        background: var(--vscode-menu-background, #252526);
        border-radius: 3px;
      }

      .power-tools-context-menu::-webkit-scrollbar-thumb {
        background-color: var(--vscode-scrollbarSlider-background, #4d4d4d);
        border-radius: 3px;
        border: 1px solid var(--vscode-menu-background, #252526);
      }

      .power-tools-context-menu::-webkit-scrollbar-thumb:hover {
        background-color: var(--vscode-scrollbarSlider-hoverBackground, #6b6b6b);
      }

      /* Firefox scrollbar styling */
      .power-tools-context-menu {
        scrollbar-width: thin;
        scrollbar-color: var(--vscode-scrollbarSlider-background, #4d4d4d)
          var(--vscode-menu-background, #252526);
      }
    `;
    
    document.head.appendChild(styles);
  }



  initPowerToolsForBox(box) {
    // Skip if already initialized
    if (box.dataset.powerToolsInit) return;
    box.dataset.powerToolsInit = "1";
    
    // Find button area and chat input (same as dictator.js)
    const area = box.querySelector('.button-container.composer-button-area');
    const chatInputContentEditable = box.querySelector('.aislash-editor-input[contenteditable="true"]');
    
    if (!area || !chatInputContentEditable) {
      console.warn('[PowerTools] Could not find button area or chat input for', box);
      return;
    }
    
    // Check if flash icon already exists
    if (area.querySelector('.power-tools-flash-btn')) return;
    
    const flashBtn = document.createElement('div');
    flashBtn.className = 'power-tools-flash-btn';
    flashBtn.setAttribute('title', 'Power Tools');
    flashBtn.innerHTML = '<span class="codicon codicon-zap !text-[12px]"></span>';
    
    // Insert before the mic button (same pattern as dictator.js)
    const micBtn = area.querySelector('.mic-btn');
    if (micBtn) {
      area.insertBefore(flashBtn, micBtn);
    } else {
      area.prepend(flashBtn);
    }
    
    // Add event listeners
    flashBtn.addEventListener('click', (e) => this.handleFlashClick(e, chatInputContentEditable));
    flashBtn.addEventListener('contextmenu', (e) => this.handleFlashClick(e, chatInputContentEditable));
    
    console.log('[PowerTools] Flash icon added to input box');
  }

  handleFlashClick(event, chatInputContentEditable) {
    event.preventDefault();
    event.stopPropagation();
    
    // Store the chat input for this flash button instance
    this.currentChatInput = chatInputContentEditable;
    
    this.removeExistingContextMenu();
    this.createContextMenu(event.target.closest('.power-tools-flash-btn'));
  }

  removeExistingContextMenu() {
    const existingMenu = document.getElementById(this.contextMenuId);
    if (existingMenu) {
      existingMenu.remove();
    }
    document.removeEventListener('click', this.handleOutsideClick, true);
  }

  handleOutsideClick = (event) => {
    const menu = document.getElementById(this.contextMenuId);
    if (menu && !menu.contains(event.target)) {
      this.removeExistingContextMenu();
    }
  }

  createContextMenu(targetElement) {
    const config = this.config.load();
    const templates = config.templates;
    const preferences = config.preferences;
    
    const menu = document.createElement('div');
    menu.id = this.contextMenuId;
    menu.className = 'power-tools-context-menu';
    
    // Header
    const header = document.createElement('div');
    header.className = 'power-tools-menu-header';
    header.innerHTML = `⚡ Power Tools`;
    menu.appendChild(header);
    
    // Get structured menu items with proper category ordering
    const menuItems = this.createContextMenuWithCategories(templates, preferences);
    
    menuItems.forEach(item => {
      if (item.type === 'category-header') {
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'power-tools-menu-category';
        categoryHeader.innerHTML = `
          <span style="color: ${item.category.color};">${item.category.emoji}</span>
          ${item.category.name}
        `;
        menu.appendChild(categoryHeader);
        
      } else if (item.type === 'template') {
        const template = item.template;
        const menuItem = document.createElement('div');
        menuItem.className = 'power-tools-menu-item';
        menuItem.dataset.templateId = template.id;
        
        menuItem.innerHTML = `
          <div class="power-tools-menu-item-icon">
            <span class="codicon ${template.icon || 'codicon-symbol-method'}"></span>
          </div>
          <div class="power-tools-menu-item-content">
            <div class="power-tools-menu-item-title">${template.emoji || ''} ${template.displayName || template.name}</div>
            <div class="power-tools-menu-item-description">${template.description}</div>
          </div>
          ${template.hotkey && preferences.showHotkeys ? 
            `<div class="power-tools-menu-item-hotkey">${template.hotkey}</div>` : ''}
        `;
        
        menuItem.addEventListener('click', (e) => this.executeTemplate(template));
        menu.appendChild(menuItem);
      }
    });
    
    // Settings item
    const settingsItem = document.createElement('div');
    settingsItem.className = 'power-tools-settings-item';
    settingsItem.innerHTML = `
      <div class="power-tools-menu-item">
        <div class="power-tools-menu-item-icon">
          <span class="codicon codicon-settings-gear"></span>
        </div>
        <div class="power-tools-menu-item-content">
          <div class="power-tools-menu-item-title">⚙️ Open Settings</div>
          <div class="power-tools-menu-item-description">Configure templates and preferences</div>
        </div>
      </div>
    `;
    
    settingsItem.addEventListener('click', () => {
      this.removeExistingContextMenu();
      this.openVSCodeSettings();
    });
    
    menu.appendChild(settingsItem);
    
    // Position and show menu
    this.positionContextMenu(menu, targetElement);
    document.body.appendChild(menu);
    
    // Setup outside click handler
    setTimeout(() => {
      document.addEventListener('click', this.handleOutsideClick, true);
    }, 0);
  }

  groupTemplatesByCategory(templates) {
    const grouped = {};
    Object.values(templates).forEach(template => {
      const category = template.category || 'general';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(template);
    });
    
    // Sort templates within each category by order first, then by name
    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 9999;
        const orderB = b.order !== undefined ? b.order : 9999;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return (a.displayName || a.name).localeCompare(b.displayName || b.name);
      });
    });
    
    return grouped;
  }

  createContextMenuWithCategories(templates, preferences) {
    const config = this.config.load();
    const categories = config.categories;
    
    // Group templates by category
    const groupedTemplates = this.groupTemplatesByCategory(templates);
    
    // Sort categories by their order
    const sortedCategoryIds = Object.keys(categories).sort((a, b) => {
      const catA = categories[a];
      const catB = categories[b];
      const orderA = catA?.order !== undefined ? catA.order : 9999;
      const orderB = catB?.order !== undefined ? catB.order : 9999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return (catA?.name || a).localeCompare(catB?.name || b);
    });

    console.log('[PowerTools] Category order for context menu:', sortedCategoryIds.map(id => ({ 
      id, 
      name: categories[id]?.name, 
      order: categories[id]?.order 
    })));

    const menuItems = [];

    sortedCategoryIds.forEach(categoryId => {
      const category = categories[categoryId];
      const categoryTemplates = groupedTemplates[categoryId] || [];
      
      if (!category) return;

      // Skip empty categories in context menu - they should only show in template manager
      if (categoryTemplates.length === 0) {
        console.log(`[PowerTools] Skipping empty category ${categoryId} from context menu`);
        return;
      }

      // Add category header if grouping is enabled and there are multiple categories with templates
      const categoriesWithTemplates = sortedCategoryIds.filter(id => {
        const templates = groupedTemplates[id] || [];
        return templates.length > 0;
      });
      
      if (preferences.groupByCategory && categoriesWithTemplates.length > 1) {
        menuItems.push({
          type: 'category-header',
          category: category,
          text: category.name
        });
      }

      // Add templates in this category
      categoryTemplates.forEach(template => {
        menuItems.push({
          type: 'template',
          template: template,
          category: category
        });
      });
    });

    return menuItems;
  }

  positionContextMenu(menu, targetElement) {
    // Temporarily make menu invisible to measure dimensions
    menu.style.visibility = 'hidden';
    menu.style.position = 'absolute';
    menu.style.top = '-10000px';
    menu.style.left = '-10000px';
    
    document.body.appendChild(menu);
    
    const menuRect = menu.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate position
    let top = targetRect.bottom + 8;
    let left = targetRect.left + (targetRect.width / 2) - (menuRect.width / 2);
    
    // Adjust if menu would go off screen
    if (left + menuRect.width > viewportWidth - 16) {
      left = viewportWidth - menuRect.width - 16;
    }
    if (left < 16) {
      left = 16;
    }
    
    if (top + menuRect.height > viewportHeight - 16) {
      top = targetRect.top - menuRect.height - 8;
    }
    
    // Apply position and make visible
    menu.style.top = `${top + window.scrollY}px`;
    menu.style.left = `${left + window.scrollX}px`;
    menu.style.visibility = 'visible';
  }

  executeTemplate(template) {
    this.removeExistingContextMenu();
    
    // Get selected text or current context
    const selectedText = this.getSelectedText();
    const chatInput = this.findChatInput();
    
    if (!chatInput) {
      console.warn('[PowerTools] Could not find chat input');
      return;
    }
    
    // Build the prompt
    let finalPrompt = template.prompt;
    
    if (selectedText) {
      finalPrompt += `\n\nCode to analyze:\n\`\`\`\n${selectedText}\n\`\`\``;
    }
    
    // Insert into chat input
    this.insertTextIntoChat(chatInput, finalPrompt);
    
    // Focus chat input
    chatInput.focus();
    
    // Auto-send if enabled
    if (template.autoSend) {
      setTimeout(() => {
        this.triggerSendButton();
      }, 100); // Small delay to ensure text is properly inserted
    }
    
    console.log(`[PowerTools] Executed template: ${template.name}${template.autoSend ? ' (auto-sent)' : ''}`);
  }

  getSelectedText() {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      return selection.toString().trim();
    }
    
    // Try to get text from active editor
    // This would need integration with Monaco editor
    return '';
  }

  findChatInput() {
    // Use the stored chat input from the specific flash button that was clicked
    return this.currentChatInput || document.querySelector('.aislash-editor-input[contenteditable="true"]');
  }

  insertTextIntoChat(chatInput, text) {
    // Use the exact same method as dictator.js updateReactInput
    if (text === "") {
      return;
    }
    
    chatInput.focus();
    
    // Always replace existing content for power tools templates
    if (chatInput.textContent === text) {
      return;
    }
    
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(chatInput);
    selection?.removeAllRanges();
    selection?.addRange(range);
    document.execCommand('insertText', false, text);
    
    // Trigger input event (same as dictator.js)
    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    chatInput.dispatchEvent(inputEvent);
  }

  triggerSendButton() {
    try {
      // Find the send button using the provided selector
      const composerButtons = document.querySelector('div.composer-bar-input-buttons > div.button-container');
      if (!composerButtons) {
        console.warn('[PowerTools] Could not find composer button container');
        return false;
      }
      
      // Get all anysphere-icon-button elements and find the last one (send button)
      const iconButtons = composerButtons.querySelectorAll('div.anysphere-icon-button');
      const sendButton = iconButtons[iconButtons.length - 1];
      
      if (!sendButton) {
        console.warn('[PowerTools] Could not find send button');
        return false;
      }
      
      // Check if the button contains the arrow-up-two icon (send button indicator)
      const sendIcon = sendButton.querySelector('span.codicon-arrow-up-two');
      if (!sendIcon) {
        console.warn('[PowerTools] Send button icon not found, may not be the correct button');
        // Still try to click it in case the icon class changed
      }
      
      // Trigger the click event
      sendButton.click();
      console.log('[PowerTools] Send button clicked successfully');
      return true;
      
    } catch (error) {
      console.error('[PowerTools] Error triggering send button:', error);
      return false;
    }
  }

  setupEventListeners() {
    // Setup MutationObserver (same pattern as dictator.js setupMicButtonObserver)
    const observer = new MutationObserver((records) => {
      records.forEach((r) => {
        r.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) {
            // Check if the node itself is a full-input-box
            if (n.matches('.full-input-box')) {
              this.initPowerToolsForBox(n);
            }
            // Check for full-input-box children
            n.querySelectorAll('.full-input-box').forEach((el) => {
              if (!el.querySelector('.power-tools-flash-btn')) {
                this.initPowerToolsForBox(el);
              }
            });
          }
        });
      });
    });
    
    observer.observe(document.documentElement, { childList: true, subtree: true });
    
    // Initialize existing input boxes on startup
    document.querySelectorAll('.full-input-box').forEach((el) => {
      if (!el.querySelector('.power-tools-flash-btn')) {
        this.initPowerToolsForBox(el);
      }
    });
  }

  registerHotkeys() {
    // Clear existing hotkey handlers if any
    if (this.hotkeyHandlers) {
      this.hotkeyHandlers.forEach(handler => {
        document.removeEventListener('keydown', handler, { capture: true });
      });
    }
    this.hotkeyHandlers = [];
    
    const config = this.config.load();
    const templates = config.templates;
    
    Object.values(templates).forEach(template => {
      if (template.hotkey) {
        const handler = this.createHotkeyHandler(template.hotkey, () => this.executeTemplate(template));
        this.hotkeyHandlers.push(handler);
        document.addEventListener('keydown', handler, { capture: true });
      }
    });
    
    // Register settings hotkey
    const settingsHandler = this.createHotkeyHandler('cmd+shift+,', () => this.openVSCodeSettings());
    this.hotkeyHandlers.push(settingsHandler);
    document.addEventListener('keydown', settingsHandler, { capture: true });
  }

  createHotkeyHandler(key, callback) {
    const keys = key.split('+').map(k => k.trim().toLowerCase());
    const mainKey = keys[keys.length - 1];
    const modifiers = {
      ctrl: keys.includes('ctrl') || keys.includes('control'),
      alt: keys.includes('alt'),
      shift: keys.includes('shift'),
      meta: keys.includes('meta') || keys.includes('command') || keys.includes('cmd')
    };
    
    return (event) => {
      const keyMatch = event.key.toLowerCase() === mainKey.toLowerCase();
      const ctrlMatch = event.ctrlKey === modifiers.ctrl;
      const altMatch = event.altKey === modifiers.alt;
      const shiftMatch = event.shiftKey === modifiers.shift;
      const metaMatch = event.metaKey === modifiers.meta;
      
      if (keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch) {
        event.preventDefault();
        event.stopPropagation();
        callback(event);
      }
    };
  }

  openVSCodeSettings() {
    console.log('[PowerTools] Opening Power Tools settings interface');
    
    // Remove existing context menu first
    this.removeExistingContextMenu();
    
    // Open the proper UI interface
    this.openSettingsModal();
  }

  openSettingsModal() {
    // Remove existing modal if present
    const existingModal = document.getElementById('power-tools-settings-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const config = this.config.load();
    const templates = config.templates;
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.id = 'power-tools-settings-modal';
    modal.className = 'power-tools-modal-overlay';
    
    modal.innerHTML = `
      <div class="power-tools-modal">
        <div class="power-tools-modal-header">
          <h2>⚡ Power Tools Settings</h2>
          <button class="power-tools-close-btn" title="Close">
            <span class="codicon codicon-close"></span>
          </button>
        </div>
        <div class="power-tools-modal-content">
          <div class="power-tools-tabs">
            <button class="power-tools-tab active" data-tab="templates">Templates</button>
            <button class="power-tools-tab" data-tab="categories">Categories</button>
            <button class="power-tools-tab" data-tab="preferences">Preferences</button>
          </div>
          
          <div class="power-tools-tab-content" id="templates-tab">
            <div class="templates-section">
              <div class="section-header">
                <h3>Template Management</h3>
                <div class="template-actions">
                  <button class="power-tools-btn primary" id="add-template-btn">
                    <span class="codicon codicon-add"></span> Add Template
                  </button>
                  <button class="power-tools-btn secondary" id="restore-defaults-btn">
                    <span class="codicon codicon-refresh"></span> Restore Defaults
                  </button>
                </div>
              </div>
              <div class="templates-list-container">
                <div class="templates-list" id="templates-list">
                  <!-- Templates will be populated here -->
                </div>
              </div>
            </div>
          </div>
          
          <div class="power-tools-tab-content" id="categories-tab" style="display: none;">
            <div class="categories-section">
              <div class="section-header">
                <h3>Category Management</h3>
                <div class="template-actions">
                  <button class="power-tools-btn primary" id="add-category-btn">
                    <span class="codicon codicon-add"></span> Add Category
                  </button>
                  <button class="power-tools-btn secondary" id="restore-category-defaults-btn">
                    <span class="codicon codicon-refresh"></span> Restore Defaults
                  </button>
                </div>
              </div>
              <div class="categories-list-container">
                <div class="categories-list" id="categories-list">
                  <!-- Categories will be populated here -->
                </div>
              </div>
            </div>
          </div>
          
          <div class="power-tools-tab-content" id="preferences-tab" style="display: none;">
            <div class="preferences-section">
              <h3>General Preferences</h3>
              <div class="preference-item">
                <label>
                  <input type="checkbox" id="show-hotkeys" ${config.preferences.showHotkeys ? 'checked' : ''}>
                  Show keyboard shortcuts in context menu
                </label>
              </div>
              <div class="preference-item">
                <label>
                  <input type="checkbox" id="group-by-category" ${config.preferences.groupByCategory ? 'checked' : ''}>
                  Group templates by category
                </label>
              </div>
              <div class="preference-item">
                <label>
                  <input type="checkbox" id="compact-mode" ${config.preferences.compactMode ? 'checked' : ''}>
                  Use compact display mode
                </label>
              </div>
              <div class="preference-item">
                <label>
                  <input type="checkbox" id="auto-focus-input" ${config.preferences.autoFocusInput ? 'checked' : ''}>
                  Auto-focus chat input after template execution
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal styles
    this.addModalStyles();
    
    // Add to document
    document.body.appendChild(modal);
    
    // Populate templates and categories
    this.populateTemplatesList(templates);
    this.populateCategoriesList(config.categories);
    
    // Setup event listeners
    this.setupModalEventListeners(modal, config);
  }

  addModalStyles() {
    if (document.getElementById('power-tools-modal-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'power-tools-modal-styles';
    styles.textContent = `
      .power-tools-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .power-tools-modal {
        background: var(--vscode-editor-background, #1e1e1e);
        border: 1px solid var(--vscode-panel-border, #3c3c3c);
        border-radius: 8px;
        width: 90%;
        max-width: 900px;
        max-height: 90vh;
        overflow: hidden;
        box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5);
        font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif);
        font-size: var(--vscode-font-size, 13px);
      }

      .power-tools-modal-header {
        padding: 16px 20px;
        border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--vscode-titleBar-activeBackground, #252526);
      }

      .power-tools-modal-header h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--vscode-titleBar-activeForeground, #cccccc);
      }

      .power-tools-close-btn {
        background: none;
        border: none;
        color: var(--vscode-icon-foreground, #cccccc);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.15s ease;
      }

      .power-tools-close-btn:hover {
        background: var(--vscode-toolbar-hoverBackground, #373737);
      }

      .power-tools-modal-content {
        height: calc(90vh - 80px);
        overflow: visible;
        display: flex;
        flex-direction: column;
      }

      .power-tools-tabs {
        display: flex;
        border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
        background: var(--vscode-editorGroupHeader-tabsBackground, #2d2d30);
      }

      .power-tools-tab {
        background: none;
        border: none;
        padding: 12px 20px;
        color: var(--vscode-tab-inactiveForeground, #969696);
        cursor: pointer;
        font-size: 13px;
        transition: all 0.15s ease;
        border-bottom: 2px solid transparent;
      }

      .power-tools-tab:hover {
        color: var(--vscode-tab-activeForeground, #ffffff);
        background: var(--vscode-tab-hoverBackground, #1e1e1e);
      }

      .power-tools-tab.active {
        color: var(--vscode-tab-activeForeground, #ffffff);
        background: var(--vscode-tab-activeBackground, #1e1e1e);
        border-bottom-color: var(--vscode-focusBorder, #007acc);
      }

      .power-tools-tab-content {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: calc(90vh - 129px);
      }

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .section-header h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--vscode-editor-foreground, #cccccc);
      }

      .template-actions {
        display: flex;
        gap: 8px;
      }

      .templates-section,
      .categories-section {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .templates-list-container,
      .categories-list-container {
        flex: 1;
        overflow: hidden;
        margin-top: 10px;
        position: relative;
        border: 1px solid var(--vscode-widget-border, #454545);
        border-radius: 4px;
        background: var(--vscode-editor-background, #1e1e1e);
      }
      .power-tools-tab-content h3 {
        color: #ffffff;
      }
      .preferences-section :nth-child(4).preference-item {
        display: none;
      }
       
      .power-tools-btn {
        background:  #0099cc;
        color: #ffffff;
        border: none;
        padding: 6px 12px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: background 0.1s ease;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .power-tools-btn:hover {
        background:  #0099cc;
        color: #ffffff;
        opacity: 0.8;
      }

      .power-tools-btn.secondary {
        background: var(--vscode-button-secondaryBackground, #3c3c3c);
        color: var(--vscode-button-secondaryForeground, #cccccc);
      }

      .power-tools-btn.secondary:hover {
        background: var(--vscode-button-secondaryHoverBackground, #454545);
      }

      .templates-list,
      .categories-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 8px;
      }

      .template-item {
        background: var(--vscode-editorWidget-background, #252526);
        border: 1px solid var(--vscode-widget-border, #454545);
        border-radius: 4px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: border-color 0.1s ease;
      }

      .template-item:hover {
        border-color: var(--vscode-focusBorder, #007acc);
      }

      .template-item:last-child {
        margin-bottom: 17px;
      }

      .template-item[draggable="true"] {
        cursor: grab;
      }

      .template-item.dragging {
        opacity: 0.5;
        cursor: grabbing;
        transform: rotate(2deg);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      }

      .template-item.drag-over {
        border-color: var(--vscode-focusBorder, #007acc);
        background: var(--vscode-list-hoverBackground, #2a2d2e);
        transform: translateY(-2px);
      }

      .template-drag-handle {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--vscode-descriptionForeground, #888);
        cursor: grab;
        opacity: 0.6;
        transition: opacity 0.2s ease;
        margin-right: 8px;
        flex-shrink: 0;
      }

      .template-drag-handle:hover {
        opacity: 1;
        color: var(--vscode-foreground, #cccccc);
      }

      .template-item:hover .template-drag-handle {
        opacity: 1;
      }

      .drag-placeholder {
        height: 2px;
        background: var(--vscode-focusBorder, #007acc);
        margin: 4px 0;
        border-radius: 1px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .drag-placeholder.active {
        opacity: 1;
      }

      .template-icon {
        font-size: 16px;
        color: var(--vscode-descriptionForeground, #cccccc99);
        width: 20px;
        text-align: center;
        flex-shrink: 0;
      }

      .template-info {
        flex: 1;
      }

      .template-name {
        font-size: 13px;
        font-weight: 500;
        color: var(--vscode-editor-foreground, #cccccc);
        margin-bottom: 2px;
        line-height: 1.3;
      }

      .template-description {
        font-size: 11px;
        color: var(--vscode-descriptionForeground, #cccccc99);
        margin-bottom: 2px;
        line-height: 1.2;
      }

      .template-meta {
        font-size: 11px;
        color: var(--vscode-descriptionForeground, #888);
        display: flex;
        gap: 12px;
      }

      .auto-send-indicator {
        color: #fbbf24 !important;
        font-weight: 600 !important;
        background: rgba(251, 191, 36, 0.1);
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px !important;
      }

      /* Category Item Styles */
      .category-item {
        background: var(--vscode-editorWidget-background, #252526);
        border: 1px solid var(--vscode-widget-border, #454545);
        border-radius: 4px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        transition: border-color 0.1s ease;
        position: relative;
      }

      /* Template Category Group Styles */
      .template-category-group {
        margin-bottom: 20px;
      }

      .template-category-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--vscode-titleBar-activeBackground, #252526);
        border: 1px solid var(--vscode-widget-border, #454545);
        border-radius: 4px;
        margin-bottom: 8px;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .template-category-icon {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        border-radius: 3px;
        flex-shrink: 0;
      }

      .template-category-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--vscode-editor-foreground, #cccccc);
        flex: 1;
      }

      .template-category-count {
        font-size: 11px;
        color: var(--vscode-descriptionForeground, #888);
        background: var(--vscode-badge-background, #4d4d4d);
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 16px;
        text-align: center;
      }

      .template-category-templates {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-left: 8px;
        border-left: 2px solid transparent;
        transition: border-color 0.2s ease;
        min-height: 40px;
        position: relative;
      }

      .template-category-templates.drag-over-category {
        border-left-color: var(--vscode-focusBorder, #007acc);
        background: rgba(0, 122, 204, 0.05);
      }

      .template-category-templates.empty {
        padding: 16px;
        text-align: center;
        color: var(--vscode-descriptionForeground, #888);
        font-style: italic;
        border: 1px dashed var(--vscode-widget-border, #454545);
        border-radius: 4px;
      }

      .template-category-templates.empty::after {
        content: "Drop templates here";
        font-size: 11px;
      }

      .category-item:hover {
        border-color: var(--vscode-focusBorder, #007acc);
      }

      .category-item:last-child {
        margin-bottom: 17px;
      }

      .category-item[draggable="true"] {
        cursor: grab;
      }

      .category-item.dragging {
        opacity: 0.5;
        cursor: grabbing;
        transform: rotate(1deg);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      }

      .category-item.drag-over {
        border-color: var(--vscode-focusBorder, #007acc);
        background: var(--vscode-list-hoverBackground, #2a2d2e);
        transform: translateY(-2px);
      }

      .category-drag-handle {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--vscode-descriptionForeground, #888);
        cursor: grab;
        opacity: 0.6;
        transition: opacity 0.2s ease;
        margin-right: 8px;
        flex-shrink: 0;
      }

      .category-drag-handle:hover {
        opacity: 1;
        color: var(--vscode-foreground, #cccccc);
      }

      .category-item:hover .category-drag-handle {
        opacity: 1;
      }

      .category-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;
        border-radius: 4px;
        position: relative;
      }

      .category-info {
        flex: 1;
      }

      .category-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--vscode-editor-foreground, #cccccc);
        margin-bottom: 2px;
        line-height: 1.3;
      }

      .category-description {
        font-size: 11px;
        color: var(--vscode-descriptionForeground, #cccccc99);
        line-height: 1.2;
      }

      .category-badge {
        background: #134103;
        color: #ffffff;
        padding: 6px 14px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .category-badge.factory {
        background-color: transparent;
        color: #ffffff;
      }

      .category-actions-btns {
        display: flex;
        gap: 4px;
      }

      .template-actions-btns {
        display: flex;
        gap: 4px;
      }

      .template-action-btn {
        background-color: #b0360d;
        border: 1px solid #5f0f0f;
        color: #ffffff;
        padding: 5px 8px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 10px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 3px;
        transition: all 0.1s ease;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .template-action-btn:hover {
        background-color: #b0360d;
        border-color: #5f0f0f;
        opacity: 0.8;
      }

      .template-action-btn.delete {
        background-color: #8b1538;
        border-color: #8b1538;
      }

      .template-action-btn.delete:hover {
        background-color: #a91e47;
        border-color: #a91e47;
        opacity: 0.8;
      }

      .template-badge {
        background: #134103;
        color: #ffffff;
        padding: 6px 14px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .template-badge.factory {
        background-color: transparent;
        color: #ffffff;
      }

      .preference-item {
        margin-bottom: 16px;
      }

      .preference-item label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--vscode-editor-foreground, #cccccc);
        cursor: pointer;
        font-size: 13px;
      }

      .preference-item input[type="checkbox"] {
        width: 16px;
        height: 16px;
      }

      /* Modal Scrollbar Styles */
      .power-tools-tab-content::-webkit-scrollbar,
      .templates-list::-webkit-scrollbar,
      .categories-list::-webkit-scrollbar {
        width: 8px;
      }

      .power-tools-tab-content::-webkit-scrollbar-track,
      .templates-list::-webkit-scrollbar-track,
      .categories-list::-webkit-scrollbar-track {
        background: var(--vscode-editor-background, #1e1e1e);
        border-radius: 4px;
      }

      .power-tools-tab-content::-webkit-scrollbar-thumb,
      .templates-list::-webkit-scrollbar-thumb,
      .categories-list::-webkit-scrollbar-thumb {
        background-color: var(--vscode-scrollbarSlider-background, #4d4d4d);
        border-radius: 4px;
        border: 1px solid var(--vscode-editor-background, #1e1e1e);
      }

      .power-tools-tab-content::-webkit-scrollbar-thumb:hover,
      .templates-list::-webkit-scrollbar-thumb:hover,
      .categories-list::-webkit-scrollbar-thumb:hover {
        background-color: var(--vscode-scrollbarSlider-hoverBackground, #6b6b6b);
      }

      .power-tools-tab-content::-webkit-scrollbar-thumb:active,
      .templates-list::-webkit-scrollbar-thumb:active,
      .categories-list::-webkit-scrollbar-thumb:active {
        background-color: var(--vscode-scrollbarSlider-activeBackground, #888888);
      }

      /* Firefox scrollbar styling for modal */
      .power-tools-tab-content,
      .templates-list,
      .categories-list {
        scrollbar-width: thin;
        scrollbar-color: var(--vscode-scrollbarSlider-background, #4d4d4d)
          var(--vscode-editor-background, #1e1e1e);
      }
    `;
    
    document.head.appendChild(styles);
  }

  populateTemplatesList(templates) {
    const listContainer = document.getElementById('templates-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    const config = this.config.load();
    const categories = config.categories;
    
    console.log('[PowerTools] Populating templates list with categories:', Object.keys(categories));
    
    // Group templates by category and sort categories by order
    const groupedTemplates = this.groupTemplatesByCategory(templates);
    const sortedCategories = Object.keys(categories).sort((a, b) => {
      const catA = categories[a];
      const catB = categories[b];
      const orderA = catA?.order !== undefined ? catA.order : 9999;
      const orderB = catB?.order !== undefined ? catB.order : 9999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return (catA?.name || a).localeCompare(catB?.name || b);
    });
    
    console.log('[PowerTools] Category order for template manager:', sortedCategories.map(id => ({ 
      id, 
      name: categories[id]?.name, 
      order: categories[id]?.order 
    })));
    
    // Render each category section
    sortedCategories.forEach(categoryId => {
      const category = categories[categoryId];
      const categoryTemplates = groupedTemplates[categoryId] || [];
      
      if (!category) return;
      
      // Create category group container
      const categoryGroup = document.createElement('div');
      categoryGroup.className = 'template-category-group';
      categoryGroup.dataset.categoryId = categoryId;
      
      // Create category header
      const categoryHeader = document.createElement('div');
      categoryHeader.className = 'template-category-header';
      categoryHeader.innerHTML = `
        <div class="template-category-icon" style="background-color: ${category.color}20; color: ${category.color};">
          ${category.emoji}
        </div>
        <div class="template-category-name">${category.name}</div>
        <div class="template-category-count">${categoryTemplates.length}</div>
      `;
      
      // Create templates container
      const templatesContainer = document.createElement('div');
      templatesContainer.className = `template-category-templates ${categoryTemplates.length === 0 ? 'empty' : ''}`;
      templatesContainer.dataset.categoryId = categoryId;
      
      // Add templates to the container
      categoryTemplates.forEach((template, index) => {
        const item = document.createElement('div');
        item.className = 'template-item';
        item.draggable = true;
        item.dataset.templateId = template.id;
        item.dataset.categoryId = categoryId;
        item.dataset.index = index;
        
        const actionsHtml = template.isFactory 
          ? `<button class="template-action-btn" data-action="edit" data-template-id="${template.id}">
               <span class="codicon codicon-edit"></span> Edit
             </button>`
          : `<button class="template-action-btn" data-action="edit" data-template-id="${template.id}">
               <span class="codicon codicon-edit"></span> Edit
             </button>
             <button class="template-action-btn delete" data-action="delete" data-template-id="${template.id}">
               <span class="codicon codicon-trash"></span> Delete
             </button>`;
        
        item.innerHTML = `
          <div class="template-drag-handle" title="Drag to reorder or move between categories">
            <span class="codicon codicon-gripper"></span>
          </div>
          <div class="template-icon">
            <span class="codicon ${template.icon || 'codicon-symbol-method'}"></span>
          </div>
          <div class="template-info">
            <div class="template-name">${template.emoji || ''} ${template.displayName || template.name}</div>
            <div class="template-description">${template.description}</div>
            <div class="template-meta">
              <span>Category: ${category.name}</span>
              ${template.hotkey ? `<span>Hotkey: ${template.hotkey}</span>` : ''}
              ${template.autoSend ? `<span class="auto-send-indicator">⚡ Auto-Send</span>` : ''}
            </div>
          </div>
          <div class="template-badge ${template.isFactory ? 'factory' : ''}">${template.isFactory ? 'Factory' : 'Custom'}</div>
          <div class="template-actions-btns">
            ${actionsHtml}
          </div>
        `;
        
        templatesContainer.appendChild(item);
      });
      
      // Assemble category group
      categoryGroup.appendChild(categoryHeader);
      categoryGroup.appendChild(templatesContainer);
      listContainer.appendChild(categoryGroup);
    });
    
    // Setup enhanced drag and drop event listeners
    this.setupEnhancedDragAndDrop(listContainer);
  }

  populateCategoriesList(categories) {
    const listContainer = document.getElementById('categories-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    // Sort categories by order (if available), then by name
    const sortedCategories = Object.values(categories).sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 9999;
      const orderB = b.order !== undefined ? b.order : 9999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name);
    });
    
    sortedCategories.forEach((category, index) => {
      const item = document.createElement('div');
      item.className = 'category-item';
      item.draggable = true;
      item.dataset.categoryId = category.id;
      item.dataset.index = index;
      
      const actionsHtml = category.isFactory 
        ? `<button class="template-action-btn" data-action="edit" data-category-id="${category.id}">
             <span class="codicon codicon-edit"></span> Edit
           </button>`
        : `<button class="template-action-btn" data-action="edit" data-category-id="${category.id}">
             <span class="codicon codicon-edit"></span> Edit
           </button>
           <button class="template-action-btn delete" data-action="delete" data-category-id="${category.id}">
             <span class="codicon codicon-trash"></span> Delete
           </button>`;
      
      item.innerHTML = `
        <div class="category-drag-handle" title="Drag to reorder">
          <span class="codicon codicon-gripper"></span>
        </div>
        <div class="category-icon" style="background-color: ${category.color}20; color: ${category.color};">
          ${category.emoji}
        </div>
        <div class="category-info">
          <div class="category-name">${category.emoji} ${category.name}</div>
          <div class="category-description">${category.description}</div>
        </div>
        <div class="category-badge ${category.isFactory ? 'factory' : ''}">${category.isFactory ? 'Factory' : 'Custom'}</div>
        <div class="category-actions-btns">
          ${actionsHtml}
        </div>
      `;
      
      listContainer.appendChild(item);
    });
    
    // Setup drag and drop event listeners for categories
    this.setupCategoryDragAndDrop(listContainer);
  }

  setupEnhancedDragAndDrop(listContainer) {
    let draggedElement = null;
    let draggedOverElement = null;
    let draggedOverCategory = null;

    listContainer.addEventListener('dragstart', (e) => {
      const templateItem = e.target.closest('.template-item');
      if (!templateItem) return;
      
      draggedElement = templateItem;
      templateItem.classList.add('dragging');
      
      // Set drag data
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', templateItem.outerHTML);
      e.dataTransfer.setData('text/plain', templateItem.dataset.templateId);
      
      console.log('[PowerTools] Drag started for template:', templateItem.dataset.templateId);
    });

    listContainer.addEventListener('dragend', (e) => {
      const templateItem = e.target.closest('.template-item');
      if (templateItem) {
        templateItem.classList.remove('dragging');
      }
      
      // Clean up drag over effects
      listContainer.querySelectorAll('.template-item').forEach(item => {
        item.classList.remove('drag-over');
      });
      listContainer.querySelectorAll('.template-category-templates').forEach(container => {
        container.classList.remove('drag-over-category');
      });
      
      console.log('[PowerTools] Drag ended, cleaning up');
      
      draggedElement = null;
      draggedOverElement = null;
      draggedOverCategory = null;
    });

    listContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      // Check if dragging over a template item
      const targetItem = e.target.closest('.template-item');
      const targetCategoryContainer = e.target.closest('.template-category-templates');
      
      // Clear previous effects
      listContainer.querySelectorAll('.template-item').forEach(item => {
        item.classList.remove('drag-over');
      });
      listContainer.querySelectorAll('.template-category-templates').forEach(container => {
        container.classList.remove('drag-over-category');
      });
      
      if (targetItem && targetItem !== draggedElement) {
        // Dragging over a specific template
        targetItem.classList.add('drag-over');
        draggedOverElement = targetItem;
        draggedOverCategory = null;
      } else if (targetCategoryContainer && !targetItem) {
        // Dragging over empty category space
        targetCategoryContainer.classList.add('drag-over-category');
        draggedOverElement = null;
        draggedOverCategory = targetCategoryContainer;
      }
    });

    listContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      
      if (!draggedElement) return;
      
      const draggedTemplateId = draggedElement.dataset.templateId;
      const draggedCategoryId = draggedElement.dataset.categoryId;
      
      if (draggedOverElement && draggedOverElement !== draggedElement) {
        // Dropping on another template - reorder within category or move between categories
        const targetCategoryId = draggedOverElement.dataset.categoryId;
        const targetContainer = draggedOverElement.closest('.template-category-templates');
        
        // Get templates in target category
        const categoryItems = Array.from(targetContainer.querySelectorAll('.template-item'));
        const targetIndex = categoryItems.indexOf(draggedOverElement);
        
        // Remove from current position
        draggedElement.remove();
        
        // Insert at new position
        if (targetIndex === categoryItems.length - 1) {
          targetContainer.appendChild(draggedElement);
        } else {
          targetContainer.insertBefore(draggedElement, draggedOverElement);
        }
        
        // Update category if different
        if (draggedCategoryId !== targetCategoryId) {
          this.moveTemplateToCategory(draggedTemplateId, targetCategoryId);
        }
        
        this.saveTemplateOrder();
        
      } else if (draggedOverCategory) {
        // Dropping on empty category space
        const targetCategoryId = draggedOverCategory.dataset.categoryId;
        
        // Remove from current position
        draggedElement.remove();
        
        // Add to new category
        draggedOverCategory.appendChild(draggedElement);
        draggedOverCategory.classList.remove('empty');
        
        // Update category if different
        if (draggedCategoryId !== targetCategoryId) {
          this.moveTemplateToCategory(draggedTemplateId, targetCategoryId);
        }
        
        this.saveTemplateOrder();
      }
      
      // Refresh the display to update category counts and empty states
      setTimeout(() => {
        const config = this.config.load();
        this.populateTemplatesList(config.templates);
      }, 100);
    });

    listContainer.addEventListener('dragleave', (e) => {
      const targetItem = e.target.closest('.template-item');
      const targetContainer = e.target.closest('.template-category-templates');
      
      if (targetItem) {
        targetItem.classList.remove('drag-over');
      }
      if (targetContainer && !listContainer.contains(e.relatedTarget)) {
        targetContainer.classList.remove('drag-over-category');
      }
    });
  }

  moveTemplateToCategory(templateId, newCategoryId) {
    try {
      const config = this.config.load();
      const template = config.templates[templateId];
      
      if (!template) {
        console.warn('[PowerTools] Template not found:', templateId);
        return;
      }
      
      console.log(`[PowerTools] Moving template "${template.name}" from "${template.category}" to "${newCategoryId}"`);
      
      // Update template category
      template.category = newCategoryId;
      
      // Save to appropriate storage
      if (template.isFactory) {
        const factoryTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.factoryTemplates') || '{}');
        const factoryKey = Object.keys(factoryTemplates).find(key => factoryTemplates[key].id === templateId);
        if (factoryKey) {
          factoryTemplates[factoryKey].category = newCategoryId;
          localStorage.setItem('dictator.powerTools.factoryTemplates', JSON.stringify(factoryTemplates));
        }
      } else {
        const customTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.customTemplates') || '[]');
        const customIndex = customTemplates.findIndex(t => t.id === templateId);
        if (customIndex >= 0) {
          customTemplates[customIndex].category = newCategoryId;
          localStorage.setItem('dictator.powerTools.customTemplates', JSON.stringify(customTemplates));
        }
      }
      
      // Update DOM data attributes
      const templateElement = document.querySelector(`[data-template-id="${templateId}"]`);
      if (templateElement) {
        templateElement.dataset.categoryId = newCategoryId;
      }
      
      console.log('[PowerTools] Template category updated successfully');
      
    } catch (error) {
      console.error('[PowerTools] Failed to move template to category:', error);
    }
  }

  saveTemplateOrder() {
    const listContainer = document.getElementById('templates-list');
    if (!listContainer) return;
    
    console.log('[PowerTools] Saving template order...');
    
    // Get all category groups and process templates within each category
    const categoryGroups = Array.from(listContainer.querySelectorAll('.template-category-group'));
    const config = this.config.load();
    const templates = config.templates;
    
    let globalOrder = 0;
    
    categoryGroups.forEach(categoryGroup => {
      const categoryId = categoryGroup.dataset.categoryId;
      const categoryTemplates = Array.from(categoryGroup.querySelectorAll('.template-item'));
      
      console.log(`[PowerTools] Processing category ${categoryId} with ${categoryTemplates.length} templates`);
      
      categoryTemplates.forEach((item, categoryIndex) => {
        const templateId = item.dataset.templateId;
        const template = templates[templateId];
        if (template) {
          template.order = globalOrder++;
          
          console.log(`[PowerTools] Setting template ${templateId} order to ${template.order}`);
          
          // Save to appropriate storage
          if (template.isFactory) {
            const factoryTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.factoryTemplates') || '{}');
            const factoryKey = Object.keys(factoryTemplates).find(key => factoryTemplates[key].id === templateId);
            if (factoryKey) {
              factoryTemplates[factoryKey].order = template.order;
              localStorage.setItem('dictator.powerTools.factoryTemplates', JSON.stringify(factoryTemplates));
            }
          } else {
            const customTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.customTemplates') || '[]');
            const customIndex = customTemplates.findIndex(t => t.id === templateId);
            if (customIndex >= 0) {
              customTemplates[customIndex].order = template.order;
              localStorage.setItem('dictator.powerTools.customTemplates', JSON.stringify(customTemplates));
            }
          }
        }
      });
    });
    
    console.log('[PowerTools] Template order saved');
    
    // Refresh context menu order
    this.registerHotkeys();
  }

  setupCategoryDragAndDrop(listContainer) {
    let draggedElement = null;
    let draggedOverElement = null;

    listContainer.addEventListener('dragstart', (e) => {
      if (!e.target.classList.contains('category-item')) return;
      
      draggedElement = e.target;
      e.target.classList.add('dragging');
      
      // Set drag data
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.target.outerHTML);
      e.dataTransfer.setData('text/plain', e.target.dataset.categoryId);
    });

    listContainer.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('category-item')) {
        e.target.classList.remove('dragging');
      }
      
      // Clean up drag over effects
      listContainer.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('drag-over');
      });
      
      draggedElement = null;
      draggedOverElement = null;
    });

    listContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      const targetItem = e.target.closest('.category-item');
      if (!targetItem || targetItem === draggedElement) return;
      
      // Remove previous drag-over effects
      listContainer.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('drag-over');
      });
      
      // Add drag-over effect to current target
      targetItem.classList.add('drag-over');
      draggedOverElement = targetItem;
    });

    listContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      
      if (!draggedElement || !draggedOverElement || draggedElement === draggedOverElement) {
        return;
      }
      
      // Get all category items
      const items = Array.from(listContainer.querySelectorAll('.category-item'));
      const draggedIndex = items.indexOf(draggedElement);
      const targetIndex = items.indexOf(draggedOverElement);
      
      // Reorder in DOM
      if (draggedIndex < targetIndex) {
        draggedOverElement.parentNode.insertBefore(draggedElement, draggedOverElement.nextSibling);
      } else {
        draggedOverElement.parentNode.insertBefore(draggedElement, draggedOverElement);
      }
      
      // Save new order
      this.saveCategoryOrder();
      
      console.log('[PowerTools] Category order updated');
    });

    listContainer.addEventListener('dragleave', (e) => {
      const targetItem = e.target.closest('.category-item');
      if (targetItem) {
        targetItem.classList.remove('drag-over');
      }
    });
  }

  saveCategoryOrder() {
    const listContainer = document.getElementById('categories-list');
    if (!listContainer) return;
    
    console.log('[PowerTools] Saving category order...');
    
    const items = Array.from(listContainer.querySelectorAll('.category-item'));
    const config = this.config.load();
    const categories = config.categories;
    
    console.log('[PowerTools] Categories to reorder:', Object.keys(categories));
    
    // Update order for all categories
    items.forEach((item, index) => {
      const categoryId = item.dataset.categoryId;
      const category = categories[categoryId];
      if (category) {
        console.log(`[PowerTools] Setting category ${categoryId} order to ${index} (was ${category.order})`);
        category.order = index;
        
        // Save to appropriate storage
        if (category.isFactory) {
          let factoryCategories = JSON.parse(localStorage.getItem('dictator.powerTools.factoryCategories') || '{}');
          
          // If no factory categories saved yet, initialize with defaults
          if (Object.keys(factoryCategories).length === 0) {
            factoryCategories = this.config.getDefaultFactoryCategories();
          }
          
          // Update the specific category
          if (factoryCategories[categoryId]) {
            factoryCategories[categoryId].order = index;
            localStorage.setItem('dictator.powerTools.factoryCategories', JSON.stringify(factoryCategories));
            console.log(`[PowerTools] Saved factory category ${categoryId} with order ${index}`);
          }
        } else {
          const customCategories = JSON.parse(localStorage.getItem('dictator.powerTools.customCategories') || '[]');
          const customIndex = customCategories.findIndex(c => c.id === categoryId);
          if (customIndex >= 0) {
            customCategories[customIndex].order = index;
            localStorage.setItem('dictator.powerTools.customCategories', JSON.stringify(customCategories));
            console.log(`[PowerTools] Saved custom category ${categoryId} with order ${index}`);
          }
        }
      }
    });
    
    // Refresh context menu order and templates list
    this.registerHotkeys();
    
    // Also refresh templates list to show updated category order
    const updatedConfig = this.config.load();
    this.populateTemplatesList(updatedConfig.templates);
  }

  setupModalEventListeners(modal, config) {
    // Close button
    const closeBtn = modal.querySelector('.power-tools-close-btn');
    closeBtn?.addEventListener('click', () => modal.remove());
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    // ESC key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    // Tab switching
    const tabs = modal.querySelectorAll('.power-tools-tab');
    const tabContents = modal.querySelectorAll('.power-tools-tab-content');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.style.display = 'none');
        
        tab.classList.add('active');
        const targetTab = tab.dataset.tab;
        const targetContent = modal.querySelector(`#${targetTab}-tab`);
        if (targetContent) targetContent.style.display = 'block';
      });
    });
    
    // Add template button
    const addBtn = modal.querySelector('#add-template-btn');
    addBtn?.addEventListener('click', () => this.showAddTemplateDialog(modal));
    
    // Restore defaults button
    const restoreBtn = modal.querySelector('#restore-defaults-btn');
    restoreBtn?.addEventListener('click', () => this.showRestoreDefaultsDialog(modal));
    
    // Add category button
    const addCategoryBtn = modal.querySelector('#add-category-btn');
    addCategoryBtn?.addEventListener('click', () => this.showAddCategoryDialog(modal));
    
    // Restore category defaults button
    const restoreCategoryBtn = modal.querySelector('#restore-category-defaults-btn');
    restoreCategoryBtn?.addEventListener('click', () => this.showRestoreCategoryDefaultsDialog(modal));
    
    // Template and Category action buttons
    modal.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('.template-action-btn');
      if (!actionBtn) return;
      
      const action = actionBtn.dataset.action;
      const templateId = actionBtn.dataset.templateId;
      const categoryId = actionBtn.dataset.categoryId;
      
      if (templateId) {
        // Template actions
        if (action === 'edit') {
          this.showEditTemplateDialog(modal, templateId);
        } else if (action === 'delete') {
          this.showDeleteTemplateDialog(modal, templateId);
        }
      } else if (categoryId) {
        // Category actions
        if (action === 'edit') {
          this.showEditCategoryDialog(modal, categoryId);
        } else if (action === 'delete') {
          this.showDeleteCategoryDialog(modal, categoryId);
        }
      }
    });
    
    console.log('[PowerTools] Modal event listeners setup complete');
  }

  showAddTemplateDialog(modal) {
    this.showTemplateForm(modal, null, 'Add New Template');
  }

  showEditTemplateDialog(modal, templateId) {
    const config = this.config.load();
    const template = config.templates[templateId];
    if (!template) return;
    
    this.showTemplateForm(modal, template, 'Edit Template');
  }

  showTemplateForm(parentModal, template, title) {
    // Create form overlay
    const formOverlay = document.createElement('div');
    formOverlay.className = 'power-tools-form-overlay';
    
    const isEdit = template !== null;
    const isFactory = template?.isFactory || false;
    
    console.log('[PowerTools] Creating template form with autoSend:', template?.autoSend);
    
    formOverlay.innerHTML = `
      <div class="power-tools-form">
        <div class="power-tools-form-header">
          <h3>${title}</h3>
          <button class="power-tools-close-btn" type="button">
            <span class="codicon codicon-close"></span>
          </button>
        </div>
        <div class="power-tools-form-content">
          <div class="form-row">
            <div class="form-group" style="flex: 0 0 73px;">
              <label for="template-emoji">Icon</label>
              <div class="emoji-picker-container">
                <button type="button" class="emoji-picker-btn" id="emoji-picker-btn">
                  <span class="selected-emoji">${template?.emoji || '🎯'}</span>
                  <span class="codicon codicon-chevron-down"></span>
                </button>
                <div class="emoji-picker-dropdown" id="emoji-picker-dropdown">
                  <div class="emoji-grid">
                    <!-- Emojis will be populated here -->
                  </div>
                </div>
              </div>
              <input type="hidden" id="template-emoji" value="${template?.emoji || '🎯'}">
            </div>
            <div class="form-group" style="flex: 1;">
              <label for="template-name">Template Name</label>
              <input type="text" id="template-name" value="${template?.displayName || template?.name?.replace(/^[^\w\s]+\s*/, '') || ''}" placeholder="e.g., My Awesome Template" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="template-category">Category</label>
              <select id="template-category">
                ${this.generateCategoryOptions(template?.category)}
              </select>
            </div>
            
            <div class="form-group" style="display: none;">
              <label for="template-hotkey">Hotkey (Optional)</label>
              <input type="text" id="template-hotkey" value="${template?.hotkey || ''}" placeholder="e.g., cmd+shift+x">
            </div>
          </div>
          
          <div class="form-group">
            <label for="template-description">Description</label>
            <input type="text" id="template-description" value="${template?.description || ''}" placeholder="Brief description of what this template does" required>
          </div>
          
          <div class="form-group">
            <label for="template-prompt">AI Prompt</label>
            <textarea id="template-prompt" rows="4" placeholder="The prompt that will be sent to the AI" required>${template?.prompt || ''}</textarea>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="template-auto-send" ${template?.autoSend ? 'checked' : ''}>
              <span class="checkbox-text">Send command immediately after injection</span>
            </label>
            <div class="form-help-text">When enabled, the template will be automatically sent to the AI without requiring manual submission</div>
          </div>
          
          <div class="form-group" style="display: none;">
            <label for="template-icon">Icon (Optional)</label>
            <input type="text" id="template-icon" value="${template?.icon || 'codicon-symbol-method'}" placeholder="e.g., codicon-gear">
          </div>
        </div>
        <div class="power-tools-form-footer">
          <button type="button" class="power-tools-btn secondary" id="cancel-form">Cancel</button>
          <button type="button" class="power-tools-btn primary" id="save-template">${isEdit ? 'Update' : 'Create'} Template</button>
        </div>
      </div>
    `;

    // Add form styles if not already added
    this.addFormStyles();
    
    // Add to document
    document.body.appendChild(formOverlay);
    
    // Debug: Verify checkbox exists
    setTimeout(() => {
      const checkbox = formOverlay.querySelector('#template-auto-send');
      console.log('[PowerTools] Auto-send checkbox found:', !!checkbox, checkbox);
    }, 100);
    
    // Focus first input
    setTimeout(() => {
      const firstInput = formOverlay.querySelector('#template-name');
      if (firstInput) firstInput.focus();
    }, 100);
    
    // Setup form event listeners
    this.setupFormEventListeners(formOverlay, parentModal, template, isEdit);
  }

  generateCategoryOptions(selectedCategory) {
    const config = this.config.load();
    const categories = config.categories;
    
    // Sort categories by order
    const sortedCategories = Object.values(categories).sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 9999;
      const orderB = b.order !== undefined ? b.order : 9999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name);
    });
    
    return sortedCategories.map(category => {
      const isSelected = selectedCategory === category.id ? 'selected' : '';
      return `<option value="${category.id}" ${isSelected}>${category.emoji} ${category.name}</option>`;
    }).join('');
  }

  addFormStyles() {
    if (document.getElementById('power-tools-form-styles')) {
      console.log('[PowerTools] Form styles already exist');
      return;
    }
    
    console.log('[PowerTools] Adding form styles including checkbox styles');
    const styles = document.createElement('style');
    styles.id = 'power-tools-form-styles';
    styles.textContent = `
      .power-tools-form-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .power-tools-form {
        background: var(--vscode-editor-background, #1e1e1e);
        border: 1px solid var(--vscode-panel-border, #3c3c3c);
        border-radius: 8px;
        width: 500px;
        max-width: 90vw;
        max-height: 90vh;
        overflow: hidden;
        box-shadow: 0 16px 64px rgba(0, 0, 0, 0.6);
        font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif);
      }

      .power-tools-form-header {
        padding: 16px 20px;
        border-bottom: 1px solid var(--vscode-panel-border, #3c3c3c);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--vscode-titleBar-activeBackground, #252526);
      }

      .power-tools-form-header h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: var(--vscode-titleBar-activeForeground, #cccccc);
      }

      .power-tools-form-content {
        padding: 20px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-row {
        display: flex;
        gap: 12px;
      }

      .form-row .form-group {
        flex: 1;
      }

      .form-group label {
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        font-weight: 500;
        color: var(--vscode-foreground, #cccccc);
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        width: 100%;
        padding: 8px 12px;
        background: var(--vscode-input-background, #3c3c3c);
        border: 1px solid var(--vscode-input-border, #3c3c3c);
        border-radius: 4px;
        color: var(--vscode-input-foreground, #cccccc);
        font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif);
        font-size: 13px;
        box-sizing: border-box;
      }

      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: var(--vscode-focusBorder, #007acc);
        box-shadow: 0 0 0 1px var(--vscode-focusBorder, #007acc);
      }

      .form-group textarea {
        resize: vertical;
        min-height: 80px;
      }

      .checkbox-label {
        display: flex !important;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        margin-bottom: 0 !important;
      }

      .checkbox-label input[type="checkbox"] {
        width: 16px !important;
        height: 16px !important;
        margin: 0 !important;
        cursor: pointer;
      }

      .checkbox-text {
        font-size: 13px;
        color: var(--vscode-foreground, #cccccc);
        font-weight: 500;
      }

      .form-help-text {
        font-size: 11px;
        color: var(--vscode-descriptionForeground, #cccccc99);
        margin-top: 4px;
        line-height: 1.3;
      }

      .color-picker-container {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .color-picker-container input[type="color"] {
        width: 40px !important;
        height: 32px !important;
        border: 1px solid var(--vscode-input-border, #3c3c3c);
        border-radius: 4px;
        cursor: pointer;
        padding: 0;
        background: none;
      }

      .color-picker-container input[type="text"] {
        flex: 1;
        font-family: monospace;
        text-transform: uppercase;
      }

      .power-tools-form-footer {
        padding: 16px 20px;
        border-top: 1px solid var(--vscode-panel-border, #3c3c3c);
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        background: var(--vscode-editor-background, #1e1e1e);
      }

      /* Emoji Picker Styles */
      .emoji-picker-container {
        position: relative;
      }
      #power-tools-settings-modal select option {
        background-color: #3c3c3c;
        color: #ffffff;
      }

      .emoji-picker-btn {
        width: 100%;
        padding: 6px 12px;
        background: var(--vscode-input-background, #3c3c3c);
        border: 1px solid var(--vscode-input-border, #3c3c3c);
        border-radius: 4px;
        color: var(--vscode-input-foreground, #cccccc);
        font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif);
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        transition: border-color 0.15s ease;
      }

      .emoji-picker-btn:hover {
        border-color: var(--vscode-inputOption-hoverBackground, #5a5a5a);
      }

      .emoji-picker-btn:focus {
        outline: none;
        border-color: var(--vscode-focusBorder, #007acc);
        box-shadow: 0 0 0 1px var(--vscode-focusBorder, #007acc);
      }

      .selected-emoji {
        font-size: 16px;
      }

      .emoji-picker-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--vscode-dropdown-background, #3c3c3c);
        border: 1px solid var(--vscode-dropdown-border, #454545);
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        display: none;
        max-height: 193px;
        overflow-y: auto;
        margin-top: 2px;
        width: 350px;
      }

      .emoji-picker-dropdown.show {
        display: block;
      }

      .emoji-grid {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        gap: 2px;
        padding: 8px;
      }

      .emoji-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 16px;
        transition: background-color 0.15s ease;
      }

      .emoji-item:hover {
        background: var(--vscode-list-hoverBackground, #2a2d2e);
      }

      .emoji-item.selected {
        background: var(--vscode-list-activeSelectionBackground, #094771);
      }
    `;
    
    document.head.appendChild(styles);
  }

  setupFormEventListeners(formOverlay, parentModal, template, isEdit) {
    // Emoji list with 80+ emojis
    const emojis = [
      '🎯', '🚀', '⚙️', '🔧', '🐛', '📚', '💡', '🔍', '💻', '🎨',
      '🛠️', '⭐', '🔥', '💬', '📝', '🧪', '🏗️', '📊', '🎭', '🎁',
      '🏃', '⚡', '🌟', '🎪', '🎲', '🎵', '📱', '🖥️', '⌚', '📷',
      '🎮', '🕹️', '📺', '📻', '☎️', '📞', '📠', '💾', '💿', '📀',
      '🖱️', '⌨️', '🖨️', '🖊️', '✏️', '📏', '📐', '✂️', '🔒', '🔓',
      '🔑', '🗝️', '🔨', '⛏️', '🪓', '🔩', '⚗️', '🧬', '🔬', '🔭',
      '📡', '💉', '🩹', '🩺', '💊', '🧪', '🧫', '🧪', '🔬', '⚗️',
      '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷',
      '🎺', '🎸', '🪕', '🎻', '🎯', '🏹', '🎣', '🥊', '🥋', '🎾'
    ];

    // Populate emoji grid
    const emojiGrid = formOverlay.querySelector('.emoji-grid');
    if (emojiGrid) {
      emojiGrid.innerHTML = '';
      emojis.forEach(emoji => {
        const emojiItem = document.createElement('div');
        emojiItem.className = 'emoji-item';
        emojiItem.textContent = emoji;
        emojiItem.title = emoji;
        
        // Mark as selected if it's the current emoji
        const currentEmoji = formOverlay.querySelector('#template-emoji').value;
        if (emoji === currentEmoji) {
          emojiItem.classList.add('selected');
        }
        
        // Add click handler
        emojiItem.addEventListener('click', () => {
          // Update selected emoji
          formOverlay.querySelector('#template-emoji').value = emoji;
          formOverlay.querySelector('.selected-emoji').textContent = emoji;
          
          // Update selected state
          emojiGrid.querySelectorAll('.emoji-item').forEach(item => item.classList.remove('selected'));
          emojiItem.classList.add('selected');
          
          // Close dropdown
          formOverlay.querySelector('#emoji-picker-dropdown').classList.remove('show');
        });
        
        emojiGrid.appendChild(emojiItem);
      });
    }

    // Emoji picker dropdown toggle
    const emojiPickerBtn = formOverlay.querySelector('#emoji-picker-btn');
    const emojiDropdown = formOverlay.querySelector('#emoji-picker-dropdown');
    
    if (emojiPickerBtn && emojiDropdown) {
      emojiPickerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        emojiDropdown.classList.toggle('show');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!emojiPickerBtn.contains(e.target) && !emojiDropdown.contains(e.target)) {
          emojiDropdown.classList.remove('show');
        }
      });
    }

    // Close button
    const closeBtn = formOverlay.querySelector('.power-tools-close-btn');
    const cancelBtn = formOverlay.querySelector('#cancel-form');
    
    const closeForm = () => formOverlay.remove();
    
    closeBtn?.addEventListener('click', closeForm);
    cancelBtn?.addEventListener('click', closeForm);
    
    // Click outside to close
    formOverlay.addEventListener('click', (e) => {
      if (e.target === formOverlay) closeForm();
    });
    
    // ESC key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeForm();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    // Save button
    const saveBtn = formOverlay.querySelector('#save-template');
    saveBtn?.addEventListener('click', () => {
      this.saveTemplateFromForm(formOverlay, parentModal, template, isEdit);
    });
    
    // Enter key to save (except in textarea)
    formOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.saveTemplateFromForm(formOverlay, parentModal, template, isEdit);
      }
    });
  }

  saveTemplateFromForm(formOverlay, parentModal, existingTemplate, isEdit) {
    // Get form values
    const emoji = formOverlay.querySelector('#template-emoji').value;
    const displayName = formOverlay.querySelector('#template-name').value.trim();
    const name = emoji + ' ' + displayName; // Combined for backward compatibility
    const description = formOverlay.querySelector('#template-description').value.trim();
    const prompt = formOverlay.querySelector('#template-prompt').value.trim();
    const category = formOverlay.querySelector('#template-category').value;
    const hotkey = formOverlay.querySelector('#template-hotkey').value.trim();
    const icon = formOverlay.querySelector('#template-icon').value.trim() || 'codicon-symbol-method';
    const autoSend = formOverlay.querySelector('#template-auto-send').checked;
    
    console.log('[PowerTools] Saving template with autoSend:', autoSend);
    
    // Validation
    if (!displayName) {
      alert('Template name is required!');
      formOverlay.querySelector('#template-name').focus();
      return;
    }
    
    if (!description) {
      alert('Template description is required!');
      formOverlay.querySelector('#template-description').focus();
      return;
    }
    
    if (!prompt) {
      alert('AI prompt is required!');
      formOverlay.querySelector('#template-prompt').focus();
      return;
    }
    
    try {
      if (isEdit) {
        // Update existing template
        const updatedTemplate = {
          ...existingTemplate,
          name,
          emoji,
          displayName,
          description,
          prompt,
          category,
          hotkey,
          icon,
          autoSend
        };
        
        if (existingTemplate.isFactory) {
          // Update factory template
          const factoryTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.factoryTemplates') || '{}');
          const factoryKey = Object.keys(factoryTemplates).find(key => factoryTemplates[key].id === existingTemplate.id);
          if (factoryKey) {
            factoryTemplates[factoryKey] = updatedTemplate;
            localStorage.setItem('dictator.powerTools.factoryTemplates', JSON.stringify(factoryTemplates));
          }
        } else {
          // Update custom template
          const customTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.customTemplates') || '[]');
          const index = customTemplates.findIndex(t => t.id === existingTemplate.id);
          if (index >= 0) {
            customTemplates[index] = updatedTemplate;
            localStorage.setItem('dictator.powerTools.customTemplates', JSON.stringify(customTemplates));
          }
        }
        
        console.log('[PowerTools] Template updated:', updatedTemplate.name);
      } else {
        // Create new template
        const id = displayName.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-').substring(0, 30) + '-' + Date.now();
        
        // Get the next order index
        const customTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.customTemplates') || '[]');
        const factoryTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.factoryTemplates') || '{}');
        const allTemplates = [...customTemplates, ...Object.values(factoryTemplates)];
        const maxOrder = allTemplates.reduce((max, t) => Math.max(max, t.order || 0), 0);
        
        const newTemplate = {
          id,
          name,
          emoji,
          displayName,
          description,
          prompt,
          category,
          hotkey,
          icon,
          autoSend,
          order: maxOrder + 1,
          enabled: true,
          isFactory: false
        };
        
        const existingCustomTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.customTemplates') || '[]');
        existingCustomTemplates.push(newTemplate);
        localStorage.setItem('dictator.powerTools.customTemplates', JSON.stringify(existingCustomTemplates));
        
        console.log('[PowerTools] Template added:', newTemplate.name);
      }
      
      // Refresh the templates list
      const config = this.config.load();
      this.populateTemplatesList(config.templates);
      this.registerHotkeys();
      
      // Close form
      formOverlay.remove();
      
    } catch (error) {
      console.error('[PowerTools] Failed to save template:', error);
      alert('Failed to save template: ' + error.message);
    }
  }

  savePreferences(modal) {
    try {
      const showHotkeys = modal.querySelector('#show-hotkeys')?.checked || false;
      const groupByCategory = modal.querySelector('#group-by-category')?.checked || false;
      const compactMode = modal.querySelector('#compact-mode')?.checked || false;
      const autoFocusInput = modal.querySelector('#auto-focus-input')?.checked || false;
      
      // Save to localStorage
      localStorage.setItem('dictator.powerTools.showHotkeys', JSON.stringify(showHotkeys));
      localStorage.setItem('dictator.powerTools.groupByCategory', JSON.stringify(groupByCategory));
      localStorage.setItem('dictator.powerTools.compactMode', JSON.stringify(compactMode));
      localStorage.setItem('dictator.powerTools.autoFocusInput', JSON.stringify(autoFocusInput));
      
      console.log('[PowerTools] Preferences saved:', { showHotkeys, groupByCategory, compactMode, autoFocusInput });
    } catch (error) {
      console.error('[PowerTools] Failed to save preferences:', error);
    }
  }

  showDeleteTemplateDialog(modal, templateId) {
    const config = this.config.load();
    const template = config.templates[templateId];
    if (!template || template.isFactory) return;

    if (confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      try {
        const customTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.customTemplates') || '[]');
        const filteredTemplates = customTemplates.filter(t => t.id !== templateId);
        localStorage.setItem('dictator.powerTools.customTemplates', JSON.stringify(filteredTemplates));
        
        // Refresh the templates list
        const newConfig = this.config.load();
        this.populateTemplatesList(newConfig.templates);
        this.registerHotkeys();
        
        console.log('[PowerTools] Template deleted:', template.name);
      } catch (error) {
        console.error('[PowerTools] Failed to delete template:', error);
        alert('Failed to delete template: ' + error.message);
      }
    }
  }

  showRestoreDefaultsDialog(modal) {
    if (confirm('Are you sure you want to restore all Power Tools settings to factory defaults? This will reset all templates and preferences.')) {
      try {
        // Clear all custom settings
        localStorage.removeItem('dictator.powerTools.factoryTemplates');
        localStorage.removeItem('dictator.powerTools.customTemplates');
        localStorage.removeItem('dictator.powerTools.showHotkeys');
        localStorage.removeItem('dictator.powerTools.groupByCategory');
        localStorage.removeItem('dictator.powerTools.compactMode');
        localStorage.removeItem('dictator.powerTools.autoFocusInput');
        
        // Refresh everything
        const config = this.config.load();
        this.populateTemplatesList(config.templates);
        this.registerHotkeys();
        
        // Update preferences checkboxes
        const showHotkeys = modal.querySelector('#show-hotkeys');
        const groupByCategory = modal.querySelector('#group-by-category');
        const compactMode = modal.querySelector('#compact-mode');
        const autoFocusInput = modal.querySelector('#auto-focus-input');
        
        if (showHotkeys) showHotkeys.checked = config.preferences.showHotkeys;
        if (groupByCategory) groupByCategory.checked = config.preferences.groupByCategory;
        if (compactMode) compactMode.checked = config.preferences.compactMode;
        if (autoFocusInput) autoFocusInput.checked = config.preferences.autoFocusInput;
        
        console.log('[PowerTools] Settings restored to defaults');
        alert('Settings restored to factory defaults!');
      } catch (error) {
        console.error('[PowerTools] Failed to restore defaults:', error);
        alert('Failed to restore defaults: ' + error.message);
      }
    }
  }

  // Category Management Methods
  showAddCategoryDialog(modal) {
    this.showCategoryForm(modal, null, 'Add New Category');
  }

  showEditCategoryDialog(modal, categoryId) {
    const config = this.config.load();
    const category = config.categories[categoryId];
    if (!category) return;
    
    this.showCategoryForm(modal, category, 'Edit Category');
  }

  showCategoryForm(parentModal, category, title) {
    // Create form overlay
    const formOverlay = document.createElement('div');
    formOverlay.className = 'power-tools-form-overlay';
    
    const isEdit = category !== null;
    const isFactory = category?.isFactory || false;
    
    console.log('[PowerTools] Creating category form:', category?.name);
    
    formOverlay.innerHTML = `
      <div class="power-tools-form">
        <div class="power-tools-form-header">
          <h3>${title}</h3>
          <button class="power-tools-close-btn" type="button">
            <span class="codicon codicon-close"></span>
          </button>
        </div>
        <div class="power-tools-form-content">
          <div class="form-row">
            <div class="form-group" style="flex: 0 0 73px;">
              <label for="category-emoji">Emoji</label>
              <div class="emoji-picker-container">
                <button type="button" class="emoji-picker-btn" id="category-emoji-picker-btn">
                  <span class="selected-emoji">${category?.emoji || '🔧'}</span>
                  <span class="codicon codicon-chevron-down"></span>
                </button>
                <div class="emoji-picker-dropdown" id="category-emoji-picker-dropdown">
                  <div class="emoji-grid">
                    <!-- Emojis will be populated here -->
                  </div>
                </div>
              </div>
              <input type="hidden" id="category-emoji" value="${category?.emoji || '🔧'}">
            </div>
            <div class="form-group" style="flex: 1;">
              <label for="category-name">Category Name</label>
              <input type="text" id="category-name" value="${category?.name || ''}" placeholder="e.g., Testing" required>
            </div>
          </div>
          
          <div class="form-group">
            <label for="category-description">Description</label>
            <input type="text" id="category-description" value="${category?.description || ''}" placeholder="Brief description of this category" required>
          </div>
          
          <div class="form-group">
            <label for="category-color">Color</label>
            <div class="color-picker-container">
              <input type="color" id="category-color" value="${category?.color || '#6b7280'}">
              <input type="text" id="category-color-text" value="${category?.color || '#6b7280'}" placeholder="#6b7280">
            </div>
          </div>
        </div>
        <div class="power-tools-form-footer">
          <button type="button" class="power-tools-btn secondary" id="cancel-category-form">Cancel</button>
          <button type="button" class="power-tools-btn primary" id="save-category">${isEdit ? 'Update' : 'Create'} Category</button>
        </div>
      </div>
    `;

    // Add form styles if not already added
    this.addFormStyles();
    
    // Add to document
    document.body.appendChild(formOverlay);
    
    // Focus first input
    setTimeout(() => {
      const firstInput = formOverlay.querySelector('#category-name');
      if (firstInput) firstInput.focus();
    }, 100);
    
    // Setup category form event listeners
    this.setupCategoryFormEventListeners(formOverlay, parentModal, category, isEdit);
  }

  setupCategoryFormEventListeners(formOverlay, parentModal, category, isEdit) {
    // Emoji list
    const emojis = [
      '⚙️', '🐛', '📚', '💡', '🔧', '🧪', '🚀', '🎯', '💻', '🎨',
      '🛡️', '⚡', '🌟', '🔍', '📊', '🏗️', '🎭', '🎪', '🎲', '🎵',
      '🔥', '❄️', '🌈', '🎈', '🎪', '🎨', '🎭', '🎪', '🎲', '🎵'
    ];

    // Populate emoji grid
    const emojiGrid = formOverlay.querySelector('.emoji-grid');
    if (emojiGrid) {
      emojiGrid.innerHTML = '';
      emojis.forEach(emoji => {
        const emojiItem = document.createElement('div');
        emojiItem.className = 'emoji-item';
        emojiItem.textContent = emoji;
        emojiItem.title = emoji;
        
        // Mark as selected if it's the current emoji
        const currentEmoji = formOverlay.querySelector('#category-emoji').value;
        if (emoji === currentEmoji) {
          emojiItem.classList.add('selected');
        }
        
        // Add click handler
        emojiItem.addEventListener('click', () => {
          // Update selected emoji
          formOverlay.querySelector('#category-emoji').value = emoji;
          formOverlay.querySelector('.selected-emoji').textContent = emoji;
          
          // Update selected state
          emojiGrid.querySelectorAll('.emoji-item').forEach(item => item.classList.remove('selected'));
          emojiItem.classList.add('selected');
          
          // Close dropdown
          formOverlay.querySelector('#category-emoji-picker-dropdown').classList.remove('show');
        });
        
        emojiGrid.appendChild(emojiItem);
      });
    }

    // Emoji picker dropdown toggle
    const emojiPickerBtn = formOverlay.querySelector('#category-emoji-picker-btn');
    const emojiDropdown = formOverlay.querySelector('#category-emoji-picker-dropdown');
    
    if (emojiPickerBtn && emojiDropdown) {
      emojiPickerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        emojiDropdown.classList.toggle('show');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!emojiPickerBtn.contains(e.target) && !emojiDropdown.contains(e.target)) {
          emojiDropdown.classList.remove('show');
        }
      });
    }

    // Color picker sync
    const colorPicker = formOverlay.querySelector('#category-color');
    const colorText = formOverlay.querySelector('#category-color-text');
    
    colorPicker?.addEventListener('change', (e) => {
      colorText.value = e.target.value;
    });
    
    colorText?.addEventListener('input', (e) => {
      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
        colorPicker.value = e.target.value;
      }
    });

    // Close button
    const closeBtn = formOverlay.querySelector('.power-tools-close-btn');
    const cancelBtn = formOverlay.querySelector('#cancel-category-form');
    
    const closeForm = () => formOverlay.remove();
    
    closeBtn?.addEventListener('click', closeForm);
    cancelBtn?.addEventListener('click', closeForm);
    
    // Click outside to close
    formOverlay.addEventListener('click', (e) => {
      if (e.target === formOverlay) closeForm();
    });
    
    // ESC key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeForm();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
    
    // Save button
    const saveBtn = formOverlay.querySelector('#save-category');
    saveBtn?.addEventListener('click', () => {
      this.saveCategoryFromForm(formOverlay, parentModal, category, isEdit);
    });
    
    // Enter key to save
    formOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.saveCategoryFromForm(formOverlay, parentModal, category, isEdit);
      }
    });
  }

  saveCategoryFromForm(formOverlay, parentModal, existingCategory, isEdit) {
    // Get form values
    const emoji = formOverlay.querySelector('#category-emoji').value;
    const name = formOverlay.querySelector('#category-name').value.trim();
    const description = formOverlay.querySelector('#category-description').value.trim();
    const color = formOverlay.querySelector('#category-color').value;
    
    console.log('[PowerTools] Saving category:', name);
    
    // Validation
    if (!name) {
      alert('Category name is required!');
      formOverlay.querySelector('#category-name').focus();
      return;
    }
    
    if (!description) {
      alert('Category description is required!');
      formOverlay.querySelector('#category-description').focus();
      return;
    }
    
    try {
      if (isEdit) {
        // Update existing category
        const updatedCategory = {
          ...existingCategory,
          name,
          emoji,
          description,
          color
        };
        
        if (existingCategory.isFactory) {
          // Update factory category
          const factoryCategories = JSON.parse(localStorage.getItem('dictator.powerTools.factoryCategories') || '{}');
          const factoryKey = Object.keys(factoryCategories).find(key => factoryCategories[key].id === existingCategory.id);
          if (factoryKey) {
            factoryCategories[factoryKey] = updatedCategory;
            localStorage.setItem('dictator.powerTools.factoryCategories', JSON.stringify(factoryCategories));
          }
        } else {
          // Update custom category
          const customCategories = JSON.parse(localStorage.getItem('dictator.powerTools.customCategories') || '[]');
          const index = customCategories.findIndex(c => c.id === existingCategory.id);
          if (index >= 0) {
            customCategories[index] = updatedCategory;
            localStorage.setItem('dictator.powerTools.customCategories', JSON.stringify(customCategories));
          }
        }
        
        console.log('[PowerTools] Category updated:', updatedCategory.name);
      } else {
        // Create new category
        const id = name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-').substring(0, 30) + '-' + Date.now();
        
        // Get the next order index
        const customCategories = JSON.parse(localStorage.getItem('dictator.powerTools.customCategories') || '[]');
        const factoryCategories = JSON.parse(localStorage.getItem('dictator.powerTools.factoryCategories') || '{}');
        const allCategories = [...customCategories, ...Object.values(factoryCategories)];
        const maxOrder = allCategories.reduce((max, c) => Math.max(max, c.order || 0), 0);
        
        const newCategory = {
          id,
          name,
          emoji,
          description,
          color,
          order: maxOrder + 1,
          enabled: true,
          isFactory: false
        };
        
        const existingCustomCategories = JSON.parse(localStorage.getItem('dictator.powerTools.customCategories') || '[]');
        existingCustomCategories.push(newCategory);
        localStorage.setItem('dictator.powerTools.customCategories', JSON.stringify(existingCustomCategories));
        
        console.log('[PowerTools] Category added:', newCategory);
        console.log('[PowerTools] All custom categories now:', existingCustomCategories);
      }
      
      // Refresh both categories and templates lists
      const config = this.config.load();
      this.populateCategoriesList(config.categories);
      this.populateTemplatesList(config.templates);
      this.registerHotkeys();
      
      // Close form
      formOverlay.remove();
      
    } catch (error) {
      console.error('[PowerTools] Failed to save category:', error);
      alert('Failed to save category: ' + error.message);
    }
  }

  showDeleteCategoryDialog(modal, categoryId) {
    const config = this.config.load();
    const category = config.categories[categoryId];
    if (!category || category.isFactory) return;

    if (confirm(`Are you sure you want to delete the category "${category.name}"?\n\nAll templates in this category will be moved to "General".`)) {
      try {
        // Move all templates from this category to 'general'
        const templates = config.templates;
        Object.values(templates).forEach(template => {
          if (template.category === categoryId) {
            template.category = 'general';
            
            // Update template storage
            if (template.isFactory) {
              const factoryTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.factoryTemplates') || '{}');
              const factoryKey = Object.keys(factoryTemplates).find(key => factoryTemplates[key].id === template.id);
              if (factoryKey) {
                factoryTemplates[factoryKey].category = 'general';
                localStorage.setItem('dictator.powerTools.factoryTemplates', JSON.stringify(factoryTemplates));
              }
            } else {
              const customTemplates = JSON.parse(localStorage.getItem('dictator.powerTools.customTemplates') || '[]');
              const customIndex = customTemplates.findIndex(t => t.id === template.id);
              if (customIndex >= 0) {
                customTemplates[customIndex].category = 'general';
                localStorage.setItem('dictator.powerTools.customTemplates', JSON.stringify(customTemplates));
              }
            }
          }
        });
        
        // Delete the category
        const customCategories = JSON.parse(localStorage.getItem('dictator.powerTools.customCategories') || '[]');
        const filteredCategories = customCategories.filter(c => c.id !== categoryId);
        localStorage.setItem('dictator.powerTools.customCategories', JSON.stringify(filteredCategories));
        
        // Refresh both lists
        const newConfig = this.config.load();
        this.populateCategoriesList(newConfig.categories);
        this.populateTemplatesList(newConfig.templates);
        this.registerHotkeys();
        
        console.log('[PowerTools] Category deleted:', category.name);
      } catch (error) {
        console.error('[PowerTools] Failed to delete category:', error);
        alert('Failed to delete category: ' + error.message);
      }
    }
  }

  showRestoreCategoryDefaultsDialog(modal) {
    if (confirm('Are you sure you want to restore all category settings to factory defaults? This will reset all category customizations.')) {
      try {
        // Clear custom categories and factory customizations
        localStorage.removeItem('dictator.powerTools.factoryCategories');
        localStorage.removeItem('dictator.powerTools.customCategories');
        
        // Refresh both categories and templates lists
        const config = this.config.load();
        this.populateCategoriesList(config.categories);
        this.populateTemplatesList(config.templates);
        this.registerHotkeys();
        
        console.log('[PowerTools] Category settings restored to defaults');
        alert('Category settings restored to factory defaults!');
      } catch (error) {
        console.error('[PowerTools] Failed to restore category defaults:', error);
        alert('Failed to restore category defaults: ' + error.message);
      }
    }
  }

}

// Initialize Power Tools
let powerToolsInstance = null;

function initializePowerTools() {
  if (powerToolsInstance) return powerToolsInstance;
  
  powerToolsInstance = new PowerToolsUI();
  powerToolsInstance.initialize();
  
  return powerToolsInstance;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePowerTools);
} else {
  initializePowerTools();
}

// Make available globally for commands
window.PowerTools = {
  instance: () => powerToolsInstance,
  openSettings: () => powerToolsInstance?.openVSCodeSettings(),
  executeTemplate: (templateId) => {
    const config = powerToolsInstance?.config.load();
    const template = config?.templates[templateId];
    if (template) {
      powerToolsInstance?.executeTemplate(template);
    }
  }
};

console.log('[PowerTools] Power Tools system loaded - v1.4.2 with AutoSend, Drag-to-Reorder, Category Manager, and Cross-Category Dragging features (Category Order & Context Menu Fixes)');

// Auto-dismiss Cursor corruption notification (same as dictator.js)
setTimeout(() => {
	console.log('[PowerTools] Checking for corruption notification...');
	
	function findAndDismissCorruptionNotification() {
		// Look for the notification message
		const notificationMessages = document.querySelectorAll('.notification-list-item-message span');
		
		for (const messageSpan of notificationMessages) {
			if (messageSpan.textContent && messageSpan.textContent.includes('Your Cursor installation appears to be corrupt')) {
				console.log('[PowerTools] Found corruption notification, attempting to dismiss...');
				
				// Try to find the clear button in the same notification item
				const notificationItem = messageSpan.closest('.notification-list-item');
				if (notificationItem) {
					const clearButton = notificationItem.querySelector('a.action-label.codicon-notifications-clear');
					if (clearButton) {
						console.log('[PowerTools] Clicking clear button...');
						clearButton.click();
						return true;
					}
					
					// Fallback: try to remove the entire notification element
					console.log('[PowerTools] Clear button not found, removing notification element...');
					notificationItem.remove();
					return true;
				}
			}
		}
		
		// Alternative selector - look for any notification containing "corrupt"
		const allNotifications = document.querySelectorAll('.notification-list-item');
		for (const notification of allNotifications) {
			if (notification.textContent && notification.textContent.toLowerCase().includes('corrupt')) {
				console.log('[PowerTools] Found corruption notification (alternative method), dismissing...');
				const clearButton = notification.querySelector('a.action-label.codicon-notifications-clear');
				if (clearButton) {
					clearButton.click();
				} else {
					notification.remove();
				}
				return true;
			}
		}
		
		return false;
	}
	
	// Try to dismiss immediately
	if (!findAndDismissCorruptionNotification()) {
		// If not found, try again after another 3 seconds (notifications might load later)
		setTimeout(() => {
			if (!findAndDismissCorruptionNotification()) {
				console.log('[PowerTools] No corruption notification found to dismiss.');
			}
		}, 3000);
	}
}, 2000); 