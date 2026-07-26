import { memo, useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";
import DocTabNav from "./DocTabNav";
import OverviewTab from "./OverviewTab";
import ModulesTab from "./ModulesTab";
import ModuleDetailTab from "./ModuleDetailTab";
import ArchitectureTab from "./ArchitectureTab";
import SecurityTab from "./SecurityTab";
import WorkflowTab from "./WorkflowTab";
import { useDocTabs } from "./useDocTabs";
import type { DocTabId, TabbedDocumentationData } from "./types";

const TabbedDocumentationPage = memo(() => {
  const [data, setData] = useState<TabbedDocumentationData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { activeTab, activeModuleId, setTab, openModule } = useDocTabs("overview");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      import("@/data/sreeDevTool.json"),
      import("@/data/devToolScreenshotMap"),
    ])
      .then(([jsonMod, mapMod]) => {
        if (cancelled) return;
        const raw = (jsonMod as { default?: TabbedDocumentationData }).default ?? jsonMod;
        const merged = mapMod.applyDevToolScreenshots(raw as TabbedDocumentationData);
        setData(merged);
        setLoadError(null);
      })
      .catch((err) => {
        console.error("[SreeDevTool docs] Failed to load documentation data:", err);
        if (!cancelled) {
          setLoadError("Failed to load documentation. Please refresh the page.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeModule = useMemo(
    () => data?.modules.find((m) => m.id === activeModuleId) ?? null,
    [data?.modules, activeModuleId],
  );

  const shouldLoadImages = true;

  const tabContent = useMemo(() => {
    if (!data) return null;

    if (activeTab === "module") {
      if (!activeModule) {
        return <ModulesTab modules={data.modules} onModuleSelect={openModule} />;
      }
      return (
        <ModuleDetailTab
          module={activeModule}
          onBack={() => setTab("modules")}
          shouldLoadImages={shouldLoadImages}
        />
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            overview={data.overview}
            modules={data.modules}
            onModuleSelect={openModule}
            shouldLoadImages={shouldLoadImages}
          />
        );
      case "modules":
        return <ModulesTab modules={data.modules} onModuleSelect={openModule} />;
      case "architecture":
        return <ArchitectureTab architecture={data.architecture} />;
      case "security":
        return <SecurityTab security={data.security} />;
      case "workflow":
        return <WorkflowTab workflow={data.workflow} />;
      default:
        return null;
    }
  }, [activeTab, activeModule, data, openModule, setTab, shouldLoadImages]);

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 px-4">
        <p className="text-center text-sm text-red-400">{loadError}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950">
        <div className="h-8 w-8 animate-pulse rounded-full bg-purple-500/30" />
      </div>
    );
  }

  const titleWords = data.projectName.trim().split(/\s+/);
  const titleRest = titleWords.length > 1 ? titleWords.pop()! : "";
  const titleAccent = titleWords.join(" ") || data.projectName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
        <header className="mb-10 mt-4 text-center sm:mt-8">
          <PageTitle
            eyebrow="Documentation"
            accent={titleAccent}
            rest={titleRest}
            titleClassName="mb-3"
          />
          <p className="text-lg text-gray-400 sm:text-xl">{data.tagline}</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500">{data.description}</p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {data.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-purple-500/30 bg-purple-900/30 px-3 py-1 text-xs text-purple-300 sm:text-sm"
              >
                {tech}
              </span>
            ))}
            <span className="rounded-full border border-green-500/30 bg-green-900/20 px-3 py-1 text-xs text-green-400 sm:text-sm">
              {data.status}
            </span>
          </div>

          {data.demoUrl && (
            <a
              href={data.demoUrl}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
            >
              Open Dashboard <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </header>

        <DocTabNav tabs={data.tabs} activeTab={activeTab} onTabChange={setTab} />

        <main>{tabContent}</main>

        <footer className="mt-16 border-t border-purple-500/20 pt-8 text-center">
          <p className="text-sm text-gray-500">{data.projectName} Documentation</p>
          <p className="mt-1 text-xs text-gray-600">
            {data.modules.length} modules · {data.techStack.join(" · ")}
          </p>
        </footer>
      </div>
    </div>
  );
});

TabbedDocumentationPage.displayName = "TabbedDocumentationPage";

export default TabbedDocumentationPage;
