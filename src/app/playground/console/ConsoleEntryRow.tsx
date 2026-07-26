import { AlertTriangle, Bug, Clock, Info, Terminal, XCircle } from "lucide-react";
import type { ConsoleEntry } from "../types";
import { ConsoleValueTree } from "./ConsoleValueTree";
import { cn } from "@/lib/utils";

const levelStyles: Record<ConsoleEntry["level"], { icon: typeof Terminal; className: string }> = {
  log: { icon: Terminal, className: "text-zinc-200" },
  info: { icon: Info, className: "text-sky-400" },
  warn: { icon: AlertTriangle, className: "text-amber-400" },
  error: { icon: XCircle, className: "text-red-400" },
  debug: { icon: Bug, className: "text-violet-400" },
  table: { icon: Terminal, className: "text-zinc-200" },
  time: { icon: Clock, className: "text-zinc-400" },
  timeEnd: { icon: Clock, className: "text-emerald-400" },
  clear: { icon: Terminal, className: "text-zinc-500" },
  result: { icon: Terminal, className: "text-emerald-300" },
};

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
}

export interface ConsoleEntryRowProps {
  entry: ConsoleEntry;
  onLineClick?: (line: number) => void;
}

export function ConsoleEntryRow({ entry, onLineClick }: ConsoleEntryRowProps) {
  const style = levelStyles[entry.level];
  const Icon = style.icon;

  if (entry.level === "clear") {
    return (
      <div className="border-y border-zinc-800 py-2 text-center text-xs text-zinc-500">
        Console was cleared
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex gap-2 border-b border-zinc-800/60 px-3 py-1.5 font-mono text-xs hover:bg-zinc-900/60",
        entry.source === "compile" && "bg-red-950/20",
      )}
    >
      <span className="shrink-0 pt-0.5 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100">
        {formatTimestamp(entry.timestamp)}
      </span>
      <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", style.className)} />
      <div className="min-w-0 flex-1">
        {entry.label && (entry.level === "time" || entry.level === "timeEnd") ? (
          <span className={cn("text-xs", style.className)}>
            {entry.level === "timeEnd" ? `${entry.label}: ${entry.duration?.toFixed(2)}ms` : `${entry.label}`}
          </span>
        ) : (
          <ConsoleValueTree values={entry.args} />
        )}
        {entry.stack ? (
          <button
            type="button"
            onClick={() => onLineClick?.(1)}
            className="mt-1 block whitespace-pre-wrap text-left text-[11px] text-red-400/80 hover:text-red-300"
          >
            {entry.stack}
          </button>
        ) : null}
      </div>
    </div>
  );
}
