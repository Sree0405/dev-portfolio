import { memo } from "react";
import { resolveDocIcon } from "./iconMap";
import type { DocTabDefinition, DocTabId } from "./types";

interface DocTabNavProps {
  tabs: DocTabDefinition[];
  activeTab: DocTabId;
  onTabChange: (tab: DocTabId) => void;
}

const DocTabNav = memo(({ tabs, activeTab, onTabChange }: DocTabNavProps) => {
  const visibleTabs = tabs.filter((t) => t.id !== "module");

  return (
    <nav
      aria-label="Documentation sections"
      className="sticky top-[4.25rem] z-20 mb-6 w-full max-w-full border-b border-border bg-background/95 backdrop-blur-md sm:top-20 sm:mb-8"
    >
      <div className="flex w-full max-w-full gap-1 overflow-x-auto overscroll-x-contain py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] sm:py-3 [&::-webkit-scrollbar]:hidden">
        {visibleTabs.map((tab) => {
          const Icon = resolveDocIcon(tab.icon);
          const isActive =
            activeTab === tab.id || (activeTab === "module" && tab.id === "modules");

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm ${
                isActive
                  ? "bg-primary/20 text-primary ring-1 ring-primary/40"
                  : "portfolio-text-muted hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

DocTabNav.displayName = "DocTabNav";

export default DocTabNav;
