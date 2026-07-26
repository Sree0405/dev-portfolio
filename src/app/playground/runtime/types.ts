import type { CompileResult, ExecuteResult } from "../types";

export interface RuntimeContext {
  signal?: AbortSignal;
  onConsole?: (event: RuntimeConsoleEvent) => void;
}

export interface RuntimeConsoleEvent {
  type: "log" | "info" | "warn" | "error" | "debug" | "table" | "time" | "timeEnd" | "clear" | "result";
  args: unknown[];
  label?: string;
  duration?: number;
}

export interface RuntimeEngine {
  readonly id: string;
  compile(source: string, context?: RuntimeContext): Promise<CompileResult>;
  execute(source: string, context?: RuntimeContext): Promise<ExecuteResult>;
  validate(source: string): Promise<CompileResult>;
  dispose(): void;
}

export type WorkerInboundMessage =
  | { type: "execute"; id: string; code: string }
  | { type: "stop"; id: string }
  | { type: "dispose" };

export type WorkerOutboundMessage =
  | { type: "console"; id: string; event: RuntimeConsoleEvent }
  | { type: "error"; id: string; message: string; stack?: string; line?: number; column?: number }
  | { type: "done"; id: string; durationMs: number }
  | { type: "stopped"; id: string };
