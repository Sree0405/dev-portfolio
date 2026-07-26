import { useCallback, useEffect, useRef, useState } from "react";
import type { ConsoleEntry, DiagnosticMarker, RuntimeStatus } from "../types";
import type { RuntimeConsoleEvent, RuntimeEngine } from "../runtime/types";
import { getLanguage } from "../languages/languageRegistry";
import { serializeArgs } from "../console/serializeValue";

function createEntryId(): string {
  return `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function deserializeWorkerArg(value: unknown): unknown {
  if (value && typeof value === "object" && "__type" in value) {
    const typed = value as { __type: string; value?: string; name?: string; message?: string; stack?: string };
    switch (typed.__type) {
      case "undefined":
        return undefined;
      case "bigint":
        return BigInt(typed.value ?? "0");
      case "symbol":
        return Symbol(typed.value?.replace(/^Symbol\((.*)\)$/, "$1") ?? "");
      case "function":
        return typed.value;
      case "error":
        return Object.assign(new Error(typed.message), { name: typed.name, stack: typed.stack });
      case "date":
        return new Date(typed.value ?? "");
      default:
        return value;
    }
  }
  return value;
}

export function usePlaygroundExecution() {
  const [entries, setEntries] = useState<ConsoleEntry[]>([]);
  const [runtimeDiagnostics, setRuntimeDiagnostics] = useState<DiagnosticMarker[]>([]);
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus>("idle");
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const runtimeRef = useRef<(RuntimeEngine & { stop?: () => void }) | null>(null);

  const appendEntry = useCallback((entry: Omit<ConsoleEntry, "id" | "timestamp">) => {
    setEntries((current) => [...current, { ...entry, id: createEntryId(), timestamp: Date.now() }]);
  }, []);

  const clearConsole = useCallback(() => {
    setEntries([]);
  }, []);

  const handleConsoleEvent = useCallback(
    (event: RuntimeConsoleEvent) => {
      if (event.type === "clear") {
        setEntries([]);
        return;
      }

      const args = serializeArgs(event.args.map(deserializeWorkerArg));
      appendEntry({
        level: event.type,
        args,
        label: event.label,
        duration: event.duration,
        source: "runtime",
      });
    },
    [appendEntry],
  );

  const run = useCallback(async (code: string, languageId: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setRuntimeStatus("compiling");
    setExecutionTimeMs(null);
    setRuntimeDiagnostics([]);

    const language = getLanguage(languageId);
    const runtime = language.getRuntime();
    runtimeRef.current = runtime;

    try {
      const compileResult = await runtime.compile(code, { signal: controller.signal });
      setRuntimeDiagnostics(compileResult.diagnostics);

      if (!compileResult.success) {
        setRuntimeStatus("error");
        for (const diagnostic of compileResult.diagnostics) {
          appendEntry({
            level: "error",
            args: serializeArgs([diagnostic.message]),
            source: "compile",
          });
        }
        return;
      }

      setRuntimeStatus("running");
      const executeResult = await runtime.execute(code, {
        signal: controller.signal,
        onConsole: handleConsoleEvent,
      });

      setExecutionTimeMs(executeResult.durationMs);

      if (!executeResult.success && executeResult.error) {
        setRuntimeStatus("error");
        appendEntry({
          level: "error",
          args: serializeArgs([executeResult.error.message]),
          stack: executeResult.error.stack,
          source: "runtime",
        });

        if (executeResult.error.line) {
          setRuntimeDiagnostics([
            {
              startLineNumber: executeResult.error.line,
              startColumn: executeResult.error.column ?? 1,
              endLineNumber: executeResult.error.line,
              endColumn: (executeResult.error.column ?? 1) + 1,
              message: executeResult.error.message,
              severity: "error",
            },
          ]);
        }
        return;
      }

      setRuntimeStatus("idle");
    } catch (error) {
      const err = error as Error;
      setRuntimeStatus("error");
      appendEntry({
        level: "error",
        args: serializeArgs([err.message]),
        stack: err.stack,
        source: "system",
      });
    }
  }, [appendEntry, handleConsoleEvent]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    const runtime = runtimeRef.current;
    runtime?.stop?.();
    setRuntimeStatus("stopped");
  }, []);

  const clearRuntimeDiagnostics = useCallback(() => {
    setRuntimeDiagnostics([]);
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return {
    entries,
    runtimeDiagnostics,
    runtimeStatus,
    executionTimeMs,
    isRunning: runtimeStatus === "running" || runtimeStatus === "compiling",
    run,
    stop,
    clearConsole,
    clearRuntimeDiagnostics,
    setRuntimeStatus,
  };
}
