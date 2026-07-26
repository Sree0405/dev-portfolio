import { Minus, Plus } from "lucide-react";
import { listLanguages } from "../languages/languageRegistry";
import type { ToolbarActionContext } from "./types";
import { listToolbarActionsByGroup } from "./toolbarActionRegistry";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import "./defaultActions";
import { Sun } from "./defaultActions";

export interface PlaygroundToolbarProps {
  context: ToolbarActionContext & { wordWrap?: boolean; theme?: "light" | "dark"; fontSize?: number };
  onLanguageChange: (languageId: string) => void;
  onFontSizeChange: (size: number) => void;
  onToggleConsole: () => void;
  consoleCollapsed: boolean;
}

function ActionButton({
  label,
  icon,
  disabled,
  active,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-7 gap-1.5 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100",
        active && "bg-zinc-800 text-zinc-100",
      )}
      title={label}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </Button>
  );
}

export function PlaygroundToolbar({
  context,
  onLanguageChange,
  onFontSizeChange,
  onToggleConsole,
  consoleCollapsed,
}: PlaygroundToolbarProps) {
  const languages = listLanguages();
  const executionActions = listToolbarActionsByGroup("execution");
  const fileActions = listToolbarActionsByGroup("file");
  const viewActions = listToolbarActionsByGroup("view");

  const renderAction = (action: (typeof executionActions)[number]) => {
    if (action.render) {
      return <span key={action.id}>{action.render(context)}</span>;
    }

    const disabled = action.isDisabled?.(context) ?? false;
    const active = action.isActive?.(context) ?? false;

    return (
      <ActionButton
        key={action.id}
        label={action.label}
        icon={
          action.id === "theme"
            ? context.theme === "dark"
              ? action.icon
              : <Sun className="h-3.5 w-3.5" />
            : action.icon
        }
        disabled={disabled}
        active={active}
        onClick={() => action.onClick?.(context)}
      />
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-zinc-800 bg-[#252526] px-2 py-1.5">
      <div className="flex items-center gap-0.5">{executionActions.map(renderAction)}</div>

      <div className="mx-1 h-5 w-px bg-zinc-700" />

      <div className="flex items-center gap-0.5">{fileActions.map(renderAction)}</div>

      <div className="mx-1 h-5 w-px bg-zinc-700" />

      <Select value={context.languageId} onValueChange={onLanguageChange}>
        <SelectTrigger className="h-7 w-[130px] border-zinc-700 bg-zinc-900 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.id} value={language.id}>
              {language.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mx-1 h-5 w-px bg-zinc-700" />

      <div className="flex items-center gap-0.5">{viewActions.map(renderAction)}</div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-400 hover:text-zinc-100"
          onClick={() => onFontSizeChange(Math.max(10, (context.fontSize ?? 14) - 1))}
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-8 text-center text-xs text-zinc-400">{context.fontSize ?? 14}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-zinc-400 hover:text-zinc-100"
          onClick={() => onFontSizeChange(Math.min(24, (context.fontSize ?? 14) + 1))}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-zinc-400 hover:text-zinc-100"
          onClick={onToggleConsole}
        >
          {consoleCollapsed ? "Show Console" : "Hide Console"}
        </Button>
      </div>
    </div>
  );
}
