/**
 * Developer Playground — modular in-browser IDE.
 *
 * Architecture:
 * - languages/languageRegistry   — register new languages
 * - runtime/runtimeRegistry      — register execution engines
 * - formatters/formatterRegistry — register code formatters
 * - toolbar/toolbarActionRegistry — pluggable toolbar actions
 * - console/consoleRendererRegistry — custom log renderers
 * - editor/themeRegistry         — editor themes
 * - settings/                    — persisted playground settings
 * - storage/autoSave             — localStorage snapshot
 */

export { PlaygroundLayout } from "./components/PlaygroundLayout";
export { MonacoEditor } from "./editor/MonacoEditor";
export { PlaygroundConsole } from "./console/PlaygroundConsole";
export { PlaygroundToolbar } from "./toolbar/PlaygroundToolbar";
export { PlaygroundStatusBar } from "./statusBar/PlaygroundStatusBar";

export { registerLanguage, getLanguage, listLanguages } from "./languages/languageRegistry";
export { registerRuntime, getRuntime, listRuntimes } from "./runtime/runtimeRegistry";
export { registerFormatter, getFormatter, listFormatters } from "./formatters/formatterRegistry";
export { registerToolbarAction, listToolbarActions } from "./toolbar/toolbarActionRegistry";
export { registerConsoleRenderer } from "./console/consoleRendererRegistry";
export { registerEditorTheme, listEditorThemes } from "./editor/themeRegistry";

export { usePlayground } from "./hooks/usePlayground";
export { usePlaygroundExecution } from "./hooks/usePlaygroundExecution";
export { usePlaygroundSettings } from "./settings/usePlaygroundSettings";

export type { LanguageDefinition, LanguageRegistration } from "./languages/types";
export type { RuntimeEngine, RuntimeContext } from "./runtime/types";
export type { FormatterDefinition } from "./formatters/types";
export type { ToolbarActionDefinition, ToolbarActionContext } from "./toolbar/types";
export type { PlaygroundSettings } from "./settings/types";
export type {
  ConsoleEntry,
  ConsoleLogLevel,
  DiagnosticMarker,
  PlaygroundSnapshot,
  PlaygroundTheme,
  RuntimeStatus,
} from "./types";
