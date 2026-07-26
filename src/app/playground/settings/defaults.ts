import type { PlaygroundSettings } from "./types";

export const DEFAULT_PLAYGROUND_SETTINGS: PlaygroundSettings = {
  theme: "dark",
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  autoSave: true,
  lineNumbers: true,
  minimap: true,
  consoleCollapsed: false,
  consoleFilter: "all",
};

export const PLAYGROUND_SETTINGS_DEFINITIONS = [
  { id: "theme" as const, label: "Theme", defaultValue: "dark" as const, group: "editor" as const },
  { id: "fontSize" as const, label: "Font Size", defaultValue: 14, group: "editor" as const },
  { id: "tabSize" as const, label: "Tab Size", defaultValue: 2, group: "editor" as const },
  { id: "wordWrap" as const, label: "Word Wrap", defaultValue: true, group: "editor" as const },
  { id: "lineNumbers" as const, label: "Line Numbers", defaultValue: true, group: "editor" as const },
  { id: "minimap" as const, label: "Minimap", defaultValue: true, group: "editor" as const },
  { id: "autoSave" as const, label: "Auto Save", defaultValue: true, group: "general" as const },
  { id: "consoleCollapsed" as const, label: "Console Collapsed", defaultValue: false, group: "console" as const },
  { id: "consoleFilter" as const, label: "Console Filter", defaultValue: "all" as const, group: "console" as const },
];
