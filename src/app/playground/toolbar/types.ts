import type { ReactNode } from "react";

export interface ToolbarActionContext {
  code: string;
  languageId: string;
  isRunning: boolean;
  setCode: (code: string) => void;
  run: () => void;
  stop: () => void;
  clearConsole: () => void;
  formatCode: () => Promise<void>;
  copyCode: () => void;
  downloadCode: () => void;
  uploadCode: (content: string) => void;
  toggleTheme: () => void;
  setLanguageId: (id: string) => void;
  toggleWordWrap: () => void;
  toggleFullscreen: () => void;
  setFontSize: (size: number) => void;
}

export interface ToolbarActionDefinition {
  id: string;
  label: string;
  icon?: ReactNode;
  group: "execution" | "file" | "view" | "settings";
  order: number;
  shortcut?: string;
  isDisabled?: (ctx: ToolbarActionContext) => boolean;
  isActive?: (ctx: ToolbarActionContext) => boolean;
  render?: (ctx: ToolbarActionContext) => ReactNode;
  onClick?: (ctx: ToolbarActionContext) => void;
}
