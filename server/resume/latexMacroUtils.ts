function readBracedArg(source: string, openBraceIndex: number): { value: string; endIndex: number } | null {
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
