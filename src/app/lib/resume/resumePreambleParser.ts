export interface ResumePreviewTheme {
  fontSizePt: number;
  geometryScale: number;
  parskip: boolean;
  sectionBeforePt: number;
  sectionAfterPt: number;
  sectionRule: boolean;
  listItemSepPt: number;
  listLeftMarginStar: boolean;
  linkColor: string;
}

const DEFAULT_THEME: ResumePreviewTheme = {
  fontSizePt: 10,
  geometryScale: 1,
  parskip: false,
  sectionBeforePt: 4,
  sectionAfterPt: 4,
  sectionRule: false,
  listItemSepPt: 2,
  listLeftMarginStar: false,
  linkColor: "rgb(0, 0.2, 0.6)",
};

function parsePt(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.trim().match(/^([\d.]+)\s*pt$/i);
  return match ? Number.parseFloat(match[1]) : undefined;
}

function parseRgbTriplet(raw: string): string | null {
  const parts = raw.split(",").map((part) => part.trim());
  if (parts.length !== 3) return null;
  const nums = parts.map((part) => Number.parseFloat(part));
  if (nums.some((num) => Number.isNaN(num))) return null;
  return `rgb(${nums.map((num) => (num <= 1 ? Math.round(num * 255) : num)).join(", ")})`;
}

function extractPreamble(source: string): string {
  const docStart = source.indexOf("\\begin{document}");
  return docStart === -1 ? source : source.slice(0, docStart);
}

/** Parse package-driven styling from the original LaTeX preamble/body. */
export function parseResumePreviewTheme(source: string): ResumePreviewTheme {
  const preamble = extractPreamble(source);
  const theme: ResumePreviewTheme = { ...DEFAULT_THEME };

  const classMatch = preamble.match(/\\documentclass(\[[^\]]*\])?\{[^}]+\}/);
  const classOpts = classMatch?.[1] ?? "";
  const ptMatch = classOpts.match(/(\d+)\s*pt/i);
  if (ptMatch) {
    theme.fontSizePt = Number.parseInt(ptMatch[1] ?? "", 10) || theme.fontSizePt;
  }

  const geometryMatch = preamble.match(/\\usepackage\[([^\]]*)\]\{geometry\}/i);
  if (geometryMatch?.[1]) {
    const scaleMatch = geometryMatch[1].match(/scale\s*=\s*([\d.]+)/i);
    if (scaleMatch?.[1]) {
      theme.geometryScale = Number.parseFloat(scaleMatch[1]) || theme.geometryScale;
    }
  }

  if (/\\usepackage(\[[^\]]*\])?\{parskip\}/i.test(preamble)) {
    theme.parskip = true;
  }

  if (/\\usepackage(\[[^\]]*\])?\{titlesec\}/i.test(preamble)) {
    theme.sectionRule = /\\titleformat\{\\section\}[\s\S]*?\[[^\]]*\\titlerule/i.test(preamble);
  }

  const titlespacingMatch = preamble.match(
    /\\titlespacing\{\\section\}\{[^}]*\}\{([^}]*)\}\{([^}]*)\}/i,
  );
  if (titlespacingMatch) {
    theme.sectionBeforePt = parsePt(titlespacingMatch[1]) ?? theme.sectionBeforePt;
    theme.sectionAfterPt = parsePt(titlespacingMatch[2]) ?? theme.sectionAfterPt;
  }

  const itemizeMatch = source.match(/\\begin\{itemize\}\[([^\]]+)\]/i);
  if (itemizeMatch?.[1]) {
    const options = itemizeMatch[1];
    const itemSepMatch = options.match(/itemsep\s*=\s*([^,\]]+)/i);
    if (itemSepMatch?.[1]) {
      theme.listItemSepPt = parsePt(itemSepMatch[1]) ?? theme.listItemSepPt;
    }
    theme.listLeftMarginStar = /leftmargin\s*=\s*\*/i.test(options);
  }

  const colors = new Map<string, string>();
  for (const match of preamble.matchAll(/\\definecolor\{([^}]+)\}\{rgb\}\{([^}]+)\}/gi)) {
    const color = parseRgbTriplet(match[2] ?? "");
    if (color) colors.set(match[1] ?? "", color);
  }

  const hyperMatch = preamble.match(/\\hypersetup\{([^}]+)\}/i);
  if (hyperMatch?.[1]) {
    const urlColorMatch = hyperMatch[1].match(/urlcolor\s*=\s*([a-zA-Z]+)/i);
    const named = urlColorMatch?.[1];
    if (named && colors.has(named)) {
      theme.linkColor = colors.get(named) ?? theme.linkColor;
    }
  } else if (colors.has("linkcolour")) {
    theme.linkColor = colors.get("linkcolour") ?? theme.linkColor;
  }

  return theme;
}

export function themeToCssVariables(theme: ResumePreviewTheme): Record<string, string> {
  const scale = theme.geometryScale;
  const paddingX = `${Math.round(64 * scale)}px`;
  const paddingTop = `${Math.round(24 * scale)}px`;

  return {
    "--preview-font-size": `${theme.fontSizePt * scale}pt`,
    "--preview-padding-x": paddingX,
    "--preview-padding-top": paddingTop,
    "--preview-padding-bottom": paddingX,
    "--preview-link-color": theme.linkColor,
    "--preview-section-before": `${theme.sectionBeforePt}pt`,
    "--preview-section-after": `${theme.sectionAfterPt}pt`,
    "--preview-list-itemsep": `${theme.listItemSepPt}pt`,
  };
}

export function applyPreviewTheme(container: HTMLElement, source: string): void {
  const theme = parseResumePreviewTheme(source);
  const vars = themeToCssVariables(theme);

  for (const [name, value] of Object.entries(vars)) {
    container.style.setProperty(name, value);
  }

  container.classList.add("latex-preview-themed");
  container.classList.toggle("latex-preview-section-rule", theme.sectionRule);
  container.classList.toggle("latex-preview-parskip", theme.parskip);
  container.classList.toggle("latex-preview-list-left-star", theme.listLeftMarginStar);

  container.querySelectorAll("h2").forEach((element) => {
    element.classList.add("latex-preview-section");
  });

  container.querySelectorAll("ul").forEach((element) => {
    element.classList.add("latex-preview-itemize");
  });

  container.querySelectorAll("hr").forEach((element) => {
    element.classList.add("latex-preview-hrule");
  });
}
