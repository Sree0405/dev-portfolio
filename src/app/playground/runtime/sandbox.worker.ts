/// <reference lib="webworker" />

import type { RuntimeConsoleEvent, WorkerInboundMessage, WorkerOutboundMessage } from "./types";

const timers = new Map<string, number>();
let activeExecutionId: string | null = null;
let abortRequested = false;

function post(message: WorkerOutboundMessage) {
  self.postMessage(message);
}

function serializeArg(value: unknown): unknown {
  if (value === undefined) return { __type: "undefined" };
  if (value === null) return null;
  if (typeof value === "bigint") return { __type: "bigint", value: value.toString() };
  if (typeof value === "symbol") return { __type: "symbol", value: value.toString() };
  if (typeof value === "function") return { __type: "function", value: `[Function${value.name ? `: ${value.name}` : ""}]` };
  if (value instanceof Error) {
    return { __type: "error", name: value.name, message: value.message, stack: value.stack };
  }
  if (value instanceof Date) return { __type: "date", value: value.toISOString() };
  try {
    JSON.stringify(value);
    return value;
  } catch {
    return String(value);
  }
}

function createSandboxConsole(executionId: string): Console {
  const emit = (type: RuntimeConsoleEvent["type"], args: unknown[], extra?: Partial<RuntimeConsoleEvent>) => {
    post({
      type: "console",
      id: executionId,
      event: {
        type,
        args: args.map(serializeArg),
        ...extra,
      },
    });
  };

  const sandboxConsole = {
    log: (...args: unknown[]) => emit("log", args),
    info: (...args: unknown[]) => emit("info", args),
    warn: (...args: unknown[]) => emit("warn", args),
    error: (...args: unknown[]) => emit("error", args),
    debug: (...args: unknown[]) => emit("debug", args),
    table: (data: unknown) => emit("table", [data]),
    time: (label = "default") => {
      timers.set(label, performance.now());
      emit("time", [label], { label });
    },
    timeEnd: (label = "default") => {
      const start = timers.get(label);
      const duration = start !== undefined ? performance.now() - start : 0;
      timers.delete(label);
      emit("timeEnd", [label], { label, duration });
    },
    clear: () => emit("clear", []),
  };

  return sandboxConsole as Console;
}

function parseStackLine(stack?: string): { line?: number; column?: number } {
  if (!stack) return {};
  const match = stack.match(/:(\d+):(\d+)/);
  if (!match) return {};
  return { line: Number(match[1]), column: Number(match[2]) };
}

async function runCode(executionId: string, code: string) {
  activeExecutionId = executionId;
  abortRequested = false;
  const startedAt = performance.now();
  const sandboxConsole = createSandboxConsole(executionId);

  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
      ...args: string[]
    ) => (...args: unknown[]) => Promise<unknown>;

    const runner = new AsyncFunction("console", `"use strict";\n${code}`);
    const result = await runner(sandboxConsole);

    if (result !== undefined) {
      emitResult(executionId, result);
    }

    post({ type: "done", id: executionId, durationMs: performance.now() - startedAt });
  } catch (error) {
    const err = error as Error;
    const { line, column } = parseStackLine(err.stack);
    post({
      type: "error",
      id: executionId,
      message: err.message || "Runtime error",
      stack: err.stack,
      line,
      column,
    });
    post({ type: "done", id: executionId, durationMs: performance.now() - startedAt });
  } finally {
    activeExecutionId = null;
    abortRequested = false;
  }
}

function emitResult(executionId: string, result: unknown) {
  post({
    type: "console",
    id: executionId,
    event: {
      type: "result",
      args: [serializeArg(result)],
    },
  });
}

self.addEventListener("message", (event: MessageEvent<WorkerInboundMessage>) => {
  const message = event.data;

  switch (message.type) {
    case "execute":
      if (activeExecutionId) {
        post({ type: "stopped", id: activeExecutionId });
      }
      void runCode(message.id, message.code);
      break;
    case "stop":
      if (activeExecutionId === message.id) {
        abortRequested = true;
        post({ type: "stopped", id: message.id });
        activeExecutionId = null;
      }
      break;
    case "dispose":
      activeExecutionId = null;
      abortRequested = false;
      timers.clear();
      break;
    default:
      break;
  }
});

export {};
