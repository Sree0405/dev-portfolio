export interface FormatterDefinition {
  id: string;
  displayName: string;
  languageIds: string[];
  format: (source: string) => Promise<string>;
}
