import * as vscode from "vscode";
import MpvApi from "node-mpv";

import getUserDataPath from "./getUserDataPath";
const mpv = new MpvApi({
  audio_only: true,
  auto_restart: true,
});

export async function activate(context: vscode.ExtensionContext) {
  const rootDir = await getUserDataPath();
  const unusable = rootDir === "";

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("music-vscode.helloWorld", async () => {
    // The code you place here will be executed every time your command is executed

    const name = await vscode.window.showInputBox({
      placeHolder: "Name of the component",
      prompt: "What do you want to call the component?",
    });

    if (name) {
      vscode.window.showInformationMessage(`${name} from music-vscode!`);
    }

    // Display a message box to the user
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  return mpv.quit();
}
