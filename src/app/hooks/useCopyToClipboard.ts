import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string, label = "Copied to clipboard") => {
    if (!text) {
      toast.error("Nothing to copy");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(label);
      window.setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      toast.error("Failed to copy");
      return false;
    }
  }, []);

  return { copy, copied };
}
