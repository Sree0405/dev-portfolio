import { loadLatexJs } from "./loadLatexJs";
import { createLatexPreviewCustomMacros } from "./latexCustomMacros";
import { prepareLatexForPreview } from "./normalizeLatex";
import { applyPreviewTheme } from "./resumePreambleParser";

export interface LatexPreviewError {
  message: string;
  line?: number;
  column?: number;
}

export type LatexRenderResult =
  | { ok: true }
  | { ok: false; error: LatexPreviewError };

export function parseLatexError(error: unknown, source: string): LatexPreviewError {
  const message =
    error instanceof Error ? error.message : "Unable to render LaTeX preview.";

  const lineColumnMatch =
    message.match(/line\s+(\d+)(?:\s*,\s*column\s+(\d+))?/i) ??
    message.match(/at line\s+(\d+)/i) ??
    message.match(/^(\d+):(\d+)/);

  if (lineColumnMatch) {
    return {
      message,
      line: Number.parseInt(lineColumnMatch[1] ?? "", 10) || undefined,
      column: lineColumnMatch[2]
        ? Number.parseInt(lineColumnMatch[2], 10) || undefined
        : undefined,
    };
  }

  const macroMatch = message.match(/unknown macro:\s*(\\[a-zA-Z@]+)/i);
  if (macroMatch?.[1]) {
    const macroAliases: Record<string, string> = {
      "\\rule": "\\hrule",
    };
    const token = macroAliases[macroMatch[1]] ?? macroMatch[1];
    const line = findTokenLine(source, token);
    return { message, line };
  }

  if (/expected\s+\\begin\{document\}/i.test(message)) {
    const preambleTokens = [
      "\\titleformat",
      "\\titlespacing",
      "\\titlerule",
      "\\usepackage",
      "\\definecolor",
      "\\hypersetup",
      "\\geometry",
      "\\pagestyle",
    ];
    for (const token of preambleTokens) {
      const line = findTokenLine(source, token);
      if (line) return { message, line };
    }
  } else if (message.includes("\\begin{document}")) {
    return { message, line: 1 };
  }

  if (/balancing/i.test(message)) {
    const line = findUnbalancedBraceLine(source);
    return { message, line };
  }

  const environmentMatch = message.match(/\\begin\{([^}]+)\}/);
  if (environmentMatch?.[1]) {
    const token = `\\begin{${environmentMatch[1]}}`;
    const line = findTokenLine(source, token);
    return { message, line };
  }

  return { message };
}

function findTokenLine(source: string, token: string): number | undefined {
  const lines = source.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index]?.includes(token)) {
      return index + 1;
    }
  }
  return undefined;
}

function findUnbalancedBraceLine(source: string): number | undefined {
  let depth = 0;
  let line = 1;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === "\n") {
      line += 1;
      continue;
    }

    if (char === "\\") {
      index += 1;
      continue;
    }

    if (char === "{") depth += 1;
    else if (char === "}") depth -= 1;

    if (depth < 0) {
      return line;
    }
  }

  if (depth !== 0) {
    return line;
  }

  return undefined;
}

export async function renderLatexToContainer(
  source: string,
  container: HTMLElement,
): Promise<LatexRenderResult> {
  if (!source.trim() || !/\\begin\{document\}/.test(source)) {
    container.innerHTML = "";
    return { ok: true };
  }

  try {
    const { HtmlGenerator, parse } = await loadLatexJs();
    const prepared = prepareLatexForPreview(source);
    const generator = new HtmlGenerator({
      hyphenate: false,
      CustomMacros: createLatexPreviewCustomMacros(),
    });
    parse(prepared, { generator });

    container.innerHTML = "";
    container.appendChild(generator.domFragment());
    applyPreviewTheme(container, source);
    return { ok: true };
  } catch (previewError) {
    container.innerHTML = "";
    return {
      ok: false,
      error: parseLatexError(previewError, source),
    };
  }
}
