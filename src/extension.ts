import * as vscode from "vscode";
import MpvApi from "node-mpv";

import getUserDataPath from "./getUserDataPath";
import Database from "./database";
import { ProgressLocation } from "vscode";

console.log("Loading mpv");

const mpv = new MpvApi({
  audio_only: true,
  auto_restart: true,
});
let db: Database;

console.log("Finsished Loading mpv");

const PREV = "$(debug-step-back)";
const NEXT = "$(debug-step-over)";
const LEFT = "$(chevron-left)";
const RIGHT = "$(chevron-right)";
const PLAY = "$(play)";
const PAUSE = "$(debug-pause)";

export async function activate(context: vscode.ExtensionContext) {
  const rootDir = await getUserDataPath();
  const unusable = rootDir === "";

  console.log("Detected path", rootDir);

  if (!unusable) {
    db = new Database(rootDir);
  }

  let loop = false;

  const prev = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  const seekbackward = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  const playpause = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  const seekforward = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  const next = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

  prev.show();
  seekbackward.show();
  playpause.show();
  seekforward.show();
  next.show();

  prev.tooltip = "Previous Song";
  seekbackward.tooltip = "Seek Backward";
  playpause.tooltip = "Play";
  seekforward.tooltip = "Seek Forward";
  next.tooltip = "Next Song";

  prev.command = "music-vscode.prev-track";
  seekbackward.command = "music-vscode.seek-backward";
  playpause.command = "music-vscode.play-pause";
  seekforward.command = "music-vscode.seek-forward";
  next.command = "music-vscode.next-track";

  prev.text = PREV;
  seekbackward.text = LEFT;
  playpause.text = PLAY;
  seekforward.text = RIGHT;
  next.text = NEXT;

  context.subscriptions.push(
    vscode.commands.registerCommand("music-vscode.all-songs", () => {
      if (unusable) {
        vscode.window.showErrorMessage("Couldn't detect config folder for Music.");
        return;
      }
      if (db.errored) {
        vscode.window.showErrorMessage("Could not connect to the database. If the database exists, try reopening vscode.");
        return;
      }
      vscode.window.withProgress({ location: ProgressLocation.Notification, title: "Loading Songs..." }, async () => {
        const songs = await db.all();

        mpv.load(songs[0].filePath);
        playpause.text = PAUSE;
        playpause.tooltip = "Pause";

        await Promise.all(songs.slice(1).map((song) => mpv.append(song.filePath)));

        mpv.play();
      });
    }),
    vscode.commands.registerCommand("music-vscode.play-pause", async () => {
      if (unusable) {
        vscode.window.showErrorMessage("Couldn't detect config folder for Music.");
      } else {
        mpv.togglePause();
        if (await mpv.getProperty("pause")) {
          playpause.text = PLAY;
          playpause.tooltip = "Play";
        } else {
          playpause.text = PAUSE;
          playpause.tooltip = "Pause";
        }
      }
    }),
    vscode.commands.registerCommand("music-vscode.next-track", () => {
      if (unusable) {
        vscode.window.showErrorMessage("Couldn't detect config folder for Music.");
      } else {
        mpv.next();
      }
    }),
    vscode.commands.registerCommand("music-vscode.prev-track", () => {
      if (unusable) {
        vscode.window.showErrorMessage("Couldn't detect config folder for Music.");
      } else {
        mpv.prev();
      }
    }),
    vscode.commands.registerCommand("music-vscode.stop", () => {
      if (unusable) {
        vscode.window.showErrorMessage("Couldn't detect config folder for Music.");
      } else {
        mpv.pause();
        mpv.clearPlaylist();
        playpause.text = PLAY;
        playpause.tooltip = "Play";
      }
    }),
    vscode.commands.registerCommand("music-vscode.set-volume", async () => {
      const volume = await vscode.window.showInputBox({
        value: await mpv.getProperty("volume"),
        validateInput: (value) => {
          const vol = parseInt(value);
          if (isNaN(vol)) {
            return "Please enter a number between 0 and 100";
          }
        },
        prompt: "Enter a number between 0 and 100",
      });

      if (volume) {
        mpv.volume(parseInt(volume));
      }
    }),
    vscode.commands.registerCommand("music-vscode.shuffle", () => {
      if (unusable) {
        vscode.window.showErrorMessage("Couldn't detect config folder for Music.");
      } else {
        mpv.shuffle();
      }
    }),
    vscode.commands.registerCommand("music-vscode.loop", () => {
      if (unusable) {
        vscode.window.showErrorMessage("Couldn't detect config folder for Music.");
      } else {
        loop = !loop;
        mpv.loop(loop ? "inf" : "no");
      }
    }),
    vscode.commands.registerCommand("music-vscode.seek-forward", () => {
      if (unusable) {
        vscode.window.showErrorMessage("Couldn't detect config folder for Music.");
      } else {
        mpv.seek(10);
      }
    }),
    vscode.commands.registerCommand("music-vscode.seek-backward", () => {
      if (unusable) {
        vscode.window.showErrorMessage("Couldn't detect config folder for Music.");
      } else {
        mpv.seek(-10);
      }
    })
  );
}

// this method is called when your extension is deactivated
export async function deactivate() {
  await db?.close();
  mpv.stop();
  return mpv.quit();
}
