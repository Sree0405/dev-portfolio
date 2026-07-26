export type ResumePackagePreviewMode = "native" | "emulated" | "glyph";

export interface ResumeSupportedPackage {
  name: string;
  options?: string;
  preview: ResumePackagePreviewMode;
  note: string;
}

export const RESUME_SUPPORTED_PACKAGES: readonly ResumeSupportedPackage[] = [
  {
    name: "geometry",
    options: "scale=0.9",
    preview: "emulated",
    note: "Page margins parsed from the preamble and applied via CSS.",
  },
  {
    name: "parskip",
    preview: "emulated",
    note: "Paragraph spacing applied with .latex-preview-parskip.",
  },
  {
    name: "titlesec",
    preview: "emulated",
    note: "Section formatting and rules emulated; sections render unnumbered in preview.",
  },
  {
    name: "enumitem",
    preview: "emulated",
    note: "List options are stripped; itemsep and leftmargin are emulated in CSS.",
  },
  {
    name: "hyperref",
    preview: "native",
    note: "\\href and \\url links work in preview.",
  },
  {
    name: "xcolor",
    preview: "emulated",
    note: "\\definecolor values are parsed for link and accent colors.",
  },
  {
    name: "fontawesome5",
    preview: "glyph",
    note: "\\fa* icons are replaced with plain glyphs in preview.",
  },
] as const;

export const RESUME_SUPPORTED_PACKAGE_NAMES = RESUME_SUPPORTED_PACKAGES.map((pkg) => pkg.name);

export const RESUME_SUPPORTED_PREAMBLE = String.raw`\documentclass[a4paper,10pt]{article}

\usepackage[scale=0.9]{geometry}
\usepackage{parskip}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage{hyperref}
\usepackage{xcolor}
\usepackage{fontawesome5}

\definecolor{linkcolour}{rgb}{0,0.2,0.6}
\hypersetup{colorlinks,urlcolor=linkcolour}

\titleformat{\section}{\large\bfseries}{}{0em}{}[\titlerule]
\titlespacing{\section}{0pt}{4pt}{4pt}

\pagestyle{empty}`;

export function buildResumeDocument(body: string): string {
  return `${RESUME_SUPPORTED_PREAMBLE}

\\begin{document}

${body.trim()}

\\end{document}
`;
}
