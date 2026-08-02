import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type ExplorationTheme,
  type SemanticThemeTokens,
  tokensToCssVars,
} from "@/themes/explorationThemes";
import {
  ThemePaletteSwatches,
  ThemePreviewSurfaces,
} from "./ThemePreviewSurfaces";

type ThemeCardProps = {
  theme: ExplorationTheme;
  mode: "dark" | "light";
  active: boolean;
  recommended?: boolean;
  onApply: () => void;
};

export function ThemeCard({
  theme,
  mode,
  active,
  recommended,
  onApply,
}: ThemeCardProps) {
  const tokens: SemanticThemeTokens = mode === "dark" ? theme.dark : theme.light;
  const cssVars = tokensToCssVars(tokens);

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border transition-[border-color,box-shadow]",
        active
          ? "border-primary shadow-[var(--shadow-soft)]"
          : "border-border",
      )}
      style={cssVars as React.CSSProperties}
    >
      <div
        className="border-b px-5 py-4"
        style={{
          background: "var(--ex-surface)",
          borderColor: "var(--ex-border)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className="font-display text-lg font-semibold tracking-tight"
                style={{ color: "var(--ex-text-primary)" }}
              >
                {theme.name}
              </h2>
              {recommended ? (
                <span
                  className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    background: "var(--ex-badge)",
                    color: "var(--ex-badge-text)",
                  }}
                >
                  Recommended
                </span>
              ) : null}
            </div>
            <p
              className="mt-1 text-xs font-medium"
              style={{ color: "var(--ex-accent)" }}
            >
              {theme.personality}
            </p>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--ex-text-muted)" }}
            >
              {theme.description}
            </p>
          </div>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
            style={{
              background: "var(--ex-primary)",
              borderColor: "var(--ex-border)",
              color: "var(--ex-btn-primary-text)",
            }}
            aria-hidden
          />
        </div>
      </div>

      <div
        className="flex flex-1 flex-col gap-5 p-5"
        style={{ background: "var(--ex-background)" }}
      >
        <section>
          <p
            className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--ex-text-muted)" }}
          >
            Palette · {mode}
          </p>
          <ThemePaletteSwatches tokens={tokens} />
        </section>

        <section>
          <p
            className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "var(--ex-text-muted)" }}
          >
            Live preview
          </p>
          <ThemePreviewSurfaces />
        </section>

        <button
          type="button"
          onClick={onApply}
          className={cn(
            "mt-auto inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-[background,transform,opacity]",
            active && "ring-2 ring-offset-2",
          )}
          style={{
            background: "var(--ex-btn-primary)",
            color: "var(--ex-btn-primary-text)",
            // ring offset uses exploration bg for contrast
            ["--tw-ring-color" as string]: "var(--ex-accent)",
            ["--tw-ring-offset-color" as string]: "var(--ex-background)",
          }}
        >
          {active ? (
            <>
              <Check className="h-4 w-4" aria-hidden />
              Applied (preview)
            </>
          ) : (
            "Apply Theme"
          )}
        </button>
        <p
          className="text-center text-[11px]"
          style={{ color: "var(--ex-text-muted)" }}
        >
          Preview only — does not change the live portfolio.
        </p>
      </div>
    </article>
  );
}
