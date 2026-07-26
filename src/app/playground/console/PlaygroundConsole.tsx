import { useEffect, useMemo, useRef } from "react";
import { Filter, Trash2 } from "lucide-react";
import type { ConsoleEntry } from "../types";
import { ConsoleEntryRow } from "./ConsoleEntryRow";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface PlaygroundConsoleProps {
  entries: ConsoleEntry[];
  filter: "all" | "log" | "warn" | "error";
  collapsed?: boolean;
  onFilterChange: (filter: "all" | "log" | "warn" | "error") => void;
  onClear: () => void;
  onLineClick?: (line: number) => void;
  className?: string;
}

export function PlaygroundConsole({
  entries,
  filter,
  collapsed = false,
  onFilterChange,
  onClear,
  onLineClick,
  className,
}: PlaygroundConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredEntries = useMemo(() => {
    if (filter === "all") return entries;
    if (filter === "log") {
      return entries.filter((entry) => ["log", "info", "debug", "result", "table", "time", "timeEnd"].includes(entry.level));
    }
    return entries.filter((entry) => entry.level === filter);
  }, [entries, filter]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [filteredEntries]);

  if (collapsed) {
    return null;
  }

  return (
    <div className={cn("flex h-full flex-col bg-[#1e1e1e] text-zinc-200", className)}>
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
          <Filter className="h-3.5 w-3.5" />
          Console
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">{filteredEntries.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(value) => onFilterChange(value as PlaygroundConsoleProps["filter"])}>
            <SelectTrigger className="h-7 w-[110px] border-zinc-700 bg-zinc-900 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="log">Logs</SelectItem>
              <SelectItem value="warn">Warnings</SelectItem>
              <SelectItem value="error">Errors</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-zinc-100" onClick={onClear}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
        {filteredEntries.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-zinc-500">
            Run code to see console output
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <ConsoleEntryRow key={entry.id} entry={entry} onLineClick={onLineClick} />
          ))
        )}
      </div>
    </div>
  );
}
