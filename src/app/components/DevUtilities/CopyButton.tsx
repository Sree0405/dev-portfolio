import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/app/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  size?: "sm" | "default";
}

export function CopyButton({ value, label, className, size = "sm" }: CopyButtonProps) {
  const { copy, copied } = useCopyToClipboard();

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      className={cn("gap-1.5", className)}
      onClick={() => void copy(value, label)}
      disabled={!value}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}
