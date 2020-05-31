declare module "node-mpv" {
  import { PathLike } from "fs";

  interface Options {
    audio_only?: boolean;
    auto_restart?: boolean;
    binary?: PathLike;
    debug?: boolean;
    ipcCommand?: "--input-unix-socket" | "--input-ipc-server";
    socket?: string;
    time_update?: number;
    verbose?: boolean;
  }

  interface Metadata {
    artist: string;
    title: string;
    album: string;
    year: number;
  }

  export interface ErrorObject {
    errcode: string;
    verbose: string;
    method: string;
    arguments: string[];
    errmessage: string;
    options: object;
  }

  export interface SeekData {
    start: number;
    end: number;
  }

  export interface StatusObject {
    mute: boolean;
    pause: boolean;
    duration: number | null;
    volume: number;
    filename: string | null;
    path: PathLike | null;
    "media-title": string | null;
    "playlist-pos": number;
    "playlist-count": number;
    loop: string;
    fullscreen?: boolean;
    "sub-visibility"?: boolean;
    [key: string]: any; // For custom observed properties
  }

  type regularEvent = "started" | "stopped" | "paused" | "resumed";

  class MpvAPI {
    constructor(options?: Options, cliArgs?: string[]);
    quit(): Promise<void>;

    load(songPath: PathLike, mode?: "replace" | "append" | "append-play", options?: string[]): Promise<void>;
    loadFile(songPath: PathLike, mode?: "replace" | "append" | "append-play", options?: string[]): Promise<void>;
    loadStream(stream: NodeJS.ReadStream, mode?: "replace" | "append" | "append-play", options?: string[]): Promise<void>;
    loadPlaylist(file: PathLike, mode: "replace" | "append", options?: string[]): Promise<void>;
    append(file: PathLike, mode: "append" | "append-play"): Promise<void>;
    next(mode: "weak" | "force"): Promise<boolean>;
    prev(mode: "weak" | "force"): Promise<boolean>;
    clearPlaylist(): Promise<void>;
    playlistRemove(index: number | "current"): Promise<void>;
    playlistMove(index1: number, index2: number): Promise<void>;
    shuffle(): Promise<void>;

    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePause(): Promise<void>;
    mute(): Promise<void>;
    unmute(): Promise<void>;
    toggleMute(): Promise<void>;
    volume(volumeLevel: number): Promise<void>;
    adjustVolume(value: number): Promise<void>;
    seek(seconds: number): Promise<void>;
    goToPosition(seconds: number): Promise<void>;
    loop(times: number | "inf"): Promise<void>;

    addAudioTrack(file: PathLike, flag?: "select" | "auto" | "cached", title?: string, lang?: string): Promise<void>;
    removeAudioTrack(id: string): Promise<void>;
    selectAudioTrack(id: string): Promise<void>;
    adjustAudioTiming(seconds: number): Promise<void>;
    speed(scale: number): Promise<void>;

    fullscreen(): Promise<void>;
    leaveFullscreen(): Promise<void>;
    toggleFullscreen(): Promise<void>;
    screenshot(file: PathLike, options: "subtitles" | "video" | "window"): Promise<void>;
    rotateVideo(degrees: 0 | 90 | 180 | 270): Promise<void>;
    zoomVideo(factor: number): Promise<void>;
    brightness(value: number): Promise<void>;
    contrast(value: number): Promise<void>;
    saturation(value: number): Promise<void>;
    gamma(value: number): Promise<void>;
    hue(value: number): Promise<void>;

    addSubtitles(file: PathLike, flag?: "select" | "auto" | "cached", title?: string, lang?: string): Promise<void>;
    removeSubtitles(id: string): Promise<void>;
    selectSubtitles(id: string): Promise<void>;
    cycleSubtitles(): Promise<void>;
    toggleSubtitleVisibility(): Promise<void>;
    showSubtitles(): Promise<void>;
    hideSubtitles(): Promise<void>;
    adjustSubtitleTiming(seconds: number): Promise<void>;
    subtitleSeek(lines: number): Promise<void>;
    subtitleScale(scale: number): Promise<void>;
    displayASS(assMessage: string, duration: number, position?: number): Promise<void>;

    setProperty<T = any>(property: string, value: T): Promise<void>;
    setMultipleProperties(properties: { [key: string]: any }): Promise<void>;
    getPropery<T = any>(property: string): Promise<T>;
    addProperty(property: string, value: number): Promise<void>;
    multiplyProperty(property: string, value: number): Promise<void>;
    cycleProperty(property: string): Promise<void>;
    command(command: string, args: string[]): Promise<void>;
    commandJSON(command: object): Promise<void>;
    freeCommand(property: string): Promise<void>;

    observeProperty(property: string, id: number): Promise<void>;
    unobserveProperty(id: number): Promise<void>;

    addListener(type: regularEvent, listener: () => void): void;
    addListener(type: "timeposition", listener: (seconds: number) => void): void;
    addListener(type: "seek", listener: (seekData: SeekData) => void): void;
    addListener(type: "statuschange", listener: (statusObject: StatusObject) => void): void;
    on(type: regularEvent, listener: () => void): void;
    on(type: "timeposition", listener: (seconds: number) => void): void;
    on(type: "seek", listener: (seekData: SeekData) => void): void;
    on(type: "statuschange", listener: (statusObject: StatusObject) => void): void;

    removeListener(type: regularEvent, listener: () => void): void;
    removeListener(type: "timeposition", listener: (seconds: number) => void): void;
    removeListener(type: "seek", listener: (seekData: SeekData) => void): void;
    removeListener(type: "statuschange", listener: (statusObject: StatusObject) => void): void;
    off(type: regularEvent, listener: () => void): void;
    off(type: "timeposition", listener: (seconds: number) => void): void;
    off(type: "seek", listener: (seekData: SeekData) => void): void;
    off(type: "statuschange", listener: (statusObject: StatusObject) => void): void;
  }
  export default MpvAPI;
}
