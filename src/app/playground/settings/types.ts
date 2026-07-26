import type { PlaygroundTheme } from "../types";

export interface PlaygroundSettings {
  theme: PlaygroundTheme;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  autoSave: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  consoleCollapsed: boolean;
  consoleFilter: "all" | "log" | "warn" | "error";
}

export interface SettingDefinition<T = unknown> {
  id: keyof PlaygroundSettings;
  label: string;
  description?: string;
  defaultValue: T;
  group: "editor" | "console" | "general";
}
