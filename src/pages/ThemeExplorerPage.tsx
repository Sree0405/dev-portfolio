import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";

import Footer from "@/components/Footer";
import { PageShell } from "@/components/portfolio";
import { ThemeCard } from "@/components/theme-explorer/ThemeCard";
import { ThemePreviewSurfaces } from "@/components/theme-explorer/ThemePreviewSurfaces";
import {
  RECOMMENDED_THEME_ID,
  explorationThemes,
  getExplorationTheme,
  tokensToCssVars,
} from "@/themes/explorationThemes";

type PreviewMode = "dark" | "light";

/**
 * Internal design exploration — compares brand identities.
 * Apply Theme is preview-only and does not mutate live portfolio tokens.
 */
export default function ThemeExplorerPage() {
  const [mode, setMode] = useState<PreviewMode>("dark");
  const [activeId, setActiveId] = useState(RECOMMENDED_THEME_ID);

  const activeTheme = useMemo(
    () => getExplorationTheme(activeId) ?? explorationThemes[0],
    [activeId],
  );

  const activeTokens =
    mode === "dark" ? activeTheme.dark : activeTheme.light;
  const stageVars = tokensToCssVars(activeTokens);

  return (
    <div className="relative min-h-screen">
      <PageShell contained className="pb-20 pt-28 sm:pt-32">
        <div className="mb-10 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm portfolio-text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to portfolio
          </Link>

          <p className="section-eyebrow mt-6">Design system</p>
          <h1 className="page-title mt-2">Theme explorer</h1>
          <p className="mt-4 text-base leading-relaxed portfolio-text-muted sm:text-lg">
            Six complete brand identities for comparison. Each palette includes
            dark and light modes, semantic tokens, and live UI previews. Applying
            a theme updates this page only—your live portfolio branding stays
            unchanged.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] portfolio-text-muted">
              Preview mode
            </span>
            <div className="inline-flex rounded-xl border border-border bg-[hsl(var(--surface))] p-1">
              {(["dark", "light"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    mode === m
                      ? "bg-primary text-primary-foreground"
                      : "portfolio-text-muted hover:text-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active stage */}
        <section
          aria-label="Active theme stage"
          className="mb-12 overflow-hidden rounded-2xl border border-border"
          style={stageVars as React.CSSProperties}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4"
            style={{
              background: "var(--ex-elevated)",
              borderColor: "var(--ex-border)",
            }}
          >
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "var(--ex-accent)" }}
              >
                Active preview
              </p>
              <p
                className="mt-1 font-display text-xl font-semibold"
                style={{ color: "var(--ex-text-primary)" }}
              >
                {activeTheme.name}
              </p>
            </div>
            <p
              className="max-w-md text-sm"
              style={{ color: "var(--ex-text-muted)" }}
            >
              {activeTheme.description}
            </p>
          </div>
          <div
            className="grid gap-6 p-5 lg:grid-cols-2 lg:p-8"
            style={{ background: "var(--ex-background)" }}
          >
            <ThemePreviewSurfaces />
            <div
              className="rounded-xl border p-5"
              style={{
                background: "var(--ex-surface)",
                borderColor: "var(--ex-border)",
              }}
            >
              <p
                className="font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: "var(--ex-text-muted)" }}
              >
                Semantic tokens
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                {(
                  [
                    ["primary", activeTokens.primary],
                    ["secondary", activeTokens.secondary],
                    ["accent", activeTokens.accent],
                    ["background", activeTokens.background],
                    ["surface", activeTokens.surface],
                    ["border", activeTokens.border],
                    ["textPrimary", activeTokens.textPrimary],
                    ["link", activeTokens.link],
                  ] as const
                ).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 shrink-0 rounded border"
                      style={{
                        background: value,
                        borderColor: "var(--ex-border)",
                      }}
                    />
                    <div className="min-w-0">
                      <dt
                        className="font-medium"
                        style={{ color: "var(--ex-text-secondary)" }}
                      >
                        {key}
                      </dt>
                      <dd
                        className="truncate font-mono text-[10px]"
                        style={{ color: "var(--ex-text-muted)" }}
                      >
                        {value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Theme grid */}
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {explorationThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              mode={mode}
              active={theme.id === activeId}
              recommended={theme.id === RECOMMENDED_THEME_ID}
              onApply={() => setActiveId(theme.id)}
            />
          ))}
        </div>

        {/* Recommendation */}
        <section className="mt-16 rounded-2xl border border-border bg-[hsl(var(--surface))] p-6 sm:p-8 md:p-10">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" aria-hidden />
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em]">
              Recommendation
            </p>
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Obsidian Teal
          </h2>
          <div className="mt-5 max-w-3xl space-y-4 text-sm leading-relaxed portfolio-text-muted sm:text-base">
            <p>
              Your portfolio already reads as graphite, editorial, and
              product-led—Syne/DM Sans typography, restrained motion, and
              engineering-first content.{" "}
              <strong className="text-foreground">Obsidian Teal</strong> extends
              that language instead of fighting it: cool neutrals keep the
              structured, Linear/Vercel-adjacent calm, while teal replaces the
              cool graphite surfaces with a sharper teal brand signal.
            </p>
            <p>
              <strong className="text-foreground">Why it feels premium:</strong>{" "}
              teal is used as a functional accent (links, badges, CTAs), not a
              glow. Surfaces stay graphite/paper; hierarchy comes from spacing
              and type. That matches how mature product companies brand tools
              (think Stripe-adjacent documentation clarity and Arc-like cool
              focus)—without copying any one brand.
            </p>
            <p>
              <strong className="text-foreground">First impression:</strong>{" "}
              “This engineer ships production software with taste.” Crimson and
              gold read more fashion/luxury; orange reads studio/creative;
              monochrome is excellent but less memorable. Emerald is close, but
              teal pairs cleaner with your existing dark graphite and light paper
              themes.
            </p>
            <p>
              Apply <em>Obsidian Teal</em> above to preview it on this page. When
              you decide to adopt it site-wide, we can map these semantic tokens
              onto the live <code className="font-mono text-xs">.app-canvas</code>{" "}
              brand variables in a focused follow-up.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveId(RECOMMENDED_THEME_ID)}
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-[hsl(var(--primary-light))]"
          >
            Preview recommended theme
          </button>
        </section>
      </PageShell>
      <Footer />
    </div>
  );
}
