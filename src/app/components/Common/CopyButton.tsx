import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  variant?: "ghost" | "outline";
  size?: "icon" | "sm";
}

export async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value);
  toast.success("Copied to clipboard");
}

export function CopyButton({
  value,
  label,
  className,
  variant = "ghost",
  size = "icon",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn("shrink-0", className)}
      title={label ? `Copy ${label}` : "Copy"}
      aria-label={label ? `Copy ${label}` : "Copy to clipboard"}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {size === "sm" && label ? <span className="ml-1.5">{label}</span> : null}
    </Button>
  );
}
