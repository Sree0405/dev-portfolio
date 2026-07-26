import { DEFAULT_RESUME_LATEX } from "./defaultTemplate";
import {
  replacePreviewRuleMacros,
  replaceVspaceForPreview,
  sanitizeResumeBodyForPreview,
  stripPreambleDefinitions,
  stripPreviewIncompatiblePreamble,
} from "./latexMacroUtils";
import { replaceFontAwesomeForPreview } from "./fontAwesomePreview";

export function wrapLatexBody(body: string): string {
  return `\\documentclass{article}

\\begin{document}

${body.trim()}

\\end{document}
`;
}

export function normalizeLatexSource(source: string | null | undefined): string {
  const trimmed = (source ?? "").trim();
  if (!trimmed) {
    return DEFAULT_RESUME_LATEX;
  }

  const hasDocument = /\\begin\{document\}/.test(trimmed);

  if (!hasDocument) {
    if (!trimmed.includes("\\documentclass")) {
      return wrapLatexBody(trimmed);
    }
    return DEFAULT_RESUME_LATEX;
  }

  return trimmed;
}

/** Rewrite preview-only macros that latex.js cannot parse. */
export function stripUnsupportedMacros(source: string): string {
  let result = source;

  result = stripPreambleDefinitions(result);

  return result;
}

export function applyTitlesecUnnumberedSections(source: string, originalSource: string): string {
  if (!/\\usepackage(\[[^\]]*\])?\{titlesec\}/i.test(originalSource)) {
    return source;
  }

  return source.replace(/\\section\{/g, "\\section*{");
}

export function prepareLatexForPreview(source: string | null | undefined): string {
  let prepared = normalizeLatexSource(source);
  const original = prepared;
  const needsHyperref = /\\href\{|\\url\{/.test(prepared);

  prepared = stripPreviewIncompatiblePreamble(prepared);

  if (needsHyperref && !/\\usepackage(\[[^\]]*\])?\{hyperref\}/.test(prepared)) {
    prepared = prepared.replace(
      /\\begin\{document\}/,
      "\\usepackage{hyperref}\n\n\\begin{document}",
    );
  }

  prepared = replaceFontAwesomeForPreview(prepared);
  prepared = replacePreviewRuleMacros(prepared);
  prepared = replaceVspaceForPreview(prepared);
  prepared = applyTitlesecUnnumberedSections(prepared, original);
  prepared = sanitizeResumeBodyForPreview(prepared);
  prepared = stripUnsupportedMacros(prepared);
  return prepared;
}

export function isPreviewableLatex(source: string): boolean {
  return Boolean(source.trim()) && /\\begin\{document\}/.test(source);
}
