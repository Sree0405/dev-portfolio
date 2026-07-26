import type { RuntimeEngine } from "../runtime/types";

export interface LanguageDefinition {
  id: string;
  displayName: string;
  monacoLanguage: string;
  extension: string;
  defaultCode: string;
  runtimeId: string;
  formatterId?: string;
  getRuntime: () => RuntimeEngine;
}

export interface LanguageRegistration {
  id: string;
  displayName: string;
  monacoLanguage: string;
  extension: string;
  defaultCode: string;
  runtimeId: string;
  formatterId?: string;
}
