import { memo, useState } from "react";
import { Image, ImageOff } from "lucide-react";
import type { ScreenshotItem } from "./types";

interface ScreenshotPlaceholderProps {
  item: ScreenshotItem;
  className?: string;
  /** When false, never requests the image — placeholder only */
  shouldLoad?: boolean;
}

const ScreenshotPlaceholder = memo(({ item, className = "", shouldLoad = false }: ScreenshotPlaceholderProps) => {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(item.src?.trim());
  const showImage = shouldLoad && hasImage && !failed;

  if (showImage) {
    return (
      <figure
        className={`group overflow-hidden rounded-xl border border-border bg-background/40 ${className}`}
      >
        <div className="aspect-video w-full overflow-hidden bg-black/20">
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
        <figcaption className="border-t border-border/50 px-4 py-3">
          <p className="text-sm font-medium text-foreground">{item.label}</p>
          {item.description && (
            <p className="mt-1 text-xs portfolio-text-muted">{item.description}</p>
          )}
        </figcaption>
      </figure>
    );
  }

  const placeholderMessage = failed
    ? "Screenshot failed to load"
    : hasImage && !shouldLoad
      ? "Screenshot available on docs page"
      : hasImage
        ? "Loading screenshot…"
        : "Screenshot placeholder";

  const PlaceholderIcon = failed ? ImageOff : Image;

  return (
    <figure
      className={`flex flex-col overflow-hidden rounded-xl border-2 border-dashed border-primary/25 bg-gradient-to-br from-primary/10 to-blue-900/10 ${className}`}
    >
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 px-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <PlaceholderIcon className="h-7 w-7 text-primary/60" aria-hidden />
        </div>
        <p className="text-center text-sm font-medium portfolio-text-muted">{item.label}</p>
        <p className="text-center text-xs portfolio-text-muted">{placeholderMessage}</p>
        {failed && item.src && (
          <p className="max-w-full truncate text-center font-mono text-[10px] portfolio-text-muted">{item.src}</p>
        )}
      </div>
      {item.description && (
        <figcaption className="border-t border-border/50 px-4 py-3">
          <p className="text-xs portfolio-text-muted">{item.description}</p>
        </figcaption>
      )}
    </figure>
  );
});

ScreenshotPlaceholder.displayName = "ScreenshotPlaceholder";

export default ScreenshotPlaceholder;
