import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { CaseStudyCodePathLink } from "./tabbed/types";

type CaseStudySummaryProps = {
  problem: string;
  constraints?: string;
  approach: string;
  results: string[];
  reviewable?: string[];
  sourceNote?: string;
  codePath?: CaseStudyCodePathLink[];
};

/**
 * Shared case-study framing — problem → constraints → approach → results.
 */
export function CaseStudySummary({
  problem,
  constraints,
  approach,
  results,
  reviewable,
  sourceNote,
  codePath,
}: CaseStudySummaryProps) {
  return (
    <section
      aria-labelledby="case-study-summary-heading"
      className="mb-8 w-full max-w-full overflow-hidden rounded-2xl border border-primary/25 bg-[hsl(var(--surface))] p-4 text-left shadow-[var(--shadow-soft)] sm:mb-12 sm:p-7"
    >
      <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
        Case study
      </p>
      <h2
        id="case-study-summary-heading"
        className="mt-2.5 break-words font-display text-lg font-semibold tracking-tight text-foreground sm:text-xl"
      >
        Problem, approach, results
      </h2>

      <div className="mt-6 grid w-full max-w-full grid-cols-1 gap-6 md:grid-cols-2">
        <div className="min-w-0 max-w-full">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Problem
          </h3>
          <p className="mt-2.5 break-words text-sm leading-relaxed portfolio-text-muted">
            {problem}
          </p>
          {constraints ? (
            <>
              <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">
                Constraints
              </h3>
              <p className="mt-2.5 break-words text-sm leading-relaxed portfolio-text-muted">
                {constraints}
              </p>
            </>
          ) : null}
        </div>
        <div className="min-w-0 max-w-full">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
            Approach
          </h3>
          <p className="mt-2.5 break-words text-sm leading-relaxed portfolio-text-muted">
            {approach}
          </p>
          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">
            Results
          </h3>
          <ul className="mt-2.5 space-y-2">
            {results.map((item) => (
              <li
                key={item}
                className="flex gap-2 break-words text-sm leading-relaxed text-foreground"
              >
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span className="min-w-0">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {reviewable?.length || sourceNote || codePath?.length ? (
        <div className="mt-8 w-full max-w-full border-t border-primary/15 pt-6">
          {reviewable?.length ? (
            <>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                What&apos;s reviewable
              </h3>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {reviewable.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 break-words text-sm leading-relaxed portfolio-text-muted"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {sourceNote ? (
            <p className="mt-4 break-words rounded-lg border border-primary/15 bg-primary/[0.06] px-3.5 py-3 text-sm leading-relaxed text-foreground/90">
              <span className="font-medium text-primary">Source policy. </span>
              {sourceNote}
            </p>
          ) : null}
          {codePath?.length ? (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Where to review code
              </h3>
              <p className="mt-2 text-sm portfolio-text-muted">
                Clone-and-review paths for this system and related public work.
              </p>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {codePath.map((item) => {
                  const external = item.href.startsWith("http");
                  const className =
                    "group flex h-full flex-col rounded-xl border border-border/60 bg-[hsl(var(--surface-2)/0.55)] p-3.5 text-left transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
                  const body = (
                    <>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        {item.label}
                        <ArrowUpRight
                          className="size-3.5 text-primary/60 transition group-hover:text-primary"
                          aria-hidden
                        />
                      </span>
                      <span className="mt-1.5 text-xs leading-relaxed portfolio-text-muted">
                        {item.note}
                      </span>
                    </>
                  );
                  return (
                    <li key={item.label} className="min-w-0">
                      {external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                        >
                          {body}
                        </a>
                      ) : (
                        <Link to={item.href} className={className}>
                          {body}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
