import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(vscode.commands.registerCommand('clickytest.aboutme', () => {
		vscode.window.showInformationMessage('Made by @joelbandi');
	}));

	// to add ruby tests:
	// - add "|| resourceLangId == ruby" in package.json under 'editor/context'
	// - do if statements below to figure out what kind of file. Or make a new menu action.
	// - run "vsce package" and use .vsix for extension
	context.subscriptions.push(vscode.commands.registerCommand('clickytest.runtest', () => {
		const filePath = activeEditorFilePath();

		if (!filePath) return;

		let activeTextEditor = vscode.window.activeTextEditor;
		let selected = activeTextEditor?.selection;

		if (filePath[filePath.length - 1] === 'b') {
			if (selected && !selected?.isEmpty) {
				runCmd(`bundle exec ruby -Itest -n ${filePath} ${activeTextEditor?.document.getText(selected)}`);
			}
			else {
				runCmd(`bundle exec ruby -Itest ${filePath}`);
			}
		}
		else {
			if (selected && !selected?.isEmpty) {
				runCmd(`pnpm jest --ignoreProjects=lint -t '${activeTextEditor?.document.getText(selected)}' -- ${filePath}`);
			}
			else {
				runCmd(`pnpm test ${filePath}`);
			}
		}

	}));

	// context.subscriptions.push(vscode.commands.registerCommand('clickytest.runrubytest', () => {
	// 	const filePath = activeEditorFilePath();
	// 	let activeTextEditor = vscode.window.activeTextEditor;
	// 	let selected = activeTextEditor?.selection;

	// 	if (selected && !selected?.isEmpty) {
	// 		runCmd(`ruby test '${activeTextEditor?.document.getText(selected)}' -- ${filePath}`);
	// 	}
	// 	else {
	// 		runCmd(`ruby test ${filePath}`);
	// 	}
	// }));

	const activeEditorFilePath = () => {
		return vscode.window.activeTextEditor?.document.uri.fsPath;
	};

	const runCmd = (cmd: string) => {
		let activeTerm = vscode.window.activeTerminal
		if (activeTerm === undefined) {
			activeTerm = vscode.window.createTerminal();
		}
		activeTerm.show(false);
		activeTerm.sendText(cmd);
	};
}

// this method is called when your extension is deactivated
export function deactivate() { }
