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
      className="sticky top-16 z-20 -mx-4 mb-8 border-b border-purple-500/20 bg-gray-950/90 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 sm:top-20"
    >
      <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
        {visibleTabs.map((tab) => {
          const Icon = resolveDocIcon(tab.icon);
          const isActive = activeTab === tab.id || (activeTab === "module" && tab.id === "modules");

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-purple-600/20 text-purple-300 ring-1 ring-purple-500/40"
                  : "text-gray-400 hover:bg-purple-900/20 hover:text-purple-200"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
});

DocTabNav.displayName = "DocTabNav";

export default DocTabNav;
