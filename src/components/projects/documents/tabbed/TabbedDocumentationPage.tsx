import { memo, useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { PageTitle } from "@/components/ui/page-title";
import { CaseStudySummary } from "@/components/projects/documents/CaseStudySummary";
import DocTabNav from "./DocTabNav";
import OverviewTab from "./OverviewTab";
import ModulesTab from "./ModulesTab";
import ModuleDetailTab from "./ModuleDetailTab";
import ArchitectureTab from "./ArchitectureTab";
import SecurityTab from "./SecurityTab";
import WorkflowTab from "./WorkflowTab";
import { useDocTabs } from "./useDocTabs";
import type { TabbedDocumentationData } from "./types";

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
      <div className="docs-shell flex min-h-screen items-center justify-center px-4">
        <p className="text-center text-sm text-red-400">{loadError}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="docs-shell flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  const titleWords = data.projectName.trim().split(/\s+/);
  const titleRest = titleWords.length > 1 ? titleWords.pop()! : "";
  const titleAccent = titleWords.join(" ") || data.projectName;

  return (
    <div className="docs-shell min-h-screen bg-gradient-to-br from-background via-primary/5 to-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
        <header className="mb-8 mt-2 w-full max-w-full text-center sm:mb-10 sm:mt-8">
          <PageTitle
            eyebrow="Documentation"
            accent={titleAccent}
            rest={titleRest}
            titleClassName="mb-3 break-words text-[clamp(1.5rem,6vw,2.25rem)]"
          />
          <p className="mx-auto w-full max-w-xl text-sm portfolio-text-muted sm:text-[15px]">
            {data.tagline}
          </p>
          <p className="mx-auto mt-3 w-full max-w-xl text-sm leading-relaxed portfolio-text-muted">
            {data.description}
          </p>

          <div className="docs-tech-row mx-auto mt-5 max-w-xl">
            {data.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex max-w-full items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] leading-none text-primary/80 sm:text-xs"
              >
                {tech}
              </span>
            ))}
            <span className="inline-flex max-w-full items-center rounded-full border border-green-500/30 bg-green-900/20 px-2.5 py-1 text-[11px] leading-none text-green-400 sm:text-xs">
              {data.status}
            </span>
          </div>

          {data.demoUrl || data.githubUrl ? (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {data.demoUrl ? (
                <a
                  href={data.demoUrl}
                  className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary/90"
                >
                  Open Dashboard{" "}
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                </a>
              ) : null}
              {data.githubUrl ? (
                <a
                  href={data.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-lg border border-primary/35 bg-primary/5 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/55 hover:bg-primary/12"
                >
                  View on GitHub{" "}
                  <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
                </a>
              ) : null}
            </div>
          ) : null}
        </header>

        {data.caseStudy ? (
          <div className="w-full max-w-full">
            <CaseStudySummary
              problem={data.caseStudy.problem}
              constraints={data.caseStudy.constraints}
              approach={data.caseStudy.approach}
              results={data.caseStudy.results}
              reviewable={data.caseStudy.reviewable}
              sourceNote={data.caseStudy.sourceNote}
              codePath={data.caseStudy.codePath}
            />
          </div>
        ) : null}

        <DocTabNav tabs={data.tabs} activeTab={activeTab} onTabChange={setTab} />

        <div className="w-full max-w-full min-w-0">{tabContent}</div>

        <footer className="mt-12 w-full max-w-full border-t border-border pt-8 text-center sm:mt-16">
          <p className="text-sm portfolio-text-muted">{data.projectName} Documentation</p>
          <p className="mt-2 text-xs portfolio-text-muted">{data.modules.length} modules</p>
          <div className="docs-tech-row mx-auto mt-3 max-w-xl">
            {data.techStack.map((tech) => (
              <span
                key={`foot-${tech}`}
                className="inline-flex rounded-md border border-border/60 px-2 py-0.5 text-[10px] portfolio-text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
});

TabbedDocumentationPage.displayName = "TabbedDocumentationPage";

export default TabbedDocumentationPage;
