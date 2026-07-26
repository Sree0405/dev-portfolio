import type { PlaygroundTheme } from "../types";

export interface EditorThemeDefinition {
  id: PlaygroundTheme;
  label: string;
  monacoTheme: string;
}

const themeRegistry = new Map<PlaygroundTheme, EditorThemeDefinition>();

export function registerEditorTheme(theme: EditorThemeDefinition): void {
  themeRegistry.set(theme.id, theme);
}

export function getEditorTheme(id: PlaygroundTheme): EditorThemeDefinition {
  const theme = themeRegistry.get(id);
  if (!theme) {
    return { id: "dark", label: "Dark", monacoTheme: "vs-dark" };
  }
  return theme;
}

export function listEditorThemes(): EditorThemeDefinition[] {
  return Array.from(themeRegistry.values());
}

registerEditorTheme({ id: "light", label: "Light", monacoTheme: "vs" });
registerEditorTheme({ id: "dark", label: "Dark", monacoTheme: "vs-dark" });
