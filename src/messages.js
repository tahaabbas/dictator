exports.messages = {
	admin: "Run VS Code with admin privileges so the changes can be applied.",
	enabled:
		"Dictator with Voice Recording enabled. Restart to take effect. " +
		"If Code complains about it is corrupted, CLICK DON'T SHOW AGAIN. " +
		"The microphone button will appear in Cursor's chat interface after restart.",
	disabled: "Dictator disabled and reverted to default. Restart to take effect.",
	already_disabled: "Dictator already disabled.",
	somethingWrong: "Something went wrong: ",
	restartIde: "Restart Visual Studio Code",
	notfound: "Dictator not found.",
	notConfigured:
		"Dictator path not configured. ",		
	reloadAfterVersionUpgrade:
		"Detected VSCode is upgraded. " + "Performing application only.",
	unableToLocateVsCodeInstallationPath:
		"Unable to locate the installation path of VSCode. This extension may not function correctly.",
	cannotLoad: url => `Cannot load '${url}'. Skipping.`
};
