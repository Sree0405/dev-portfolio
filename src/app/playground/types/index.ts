export type PlaygroundTheme = "light" | "dark";

export type RuntimeStatus = "idle" | "running" | "compiling" | "error" | "stopped";

export type ConsoleLogLevel = "log" | "info" | "warn" | "error" | "debug" | "table" | "time" | "timeEnd" | "clear" | "result";

export interface SerializedValue {
  type: "string" | "number" | "boolean" | "null" | "undefined" | "bigint" | "symbol" | "function" | "object" | "array" | "error" | "date" | "unknown";
  value: string;
  preview?: string;
  children?: SerializedValue[];
  expandable?: boolean;
  name?: string;
  stack?: string;
}

export interface ConsoleEntry {
  id: string;
  level: ConsoleLogLevel;
  timestamp: number;
  args: SerializedValue[];
  label?: string;
  duration?: number;
  stack?: string;
  source?: "runtime" | "compile" | "system";
}

export interface DiagnosticMarker {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
  severity: "error" | "warning" | "info";
}

export interface CompileResult {
  success: boolean;
  output?: string;
  diagnostics: DiagnosticMarker[];
  durationMs: number;
}

export interface ExecuteResult {
  success: boolean;
  durationMs: number;
  error?: {
    message: string;
    stack?: string;
    line?: number;
    column?: number;
  };
}

export interface PlaygroundFile {
  name: string;
  content: string;
  languageId: string;
}

export interface CursorPosition {
  line: number;
  column: number;
}

export interface PlaygroundSnapshot {
  code: string;
  languageId: string;
  settings: Record<string, unknown>;
  updatedAt: number;
}
