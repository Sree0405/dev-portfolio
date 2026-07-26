import type { CursorPosition, RuntimeStatus } from "../types";
import { cn } from "@/lib/utils";

export interface PlaygroundStatusBarProps {
  languageLabel: string;
  cursor: CursorPosition;
  lineCount: number;
  characterCount: number;
  executionTimeMs: number | null;
  runtimeStatus: RuntimeStatus;
  className?: string;
}

const statusLabels: Record<RuntimeStatus, string> = {
  idle: "Ready",
  running: "Running…",
  compiling: "Compiling…",
  error: "Error",
  stopped: "Stopped",
};

const statusColors: Record<RuntimeStatus, string> = {
  idle: "text-emerald-400",
  running: "text-sky-400",
  compiling: "text-amber-400",
  error: "text-red-400",
  stopped: "text-zinc-400",
};

export function PlaygroundStatusBar({
  languageLabel,
  cursor,
  lineCount,
  characterCount,
  executionTimeMs,
  runtimeStatus,
  className,
}: PlaygroundStatusBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-zinc-800 bg-[#007acc] px-3 py-1 text-[11px] text-white",
        className,
      )}
    >
      <span>{languageLabel}</span>
      <span>
        Ln {cursor.line}, Col {cursor.column}
      </span>
      <span>{lineCount} lines</span>
      <span>{characterCount} chars</span>
      {executionTimeMs !== null ? <span>{executionTimeMs.toFixed(1)} ms</span> : null}
      <span className={cn("ml-auto font-medium", statusColors[runtimeStatus])}>{statusLabels[runtimeStatus]}</span>
    </div>
  );
}
