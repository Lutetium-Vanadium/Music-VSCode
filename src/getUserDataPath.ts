import * as vscode from "vscode";
import * as os from "os";
import * as fs from "fs";
import { promisify } from "util";
import path from "path";

const exists = promisify(fs.exists);

const getUserDataPath = async (): Promise<string> => {
  const HOME = os.homedir();
  let configDir: string = "";
  switch (process.platform) {
    case "linux":
      const dotConfig = path.join(HOME, ".config", "Music");
      const dotLocal = path.join(HOME, ".local", "share", "Music");
      if (await exists(dotConfig)) {
        configDir = dotConfig;
      } else if (await exists(dotLocal)) {
        configDir = dotLocal;
      }
      break;
    case "darwin":
      const preferences = path.join(HOME, "Library", "Preferences", "Music");
      if (await exists(preferences)) {
        configDir = preferences;
      }
      break;
    case "win32":
      if (process.env.APPDATA && path.join(process.env.APPDATA, "Music")) {
        configDir = path.join(process.env.APPDATA, "Music");
      }
      break;
    default:
      console.error("Unsupported platform", process.platform);
      vscode.window.showErrorMessage("Your platform is not supported yet.");
      return "";
  }

  if (configDir === "") {
    vscode.window.showErrorMessage("Couldn't Find the configuration directory for the Music App.");
  }

  return configDir;
};

export default getUserDataPath;
