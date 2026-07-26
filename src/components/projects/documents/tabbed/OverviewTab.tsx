import { ArrowRight, Lightbulb, Target, Zap } from "lucide-react";
import DocSection from "./DocSection";
import ScreenshotPlaceholder from "./ScreenshotPlaceholder";
import type { DevToolModule, OverviewContent } from "./types";

interface OverviewTabProps {
  overview: OverviewContent;
  modules: DevToolModule[];
  onModuleSelect: (moduleId: string) => void;
  shouldLoadImages?: boolean;
}

export default function OverviewTab({ overview, modules, onModuleSelect, shouldLoadImages = false }: OverviewTabProps) {
  return (
    <div>
      {overview.heroImage && (
        <DocSection icon={Lightbulb} title="Login & Module Overview" description="Single entry point to every module">
          <ScreenshotPlaceholder
            item={{
              id: "login",
              label: "Login Page",
              description: "Session-authenticated entry with demo credentials and module preview",
              src: overview.heroImage,
              alt: "Sree Dev Tool login page",
            }}
            shouldLoad={shouldLoadImages}
            className="max-w-4xl mx-auto"
          />
        </DocSection>
      )}

      <DocSection icon={Lightbulb} title="Why We Built It" description="From a portfolio website to one software that does it all">
        <p className="text-base leading-relaxed text-gray-300 sm:text-lg">{overview.whyBuilt}</p>
      </DocSection>

      <DocSection icon={Target} title="What We Do" description="One platform instead of many separate apps">
        <p className="mb-6 text-base leading-relaxed text-gray-300 sm:text-lg">{overview.whatWeDo}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {overview.highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-purple-500/20 bg-purple-900/10 p-4"
            >
              <h3 className="mb-2 font-semibold text-purple-300">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection icon={Zap} title="How We Do It" description="Architecture and engineering approach">
        <p className="mb-6 text-base leading-relaxed text-gray-300">{overview.howWeDo}</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-400">
              Target Users
            </h3>
            <ul className="space-y-2">
              {overview.targetUsers.map((user) => (
                <li key={user} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="mt-1 text-purple-400">•</span>
                  {user}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-400">
              Platform Goals
            </h3>
            <ul className="space-y-2">
              {overview.platformGoals.map((goal) => (
                <li key={goal} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="mt-1 text-purple-400">•</span>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection
        icon={ArrowRight}
        title="Explore Modules"
        description="Click any module for full documentation"
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((mod) => (
            <button
              key={mod.id}
              type="button"
              onClick={() => onModuleSelect(mod.id)}
              className="group rounded-xl border border-purple-500/20 bg-gray-950/40 p-5 text-left transition-all hover:border-purple-400/50 hover:bg-purple-900/10"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-semibold text-white group-hover:text-purple-200">{mod.name}</h3>
                <span className="shrink-0 rounded-full border border-purple-500/30 px-2 py-0.5 text-[10px] uppercase tracking-wide text-purple-400">
                  {mod.type}
                </span>
              </div>
              <p className="mb-3 text-sm text-gray-500">{mod.tagline}</p>
              <p className="line-clamp-2 text-sm text-gray-400">{mod.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
                View details <ArrowRight className="h-3 w-3" />
              </span>
            </button>
          ))}
        </div>
      </DocSection>
    </div>
  );
}
