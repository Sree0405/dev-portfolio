import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { DocTabId } from "./types";

const VALID_TABS: DocTabId[] = ["overview", "modules", "module", "architecture", "security", "workflow"];

export function useDocTabs(defaultTab: DocTabId = "overview") {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = useMemo(() => {
    const tab = searchParams.get("tab") as DocTabId | null;
    return tab && VALID_TABS.includes(tab) ? tab : defaultTab;
  }, [searchParams, defaultTab]);

  const activeModuleId = searchParams.get("module") ?? null;

  const setTab = useCallback(
    (tab: DocTabId, moduleId?: string | null) => {
      const next = new URLSearchParams(searchParams);
      next.set("tab", tab);

      if (tab === "module" && moduleId) {
        next.set("module", moduleId);
      } else {
        next.delete("module");
      }

      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const openModule = useCallback(
    (moduleId: string) => setTab("module", moduleId),
    [setTab],
  );

  return { activeTab, activeModuleId, setTab, openModule };
}
