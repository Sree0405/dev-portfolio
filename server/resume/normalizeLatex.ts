import { DEFAULT_RESUME_LATEX } from "./defaultTemplate.js";
import { replaceMacroCalls } from "./latexMacroUtils.js";

export function wrapLatexBody(body: string): string {
  return `\\documentclass{article}

\\begin{document}

${body.trim()}

\\end{document}
`;
}

export function stripUnsupportedMacros(source: string): string {
  let result = source;

  result = replaceMacroCalls(result, "textcolor", 2, ([, text]) => text ?? "");
  result = replaceMacroCalls(result, "colorbox", 2, ([, text]) => text ?? "");
  result = replaceMacroCalls(result, "email", 1, ([email]) => email ?? "");
  result = replaceMacroCalls(result, "faIcon", 1, () => "");
  result = replaceMacroCalls(result, "fa", 1, () => "");

  result = result.replace(/\\color\{[^}]*\}/g, "");
  result = result.replace(/\\pagestyle\{[^}]*\}/g, "");
  result = result.replace(/\\setlength\{[^}]+\}\{[^}]+\}/g, "");
  result = result.replace(/\\renewcommand\{[^}]+\}\{[^}]+\}/g, "");
  result = result.replace(/\\newcommand\{[^}]+\}(\[[0-9]+\])?\{[^}]*\}/g, "");

  return result;
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

export function prepareLatexForPreview(source: string | null | undefined): string {
  return stripUnsupportedMacros(normalizeLatexSource(source));
}
