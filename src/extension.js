const vscode = require("vscode");
const fs = require("fs");
const os = require("os");
const path = require("path");
const msg = require("./messages").messages;
const uuid = require("uuid");
const fetch = require("node-fetch");
const Url = require("url");

function activate(context) {
	const loc = locateWorkbench();
	if (!loc) return;
	const [workbenchDir, htmlPath] = loc;

	function locateWorkbench() {
		const appDir = require.main
			? path.dirname(require.main.filename)
			: globalThis._VSCODE_FILE_ROOT;
		if (!appDir) {
			vscode.window.showInformationMessage(msg.unableToLocateVsCodeInstallationPath);
			return null;
		}

		const basePath = path.join(appDir, "vs", "code");
		const workbenchDirCandidates = [
			// v1.102+ path
			path.join(basePath, "electron-browser", "workbench"),
			path.join(basePath, "electron-browser"),
			// old path
			path.join(basePath, "electron-sandbox", "workbench"),
			path.join(basePath, "electron-sandbox")
		];

		const htmlFileNameCandidates = [
			"workbench-dev.html", // VSCode dev
			"workbench.esm.html", // VSCode ESM
			"workbench.html", // VSCode
			"workbench-apc-extension.html" // Cursor
		];

		for (const workbenchDirCandidate of workbenchDirCandidates) {
			for (const htmlFileNameCandidate of htmlFileNameCandidates) {
				const htmlPathCandidate = path.join(workbenchDirCandidate, htmlFileNameCandidate);
				if (fs.existsSync(htmlPathCandidate)) {
					return [workbenchDirCandidate, htmlPathCandidate];
				}
			}
		}

		vscode.window.showInformationMessage(msg.unableToLocateVsCodeInstallationPath);
		return null;
	}

	function BackupFilePath(uuid) {
		return path.join(workbenchDir, `workbench.${uuid}.bak-custom-css`);
	}

	function resolveVariable(key) {
		const variables = {
			cwd: () => process.cwd(),
			userHome: () => os.homedir(),
			workspaceFolder: () => vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "",
			execPath: () => process.env.VSCODE_EXEC_PATH ?? process.execPath,
			pathSeparator: () => path.sep,
			"/": () => path.sep
		};

		if (key in variables) return variables[key]();

		if (key.startsWith("env:")) {
			const [_, envKey, optionalDefault] = key.split(":");
			return process.env[envKey] ?? optionalDefault ?? "";
		}
	}
	function parsedUrl(url) {
		if (/^file:/.test(url)) {
			// regex matches any "${<RESOLVE>}" and replaces with resolveVariable(<RESOLVE>)
			// eg:  "HELLO ${userHome} WORLD" -> "HELLO /home/username WORLD"
			return url.replaceAll(
				/\$\{([^\{\}]+)\}/g,
				(substr, key) => resolveVariable(key) ?? substr
			);
		} else {
			return url;
		}
	}

	async function getContent(url) {
		if (/^file:/.test(url.toString())) {
			const fp = Url.fileURLToPath(url);
			return await fs.promises.readFile(fp);
		} else {
			const response = await fetch(url);
			return response.buffer();
		}
	}

	// ####  main commands ######################################################

	async function cmdInstall() {
		const uuidSession = uuid.v4();
		await createBackup(uuidSession);
		await performPatch(uuidSession);
	}

	async function cmdReinstall() {
		await uninstallImpl();
		await cmdInstall();
	}

	async function cmdUninstall() {
		await uninstallImpl();
		disabledRestart();
	}

	async function uninstallImpl() {
		const backupUuid = await getBackupUuid(htmlPath);
		if (!backupUuid) return;
		const backupPath = BackupFilePath(backupUuid);
		await restoreBackup(backupPath);
		await deleteBackupFiles();
	}

	// #### Backup ################################################################

	async function getBackupUuid(htmlFilePath) {
		try {
			const htmlContent = await fs.promises.readFile(htmlFilePath, "utf-8");
			const m = htmlContent.match(
				/<!-- !! VSCODE-CUSTOM-CSS-SESSION-ID ([0-9a-fA-F-]+) !! -->/
			);
			if (!m) return null;
			else return m[1];
		} catch (e) {
			vscode.window.showInformationMessage(msg.somethingWrong + e);
			throw e;
		}
	}

	async function createBackup(uuidSession) {
		try {
			let html = await fs.promises.readFile(htmlPath, "utf-8");
			html = clearExistingPatches(html);
			await fs.promises.writeFile(BackupFilePath(uuidSession), html, "utf-8");
		} catch (e) {
			vscode.window.showInformationMessage(msg.admin);
			throw e;
		}
	}

	async function restoreBackup(backupFilePath) {
		try {
			if (fs.existsSync(backupFilePath)) {
				await fs.promises.unlink(htmlPath);
				await fs.promises.copyFile(backupFilePath, htmlPath);
			}
		} catch (e) {
			vscode.window.showInformationMessage(msg.admin);
			throw e;
		}
	}

	async function deleteBackupFiles() {
		const htmlDir = path.dirname(htmlPath);
		const htmlDirItems = await fs.promises.readdir(htmlDir);
		for (const item of htmlDirItems) {
			if (item.endsWith(".bak-custom-css")) {
				await fs.promises.unlink(path.join(htmlDir, item));
			}
		}
	}

	// #### Patching ##############################################################

	async function performPatch(uuidSession) {
		const config = vscode.workspace.getConfiguration("dictator");

		let html = await fs.promises.readFile(htmlPath, "utf-8");
		html = clearExistingPatches(html);

		const injectHTML = await patchHtml(config);
		html = html.replace(/<meta\s+http-equiv="Content-Security-Policy"[\s\S]*?\/>/, "");

		let indicatorJS = "";
		if (config.statusbar) indicatorJS = await getIndicatorJs();

		html = html.replace(
			/(<\/html>)/,
			`<!-- !! VSCODE-CUSTOM-CSS-SESSION-ID ${uuidSession} !! -->\n` +
			"<!-- !! VSCODE-CUSTOM-CSS-START !! -->\n" +
			indicatorJS +
			injectHTML +
			"<!-- !! VSCODE-CUSTOM-CSS-END !! -->\n</html>"
		);
		try {
			await fs.promises.writeFile(htmlPath, html, "utf-8");
		} catch (e) {
			vscode.window.showInformationMessage(msg.admin);
			disabledRestart();
			return;
		}
		enabledRestart();
	}
	function clearExistingPatches(html) {
		html = html.replace(
			/<!-- !! VSCODE-CUSTOM-CSS-START !! -->[\s\S]*?<!-- !! VSCODE-CUSTOM-CSS-END !! -->\n*/,
			""
		);
		html = html.replace(/<!-- !! VSCODE-CUSTOM-CSS-SESSION-ID [\w-]+ !! -->\n*/g, "");
		return html;
	}

	async function patchHtml(config) {
		let res = "";
		
		// Always inject dictator.js first
		const dictatorJS = await getDictatorJs();
		if (dictatorJS) {
			res += dictatorJS;
		}
		
		// Then inject power-tools.js for enhanced functionality
		const powerToolsJS = await getPowerToolsJs();
		if (powerToolsJS) {
			res += powerToolsJS;
		}
		
		// Then inject user-configured imports if they exist
		if (config && config.imports && config.imports instanceof Array) {
			for (const item of config.imports) {
				const imp = await patchHtmlForItem(item);
				if (imp) res += imp;
			}
		}
		
		return res;
	}

	async function getDictatorJs() {
		try {
			let dictatorJsPath;
			let ext = vscode.extensions.getExtension("EchoSys.dictator");
			if (ext && ext.extensionPath) {
				dictatorJsPath = path.resolve(ext.extensionPath, "src/dictator.js");
			} else {
				dictatorJsPath = path.resolve(__dirname, "dictator.js");
			}
			
			if (fs.existsSync(dictatorJsPath)) {
				const dictatorJsContent = await fs.promises.readFile(dictatorJsPath, "utf-8");
				const notificationCleaner = `
/* === AUTO-DISMISS CORRUPTION NOTIFICATION === */
setTimeout(() => {
	console.log('[Dictator] Checking for corruption notification...');
	
	function findAndDismissCorruptionNotification() {
		// Look for the notification message
		const notificationMessages = document.querySelectorAll('.notification-list-item-message span');
		
		for (const messageSpan of notificationMessages) {
			if (messageSpan.textContent && messageSpan.textContent.includes('Your Cursor installation appears to be corrupt')) {
				console.log('[Dictator] Found corruption notification, attempting to dismiss...');
				
				// Try to find the clear button in the same notification item
				const notificationItem = messageSpan.closest('.notification-list-item');
				if (notificationItem) {
					const clearButton = notificationItem.querySelector('a.action-label.codicon-notifications-clear');
					if (clearButton) {
						console.log('[Dictator] Clicking clear button...');
						clearButton.click();
						return true;
					}
					
					// Fallback: try to remove the entire notification element
					console.log('[Dictator] Clear button not found, removing notification element...');
					notificationItem.remove();
					return true;
				}
			}
		}
		
		// Alternative selector - look for any notification containing "corrupt"
		const allNotifications = document.querySelectorAll('.notification-list-item');
		for (const notification of allNotifications) {
			if (notification.textContent && notification.textContent.toLowerCase().includes('corrupt')) {
				console.log('[Dictator] Found corruption notification (alternative method), dismissing...');
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
				console.log('[Dictator] No corruption notification found to dismiss.');
			}
		}, 3000);
	}
}, 2000);
`;
				return `<script>\n/* === DICTATOR.JS - Voice Recording for VSCode/Cursor === */\n${dictatorJsContent}\n\n${notificationCleaner}\n</script>\n`;
			} else {
				console.warn("dictator.js not found at:", dictatorJsPath);
				vscode.window.showWarningMessage("dictator.js not found. Voice recording functionality will not be available.");
				return "";
			}
		} catch (e) {
			console.error("Error loading dictator.js:", e);
			vscode.window.showWarningMessage("Failed to load dictator.js: " + e.message);
			return "";
		}
	}

	async function getPowerToolsJs() {
		try {
			let powerToolsJsPath;
			let ext = vscode.extensions.getExtension("EchoSys.dictator");
			if (ext && ext.extensionPath) {
				powerToolsJsPath = path.resolve(ext.extensionPath, "src/power-tools.js");
			} else {
				powerToolsJsPath = path.resolve(__dirname, "power-tools.js");
			}
			
			if (fs.existsSync(powerToolsJsPath)) {
				const powerToolsJsContent = await fs.promises.readFile(powerToolsJsPath, "utf-8");
				// Add event listener for settings requests from the UI
				const settingsEventHandler = `
// Listen for Power Tools settings requests from the UI
document.addEventListener('powerToolsOpenSettings', (event) => {
  console.log('[PowerTools Extension] Received settings request:', event.detail);
  
  // Try multiple methods to open settings
  try {
    // Method 1: Use vscode message posting (if available)
    if (typeof vscode !== 'undefined' && vscode.postMessage) {
      vscode.postMessage({
        command: 'openSettings',
        query: '@ext:EchoSys.dictator powerTools'
      });
      return;
    }
    
    // Method 2: Try to trigger command directly (if in VS Code webview)
    if (typeof acquireVsCodeApi !== 'undefined') {
      const vscodeApi = acquireVsCodeApi();
      vscodeApi.postMessage({
        command: 'workbench.action.openSettings',
        arguments: ['@ext:EchoSys.dictator powerTools']
      });
      return;
    }
    
    // Method 3: Dispatch a more specific event
    document.dispatchEvent(new CustomEvent('vscode-settings-request', {
      detail: {
        extensionId: 'EchoSys.dictator',
        section: 'powerTools',
        timestamp: event.detail.timestamp
      }
    }));
    
  } catch (error) {
    console.warn('[PowerTools Extension] Failed to open settings:', error);
  }
});

// Sync VS Code settings to localStorage for immediate UI access
function syncSettingsToLocalStorage() {
  try {
    // Default settings for Power Tools
    const defaultSettings = {
      'powerTools.showHotkeys': true,
      'powerTools.groupByCategory': true, 
      'powerTools.compactMode': false,
      'powerTools.autoFocusInput': true,
      'powerTools.factoryTemplates': {
        testGeneration: {
          id: 'test-generation',
          name: '🧪 Generate Tests',
          description: 'Generate comprehensive unit tests',
          prompt: 'Generate comprehensive unit tests for the selected code. Include edge cases, error scenarios, and mock dependencies where appropriate. Use the same testing framework as the existing codebase.',
          category: 'development',
          hotkey: 'cmd+shift+t',
          icon: 'codicon-beaker',
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
          enabled: true,
          isFactory: true
        }
      },
      'powerTools.customTemplates': []
    };
    
    // Store each setting in localStorage for immediate access
    Object.entries(defaultSettings).forEach(([key, defaultValue]) => {
      try {
        const storageKey = \`dictator.\${key}\`;
        if (!localStorage.getItem(storageKey)) {
          const valueToStore = typeof defaultValue === 'object' 
            ? JSON.stringify(defaultValue) 
            : String(defaultValue);
          localStorage.setItem(storageKey, valueToStore);
        }
      } catch (error) {
        console.warn(\`Failed to sync setting \${key}:\`, error);
      }
    });
    
    console.log('[PowerTools Extension] Default settings synced to localStorage');
  } catch (error) {
    console.warn('[PowerTools Extension] Failed to sync settings:', error);
  }
}

// Sync default settings to localStorage for immediate access
syncSettingsToLocalStorage();
`;
				
				return `<script>\n/* === POWER TOOLS - Advanced Developer Features for Cursor === */\n${powerToolsJsContent}\n\n${settingsEventHandler}\n</script>\n`;
			} else {
				console.warn("power-tools.js not found at:", powerToolsJsPath);
				// Power tools is optional, so don't show a warning to users
				return "";
			}
		} catch (e) {
			console.error("Error loading power-tools.js:", e);
			// Power tools is optional, so don't show a warning to users
			return "";
		}
	}

	async function patchHtmlForItem(url) {
		if (!url) return "";
		if (typeof url !== "string") return "";

		// Copy the resource to a staging directory inside the extension dir
		let parsed = new Url.URL(url);
		const ext = path.extname(parsed.pathname);

		try {
			parsed = parsedUrl(url);
			const fetched = await getContent(parsed);
			if (ext === ".css") {
				return `<style>${fetched}</style>`;
			} else if (ext === ".js") {
				return `<script>${fetched}</script>`;
			}
			throw new Error(`Unsupported extension type: ${ext}`);
		} catch (e) {
			console.error(e);
			vscode.window.showWarningMessage(msg.cannotLoad(parsed.toString()));
			return "";
		}
	}
	async function getIndicatorJs() {
		let indicatorJsPath;
		let ext = vscode.extensions.getExtension("EchoSys.dictator");
		if (ext && ext.extensionPath) {
			indicatorJsPath = path.resolve(ext.extensionPath, "src/statusbar.js");
		} else {
			indicatorJsPath = path.resolve(__dirname, "statusbar.js");
		}
		const indicatorJsContent = await fs.promises.readFile(indicatorJsPath, "utf-8");
		return `<script>${indicatorJsContent}</script>`;
	}

	function reloadWindow() {
		// reload vscode-window
		vscode.commands.executeCommand("workbench.action.reloadWindow");
	}
	function enabledRestart() {
		vscode.window.showInformationMessage(msg.enabled, msg.restartIde).then(btn => {
			// if close button is clicked btn is undefined, so no reload window
			if (btn === msg.restartIde) {
				reloadWindow();
			}
		});
	}
	function disabledRestart() {
		vscode.window.showInformationMessage(msg.disabled, msg.restartIde).then(btn => {
			if (btn === msg.restartIde) {
				reloadWindow();
			}
		});
	}

	const installDictator = vscode.commands.registerCommand(
		"extension.installDictator",
		cmdInstall
	);
	const uninstallDictator = vscode.commands.registerCommand(
		"extension.uninstallDictator",
		cmdUninstall
	);
	const updateDictator = vscode.commands.registerCommand(
		"extension.updateDictator",
		cmdReinstall
	);
	const powerToolSettings = vscode.commands.registerCommand(
		"extension.powerToolSettings",
		() => {
			// Open VS Code settings directly to the Power Tools section
			vscode.commands.executeCommand('workbench.action.openSettings', 'dictator.powerTools');
		}
	);

	// Note: Power Tools now uses a UI interface instead of commands

	context.subscriptions.push(installDictator);
	context.subscriptions.push(uninstallDictator);
	context.subscriptions.push(updateDictator);
	context.subscriptions.push(powerToolSettings);

	// Sync VS Code settings to the workbench localStorage for Power Tools
	function syncPowerToolsSettings() {
		try {
			const config = vscode.workspace.getConfiguration('dictator');
			
			const settingsToSync = [
				'powerTools.showHotkeys',
				'powerTools.groupByCategory', 
				'powerTools.compactMode',
				'powerTools.autoFocusInput',
				'powerTools.factoryTemplates',
				'powerTools.customTemplates'
			];
			
			const syncedSettings = {};
			settingsToSync.forEach(key => {
				const value = config.get(key);
				if (value !== undefined) {
					syncedSettings[key] = value;
				}
			});
			
			console.log('[PowerTools Extension] Settings synced:', Object.keys(syncedSettings).length, 'settings');
			console.log('[PowerTools Extension] Factory templates:', Object.keys(syncedSettings['powerTools.factoryTemplates'] || {}).length);
			console.log('[PowerTools Extension] Custom templates:', (syncedSettings['powerTools.customTemplates'] || []).length);
			
		} catch (error) {
			console.warn('[PowerTools Extension] Failed to sync settings:', error);
		}
	}

	// Watch for configuration changes and sync settings
	const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
		if (e.affectsConfiguration('dictator.powerTools')) {
			console.log('[PowerTools Extension] Power Tools settings changed');
			syncPowerToolsSettings();
		}
	});

	context.subscriptions.push(configWatcher);
	
	// Initial sync
	syncPowerToolsSettings();

	console.log("Dictator extension is active!");
	console.log("Workbench directory", workbenchDir);
	console.log("Main HTML file", htmlPath);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
