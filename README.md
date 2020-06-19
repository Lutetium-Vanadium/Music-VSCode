# Music VSCode

An extension to play Songs from the Music database

## Features

There are a few commands:

| Command          | What it does                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| `Play All Songs` | Plays all the songs.                                                                                          |
| `Play/Pause`     | Plays/Pauses current playing song.                                                                            |
| `Next Song`      | Goes to next song.                                                                                            |
| `Previous Song`  | Goes to previois song.                                                                                        |
| `Stop`           | Stops playing songs                                                                                           |
| `Set Volume`     | Sets the volume to any number between 0 and 100. If the number exceeds these bounds, it gets latched to them. |
| `Shuffle`        | Shuffles all the songs.                                                                                       |
| `Loop`           | Loops the current song.                                                                                       |
| `Seek Forward`   | Goes ahead 10 seconds.                                                                                        |
| `Seek Backward`  | Goes behind 10 seconds.                                                                                       |

## Requirements

The Extension requires [mpv](https://mpv.io/) to be installed in the path. It uses this to play the sound.

## Known problems

The extension won't start. This is because it uses sqlite3 which has native dependencies so it must be built for the right electron version.
Run `yarn fix-sqlite3` to install native dependencies before building the extension. <br>

> If the script is not able to detect electron version used by your current vscode,
> go to `Help > Toggle Developer Tools` which should bring up the chromium dev tools to the right.
> Then type `process.versions.electron` into the console and it should give a version number. Then run `yarn fix-sqlite3 <version-number>`.

## TODO

- Make a queue viewer
- Play particular album

## Release Notes

Initial release of Music VSCode

### 1.0.0

Initial release of Music VSCode
