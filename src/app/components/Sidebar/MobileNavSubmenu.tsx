import { useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MobileNavSubmenuItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
  disabled?: boolean;
}

interface MobileNavSubmenuProps {
  open: boolean;
  onClose: () => void;
  items: readonly MobileNavSubmenuItem[];
  title?: string;
}

export function MobileNavSubmenu({ open, onClose, items, title }: MobileNavSubmenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] md:hidden"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        role="menu"
        aria-label={title ?? "Navigation menu"}
        className="absolute bottom-[calc(100%+0.5rem)] left-1/2 z-50 w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-[0_-8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      >
        {title && (
          <div className="border-b border-border/50 px-4 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
          </div>
        )}

        <ul className="p-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

            if (item.disabled) {
              return (
                <li key={item.to}>
                  <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground/45">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="ml-auto text-[10px] uppercase tracking-wide">Soon</span>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.to}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    navigate(item.to);
                    onClose();
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-foreground hover:bg-muted/60",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

interface MobileNavTriggerProps {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  open?: boolean;
  onClick: () => void;
}

export function MobileNavTrigger({
  label,
  icon: Icon,
  active,
  open,
  onClick,
}: MobileNavTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={label}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1.5 transition-colors",
        active || open
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

interface MobileNavLinkItemProps {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export function MobileNavLinkItem({ label, to, icon: Icon, end }: MobileNavLinkItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      className={({ isActive }) =>
        cn(
          "flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 py-1.5 transition-colors",
          isActive
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground",
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="sr-only">{label}</span>
    </NavLink>
  );
}
