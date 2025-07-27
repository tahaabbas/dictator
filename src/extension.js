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

	context.subscriptions.push(installDictator);
	context.subscriptions.push(uninstallDictator);
	context.subscriptions.push(updateDictator);

	console.log("Dictator extension is active!");
	console.log("Workbench directory", workbenchDir);
	console.log("Main HTML file", htmlPath);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
