import prettier from "prettier/standalone";
import prettierBabel from "prettier/plugins/babel";
import prettierEstree from "prettier/plugins/estree";
import prettierTypescript from "prettier/plugins/typescript";
import type { FormatterDefinition } from "./types";

const prettierPlugins = [prettierBabel, prettierEstree, prettierTypescript];

async function formatWithPrettier(source: string, parser: "babel" | "typescript"): Promise<string> {
  return prettier.format(source, {
    parser,
    plugins: prettierPlugins,
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "all",
    printWidth: 100,
  });
}

const formatterRegistry = new Map<string, FormatterDefinition>();

export function registerFormatter(formatter: FormatterDefinition): void {
  formatterRegistry.set(formatter.id, formatter);
}

export function getFormatter(id: string): FormatterDefinition {
  const formatter = formatterRegistry.get(id);
  if (!formatter) {
    throw new Error(`Formatter "${id}" is not registered.`);
  }
  return formatter;
}

export function getFormatterForLanguage(languageId: string): FormatterDefinition | undefined {
  const matches = Array.from(formatterRegistry.values()).filter((formatter) =>
    formatter.languageIds.includes(languageId),
  );
  return matches.find((formatter) => formatter.languageIds.length === 1) ?? matches[0];
}

export function listFormatters(): FormatterDefinition[] {
  return Array.from(formatterRegistry.values());
}

registerFormatter({
  id: "prettier",
  displayName: "Prettier",
  languageIds: ["javascript", "typescript"],
  format: async (source: string) => formatWithPrettier(source, "babel"),
});

registerFormatter({
  id: "prettier-typescript",
  displayName: "Prettier (TypeScript)",
  languageIds: ["typescript"],
  format: async (source: string) => formatWithPrettier(source, "typescript"),
});
