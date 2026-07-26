import type { LanguageDefinition, LanguageRegistration } from "./types";
import { getRuntime } from "../runtime/runtimeRegistry";
import { JAVASCRIPT_DEFAULT, TYPESCRIPT_DEFAULT } from "./defaultCode";

const languageRegistry = new Map<string, LanguageDefinition>();

export function registerLanguage(registration: LanguageRegistration): LanguageDefinition {
  const definition: LanguageDefinition = {
    ...registration,
    getRuntime: () => getRuntime(registration.runtimeId),
  };
  languageRegistry.set(registration.id, definition);
  return definition;
}

export function getLanguage(id: string): LanguageDefinition {
  const language = languageRegistry.get(id);
  if (!language) {
    throw new Error(`Language "${id}" is not registered.`);
  }
  return language;
}

export function listLanguages(): LanguageDefinition[] {
  return Array.from(languageRegistry.values()).sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export function getDefaultLanguageId(): string {
  return "javascript";
}

registerLanguage({
  id: "javascript",
  displayName: "JavaScript",
  monacoLanguage: "javascript",
  extension: ".js",
  defaultCode: JAVASCRIPT_DEFAULT,
  runtimeId: "javascript",
  formatterId: "prettier",
});

registerLanguage({
  id: "typescript",
  displayName: "TypeScript",
  monacoLanguage: "typescript",
  extension: ".ts",
  defaultCode: TYPESCRIPT_DEFAULT,
  runtimeId: "typescript",
  formatterId: "prettier",
});
