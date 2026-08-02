import { useRef, useState } from "react";
import { Download, FileDown, Printer } from "lucide-react";
import { Link } from "react-router-dom";

import { PortfolioButton } from "@/components/portfolio";
import { publicResume } from "@/data/publicResume";

/**
 * Printable HTML resume — interim proof while LaTeX public PDF is parked.
 * Hide site chrome via print utilities on NormalLayout + this page.
 */
export default function PublicResume() {
  const articleRef = useRef<HTMLElement>(null);
  const [exporting, setExporting] = useState(false);

  const downloadPdf = async () => {
    const el = articleRef.current;
    if (!el || exporting) return;
    setExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: [10, 12, 10, 12],
          filename: "Sreekanth_SDE.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(el)
        .save();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="page-container-x pb-16 pt-8 sm:pb-20 sm:pt-10 print:px-0 print:pb-0 print:pt-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
          Online resume · matches Experience SoT
        </p>
        <div className="flex flex-wrap gap-2">
          <PortfolioButton
            type="button"
            variant="secondary"
            className="min-h-10"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" aria-hidden />
            Print
          </PortfolioButton>
          <PortfolioButton
            type="button"
            variant="primary"
            className="min-h-10"
            disabled={exporting}
            onClick={() => void downloadPdf()}
          >
            <FileDown className="h-4 w-4" aria-hidden />
            {exporting ? "Preparing PDF…" : "Download PDF"}
          </PortfolioButton>
          <PortfolioButton asChild variant="ghost" className="min-h-10">
            <a href="/resume/Sreekanth_SDE.pdf" download="Sreekanth_SDE.pdf">
              <Download className="h-4 w-4" aria-hidden />
              Static PDF
            </a>
          </PortfolioButton>
        </div>
      </div>

      <article
        ref={articleRef}
        className="mx-auto max-w-3xl rounded-2xl border border-border bg-[hsl(var(--surface))] px-5 py-8 text-foreground shadow-[var(--shadow-soft)] sm:px-8 sm:py-10 print:max-w-none print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none print:text-black"
      >
        <header className="border-b border-border pb-5 text-center print:border-neutral-300">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {publicResume.name}
          </h1>
          <p className="mt-1.5 text-sm font-medium text-primary print:text-neutral-700">
            {publicResume.headline}
          </p>
          <ul className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs portfolio-text-muted print:text-neutral-600">
            {publicResume.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="underline-offset-2 hover:text-primary hover:underline print:text-neutral-700 print:no-underline"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <section className="mt-6">
          <h2 className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary print:text-neutral-800">
            Summary
          </h2>
          <p className="mt-2 text-sm leading-relaxed portfolio-text-muted print:text-neutral-800">
            {publicResume.summary}
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary print:text-neutral-800">
            Skills
          </h2>
          <dl className="mt-2 space-y-1.5 text-sm">
            {publicResume.skills.map((row) => (
              <div key={row.label} className="sm:flex sm:gap-2">
                <dt className="shrink-0 font-semibold text-foreground print:text-black">
                  {row.label}:
                </dt>
                <dd className="portfolio-text-muted print:text-neutral-800">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs italic portfolio-text-muted print:text-neutral-600">
            {publicResume.skillsNote}
          </p>
        </section>

        <section className="mt-6">
          <h2 className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary print:text-neutral-800">
            Experience
          </h2>
          <div className="mt-3 space-y-5">
            {publicResume.experience.map((job) => (
              <div key={`${job.title}-${job.dates}`}>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 className="text-sm font-semibold text-foreground print:text-black">
                    {job.title} — {job.company}
                  </h3>
                  <p className="shrink-0 font-mono text-xs portfolio-text-muted print:text-neutral-600">
                    {job.dates}
                  </p>
                </div>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed portfolio-text-muted print:text-neutral-800">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary print:text-neutral-800">
            Projects
          </h2>
          <p className="mt-1.5 text-xs portfolio-text-muted print:text-neutral-600">
            Case studies:{" "}
            <a
              href={publicResume.projectsIntro.href}
              className="text-primary underline-offset-2 hover:underline print:text-neutral-800"
            >
              {publicResume.projectsIntro.href.replace("https://", "")}
            </a>
          </p>
          <div className="mt-3 space-y-4">
            {publicResume.projects.map((project) => (
              <div key={project.title}>
                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
                  <h3 className="text-sm font-semibold text-foreground print:text-black">
                    {project.title}
                  </h3>
                  <p className="flex flex-wrap gap-x-2 text-xs text-primary print:text-neutral-700">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-2 hover:underline"
                      >
                        {link.label}
                      </a>
                    ))}
                  </p>
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed portfolio-text-muted print:text-neutral-800">
                  {project.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary print:text-neutral-800">
            Education
          </h2>
          <div className="mt-2 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground print:text-black">
                {publicResume.education.degree}
              </p>
              <p className="text-sm portfolio-text-muted print:text-neutral-800">
                {publicResume.education.school}
              </p>
            </div>
            <p className="font-mono text-xs portfolio-text-muted print:text-neutral-600">
              {publicResume.education.dates}
            </p>
          </div>
        </section>

        <p className="mt-8 text-center text-xs portfolio-text-muted print:hidden">
          Prefer the portfolio narrative?{" "}
          <Link to="/experience" className="text-primary hover:underline">
            Read Experience
          </Link>
        </p>
      </article>
    </div>
  );
}
