import { ExternalLink } from "lucide-react";
import { parseProjectLinks, ensureUrl } from "@/app/lib/projectLinks";
import { cn } from "@/lib/utils";

interface ProjectLinksListProps {
  links: string | null | undefined;
  className?: string;
  compact?: boolean;
}

export function ProjectLinksList({ links, className, compact = false }: ProjectLinksListProps) {
  const parsed = parseProjectLinks(links);

  if (parsed.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  if (compact) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {parsed.map((link) => (
          <a
            key={link}
            href={ensureUrl(link)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-[200px] items-center gap-1 truncate text-xs text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            {link}
          </a>
        ))}
      </div>
    );
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {parsed.map((link) => (
        <li key={link}>
          <a
            href={ensureUrl(link)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span className="break-all">{link}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
