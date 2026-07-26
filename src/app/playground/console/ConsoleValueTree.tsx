import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { SerializedValue } from "../types";
import { cn } from "@/lib/utils";

function ValuePreview({ value }: { value: SerializedValue }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = Boolean(value.expandable && value.children && value.children.length > 0);

  if (!hasChildren) {
    return (
      <span
        className={cn(
          "font-mono text-xs",
          value.type === "string" && "text-emerald-400",
          value.type === "number" && "text-sky-400",
          value.type === "boolean" && "text-amber-400",
          value.type === "null" && "text-zinc-500",
          value.type === "undefined" && "text-zinc-500",
          value.type === "error" && "text-red-400",
        )}
      >
        {value.preview ?? value.value}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="inline-flex items-center gap-1 font-mono text-xs text-zinc-300 hover:text-zinc-100"
      >
        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {value.preview ?? value.value}
      </button>
      {expanded ? (
        <span className="ml-4 border-l border-zinc-700 pl-3">
          {value.children?.map((child, index) => (
            <span key={`${child.name ?? index}-${index}`} className="block py-0.5">
              {child.name !== undefined ? (
                <span className="mr-2 font-mono text-xs text-violet-400">{child.name}: </span>
              ) : null}
              <ValuePreview value={child} />
            </span>
          ))}
        </span>
      ) : null}
    </span>
  );
}

export function ConsoleValueTree({ values }: { values: SerializedValue[] }) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
      {values.map((value, index) => (
        <ValuePreview key={`${value.type}-${index}`} value={value} />
      ))}
    </span>
  );
}
