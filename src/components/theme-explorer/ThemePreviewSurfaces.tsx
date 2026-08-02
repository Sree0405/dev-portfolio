import { ArrowRight, Github } from "lucide-react";
import type { SemanticThemeTokens } from "@/themes/explorationThemes";

/** Mini UI kit rendered inside a scoped exploration theme. */
export function ThemePreviewSurfaces() {
  return (
    <div className="space-y-4">
      {/* Mini navbar */}
      <div
        className="flex items-center justify-between rounded-xl border px-3 py-2"
        style={{
          background: "var(--ex-elevated)",
          borderColor: "var(--ex-border)",
        }}
      >
        <span
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--ex-text-primary)" }}
        >
          Sreekanth
        </span>
        <div className="flex items-center gap-3">
          {["Work", "Skills", "Contact"].map((item) => (
            <span
              key={item}
              className="hidden text-[11px] sm:inline"
              style={{ color: "var(--ex-text-muted)" }}
            >
              {item}
            </span>
          ))}
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{
              background: "var(--ex-badge)",
              color: "var(--ex-badge-text)",
            }}
          >
            Active
          </span>
        </div>
      </div>

      {/* Mini hero */}
      <div
        className="rounded-xl border p-4"
        style={{
          background: "var(--ex-background)",
          borderColor: "var(--ex-border)",
        }}
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "var(--ex-accent)" }}
        >
          Available for full-time
        </p>
        <p
          className="mt-2 font-display text-lg font-semibold leading-tight tracking-tight"
          style={{ color: "var(--ex-text-primary)" }}
        >
          Building production-grade web applications.
        </p>
        <p
          className="mt-2 text-xs leading-relaxed"
          style={{ color: "var(--ex-text-muted)" }}
        >
          React, Next.js, and TypeScript—with APIs when ownership is end-to-end.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium"
            style={{
              background: "var(--ex-btn-primary)",
              color: "var(--ex-btn-primary-text)",
            }}
          >
            Explore projects
            <ArrowRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            className="rounded-lg border px-3 py-1.5 text-xs font-medium"
            style={{
              borderColor: "var(--ex-border)",
              background: "var(--ex-btn-secondary)",
              color: "var(--ex-btn-secondary-text)",
            }}
          >
            Resume
          </button>
        </div>
      </div>

      {/* Buttons + badges + tags */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
          style={{
            background: "var(--ex-btn-primary)",
            color: "var(--ex-btn-primary-text)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--ex-btn-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--ex-btn-primary)";
          }}
        >
          Primary
        </button>
        <button
          type="button"
          className="rounded-lg border px-3 py-1.5 text-xs font-medium"
          style={{
            borderColor: "var(--ex-border)",
            color: "var(--ex-btn-secondary-text)",
          }}
        >
          Secondary
        </button>
        <a
          href="#preview"
          className="text-xs font-medium underline-offset-2 hover:underline"
          style={{ color: "var(--ex-link)" }}
          onClick={(e) => e.preventDefault()}
        >
          Link style
        </a>
        <span
          className="rounded-md px-2 py-0.5 text-[10px] font-medium"
          style={{
            background: "var(--ex-badge)",
            color: "var(--ex-badge-text)",
          }}
        >
          Featured
        </span>
        {["React", "TypeScript"].map((tag) => (
          <span
            key={tag}
            className="rounded-md border px-2 py-0.5 font-mono text-[10px]"
            style={{
              background: "var(--ex-tag)",
              borderColor: "var(--ex-border)",
              color: "var(--ex-tag-text)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Status row */}
      <div className="flex flex-wrap gap-2 text-[10px] font-mono uppercase tracking-wider">
        <span style={{ color: "var(--ex-success)" }}>Success</span>
        <span style={{ color: "var(--ex-warning)" }}>Warning</span>
        <span style={{ color: "var(--ex-error)" }}>Error</span>
      </div>

      {/* Project card */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          background: "var(--ex-surface)",
          borderColor: "var(--ex-border)",
        }}
      >
        <div
          className="flex h-20 items-end p-3"
          style={{
            background: `linear-gradient(135deg, var(--ex-elevated), var(--ex-hover))`,
          }}
        >
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{
              background: "var(--ex-badge)",
              color: "var(--ex-badge-text)",
            }}
          >
            Full-stack
          </span>
        </div>
        <div className="space-y-1.5 p-3">
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--ex-text-primary)" }}
          >
            Sree Dev Tool
          </p>
          <p className="text-xs" style={{ color: "var(--ex-text-muted)" }}>
            Operations platform with modular dashboards.
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["React", "Express", "Prisma"].map((t) => (
              <span
                key={t}
                className="rounded border px-1.5 py-0.5 font-mono text-[9px]"
                style={{
                  borderColor: "var(--ex-border)",
                  color: "var(--ex-tag-text)",
                  background: "var(--ex-tag)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Input + footer strip */}
      <input
        type="text"
        readOnly
        value="sreekanth@example.com"
        className="w-full rounded-lg border px-3 py-2 text-xs outline-none"
        style={{
          background: "var(--ex-elevated)",
          borderColor: "var(--ex-border)",
          color: "var(--ex-text-primary)",
        }}
        aria-label="Sample email input"
      />

      <div
        className="flex items-center justify-between rounded-xl border px-3 py-2"
        style={{
          background: "var(--ex-surface)",
          borderColor: "var(--ex-border)",
        }}
      >
        <span
          className="text-[10px]"
          style={{ color: "var(--ex-text-muted)" }}
        >
          © Sreekanth · Frontend engineer
        </span>
        <Github
          className="h-3.5 w-3.5"
          style={{ color: "var(--ex-text-secondary)" }}
          aria-hidden
        />
      </div>
    </div>
  );
}

export function ThemePaletteSwatches({
  tokens,
}: {
  tokens: SemanticThemeTokens;
}) {
  const swatches: { key: keyof SemanticThemeTokens; label: string }[] = [
    { key: "primary", label: "Primary" },
    { key: "secondary", label: "Secondary" },
    { key: "accent", label: "Accent" },
    { key: "background", label: "Background" },
    { key: "surface", label: "Surface" },
    { key: "elevated", label: "Elevated" },
    { key: "border", label: "Border" },
    { key: "textPrimary", label: "Text" },
    { key: "textSecondary", label: "Secondary text" },
    { key: "textMuted", label: "Muted" },
    { key: "buttonPrimary", label: "Btn primary" },
    { key: "buttonHover", label: "Btn hover" },
    { key: "buttonActive", label: "Btn active" },
    { key: "link", label: "Link" },
    { key: "badge", label: "Badge" },
    { key: "tag", label: "Tag" },
    { key: "success", label: "Success" },
    { key: "warning", label: "Warning" },
    { key: "error", label: "Error" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {swatches.map(({ key, label }) => {
        const value = tokens[key];
        if (!value) return null;
        const isTransparent = value === "transparent";
        return (
          <div key={key} className="min-w-0">
            <div
              className="h-8 w-full rounded-md border"
              style={{
                background: isTransparent ? "repeating-conic-gradient(#80808033 0% 25%, transparent 0% 50%) 0 0 / 8px 8px" : value,
                borderColor: "var(--ex-border)",
                boxShadow: isTransparent
                  ? `inset 0 0 0 1px var(--ex-border)`
                  : undefined,
              }}
              title={value}
            />
            <p
              className="mt-1 truncate text-[9px] font-medium"
              style={{ color: "var(--ex-text-secondary)" }}
            >
              {label}
            </p>
            <p
              className="truncate font-mono text-[8px]"
              style={{ color: "var(--ex-text-muted)" }}
            >
              {isTransparent ? "transparent" : value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
