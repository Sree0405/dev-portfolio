/** TeX dimen keywords that may follow bare macros like \hrule width 5cm height 0.4pt */
const TRAILING_DIMEN_PATTERN =
  /(?:\s+(?:width|height|raise|depth)\s+(?:\{[^{}]*\}|\\[a-zA-Z@]+(?:\{[^{}]*\})?|[^\s\\]+))*/;

export function replaceBareMacro(
  source: string,
  macroName: string,
  replace: () => string,
  options?: { excludeSuffix?: string },
): string {
  const needle = `\\${macroName}`;
  let result = "";
  let cursor = 0;

  while (cursor < source.length) {
    const index = source.indexOf(needle, cursor);
    if (index === -1) {
      result += source.slice(cursor);
      break;
    }

    const exclude = options?.excludeSuffix;
    if (exclude && source.startsWith(`\\${macroName}${exclude}`, index)) {
      result += source.slice(cursor, index + needle.length);
      cursor = index + needle.length;
      continue;
    }

    result += source.slice(cursor, index);
    let pos = index + needle.length;
    const trailing = source.slice(pos).match(TRAILING_DIMEN_PATTERN);
    if (trailing?.[0]) {
      pos += trailing[0].length;
    }

    result += replace();
    cursor = pos;
  }

  return result;
}

export function readBracedArg(
  source: string,
  openBraceIndex: number,
): { value: string; endIndex: number } | null {
  if (source[openBraceIndex] !== "{") return null;

  let depth = 0;
  const start = openBraceIndex + 1;

  for (let i = openBraceIndex; i < source.length; i += 1) {
    const char = source[i];
    if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return { value: source.slice(start, i), endIndex: i + 1 };
      }
    }
  }

  return null;
}

export function replaceMacroCalls(
  source: string,
  macroName: string,
  argCount: number,
  replace: (args: string[]) => string,
): string {
  const needle = `\\${macroName}`;
  let result = "";
  let cursor = 0;

  while (cursor < source.length) {
    const index = source.indexOf(needle, cursor);
    if (index === -1) {
      result += source.slice(cursor);
      break;
    }

    result += source.slice(cursor, index);

    let pos = index + needle.length;
    while (pos < source.length && /\s/.test(source[pos] ?? "")) pos += 1;

    const args: string[] = [];
    let valid = true;

    for (let argIndex = 0; argIndex < argCount; argIndex += 1) {
      const parsed = readBracedArg(source, pos);
      if (!parsed) {
        valid = false;
        break;
      }
      args.push(parsed.value);
      pos = parsed.endIndex;
      while (pos < source.length && /\s/.test(source[pos] ?? "")) pos += 1;
    }

    if (!valid) {
      result += needle;
      cursor = index + needle.length;
      continue;
    }

    result += replace(args);
    cursor = pos;
  }

  return result;
}

export function removeMacroCalls(source: string, macroName: string, argCount: number): string {
  return replaceMacroCalls(source, macroName, argCount, () => "");
}

function skipOptionalBracketArg(source: string, pos: number): number {
  if (source[pos] !== "[") return pos;

  let depth = 0;
  for (let i = pos; i < source.length; i += 1) {
    const char = source[i];
    if (char === "[") depth += 1;
    else if (char === "]") {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }

  return pos;
}

/** Remove `\newcommand`-style definitions without breaking nested `{...}`. */
export function removeCommandDefinitions(source: string): string {
  const commands = ["newcommand", "renewcommand", "providecommand", "DeclareRobustCommand"];
  let result = source;

  for (const command of commands) {
    const needle = `\\${command}`;
    let next = "";
    let cursor = 0;

    while (cursor < result.length) {
      const index = result.indexOf(needle, cursor);
      if (index === -1) {
        next += result.slice(cursor);
        break;
      }

      next += result.slice(cursor, index);
      let pos = index + needle.length;
      while (pos < result.length && /\s/.test(result[pos] ?? "")) pos += 1;

      const nameArg = readBracedArg(result, pos);
      if (!nameArg) {
        next += needle;
        cursor = index + needle.length;
        continue;
      }

      pos = skipOptionalBracketArg(result, nameArg.endIndex);
      while (pos < result.length && /\s/.test(result[pos] ?? "")) pos += 1;

      const bodyArg = readBracedArg(result, pos);
      if (!bodyArg) {
        next += needle;
        cursor = index + needle.length;
        continue;
      }

      cursor = bodyArg.endIndex;
    }

    result = next;
  }

  return removeMacroCalls(result, "setlength", 2);
}

export function stripPreambleDefinitions(source: string): string {
  const documentStart = source.indexOf("\\begin{document}");
  if (documentStart === -1) {
    return removeCommandDefinitions(source);
  }

  const preamble = source.slice(0, documentStart);
  const body = source.slice(documentStart);
  return removeCommandDefinitions(preamble) + body;
}

/** latex.js preview fallback when custom macros are unavailable. */
export function replacePreviewRuleMacros(source: string): string {
  return replaceBareMacro(source, "hrulefill", () => "\\dotfill");
}

/** Remove preview-incompatible preamble commands while preserving document body. */
export function stripPreviewIncompatiblePreamble(source: string): string {
  const documentStart = source.indexOf("\\begin{document}");
  if (documentStart === -1) {
    return source.replace(/\\documentclass(\[[^\]]*\])?\{([^}]+)\}/, "\\documentclass{$2}");
  }

  let preamble = source.slice(0, documentStart);
  const body = source.slice(documentStart);

  preamble = preamble.replace(/\\usepackage(\[[^\]]*\])?\{[^}]+\}/g, "");
  preamble = preamble.replace(/\\definecolor\{[^}]+\}\{[^}]+\}\{[^}]+\}/g, "");
  preamble = preamble.replace(/\\hypersetup\{[^}]+\}/g, "");
  preamble = preamble.replace(
    /\\titleformat\{[^}]*\}\{[^}]*\}\{[^}]*\}\{[^}]*\}\{[^}]*\}(\[[^\]]*\])?/g,
    "",
  );
  preamble = preamble.replace(/\\titlespacing\{[^}]*\}\{[^}]*\}\{[^}]*\}\{[^}]*\}/g, "");
  preamble = preamble.replace(/\\titlerule\b/g, "");
  preamble = preamble.replace(/\\pagestyle\{[^}]*\}/g, "");
  preamble = preamble.replace(/\\documentclass(\[[^\]]*\])?\{([^}]+)\}/, "\\documentclass{$2}");

  return `${preamble}${body}`;
}

export function replaceVspaceForPreview(source: string): string {
  return replaceMacroCalls(source, "vspace", 1, ([amount]) => `\\\\[${amount?.trim() || "4pt"}]`);
}

export function ensureHyperrefForPreview(source: string): string {
  if (/\\usepackage(\[[^\]]*\])?\{hyperref\}/.test(source)) {
    return source;
  }

  if (!/\\href\{|\\url\{/.test(source)) {
    return source;
  }

  return source.replace(/\\begin\{document\}/, "\\usepackage{hyperref}\n\n\\begin{document}");
}

/** Strip enumitem options that latex.js cannot parse in list environments. */
export function sanitizeResumeBodyForPreview(source: string): string {
  let result = source;

  result = result.replace(/\\begin\{(itemize|enumerate|description)\}\[[^\]]*\]/g, "\\begin{$1}");
  result = replaceBareMacro(result, "vfill", () => "");

  return result;
}
