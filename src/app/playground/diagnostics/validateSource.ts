import ts from "typescript";
import type { CompileResult, DiagnosticMarker } from "../types";

const PLAYGROUND_LIB = `
declare const console: {
  log(...data: unknown[]): void;
  info(...data: unknown[]): void;
  warn(...data: unknown[]): void;
  error(...data: unknown[]): void;
  debug(...data: unknown[]): void;
  table(data: unknown): void;
  time(label?: string): void;
  timeEnd(label?: string): void;
  clear(): void;
};

declare function setTimeout(handler: (...args: unknown[]) => void, timeout?: number): number;
declare function clearTimeout(id: number): void;
declare function setInterval(handler: (...args: unknown[]) => void, timeout?: number): number;
declare function clearInterval(id: number): void;

declare class Error {
  name: string;
  message: string;
  stack?: string;
  constructor(message?: string);
}

declare class Promise<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2>;
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ): Promise<T | TResult>;
  static resolve<T>(value: T | PromiseLike<T>): Promise<T>;
  static reject<T = never>(reason?: unknown): Promise<T>;
}

declare interface Array<T> {
  length: number;
  [index: number]: T;
  forEach(callbackfn: (value: T, index: number, array: T[]) => void): void;
  map<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[];
  filter(predicate: (value: T, index: number, array: T[]) => unknown): T[];
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
  slice(start?: number, end?: number): T[];
  push(...items: T[]): number;
  pop(): T | undefined;
  includes(searchElement: T): boolean;
  find(predicate: (value: T, index: number, array: T[]) => unknown): T | undefined;
  join(separator?: string): string;
}

declare interface ObjectConstructor {
  keys(o: object): string[];
  values<T>(o: Record<string, T>): T[];
  entries<T>(o: Record<string, T>): [string, T][];
  assign<T, U>(target: T, source: U): T & U;
}
declare const Object: ObjectConstructor;

declare interface JSON {
  parse(text: string): unknown;
  stringify(value: unknown, replacer?: unknown, space?: string | number): string;
}
declare const JSON: JSON;

declare interface Math {
  floor(x: number): number;
  ceil(x: number): number;
  round(x: number): number;
  random(): number;
  max(...values: number[]): number;
  min(...values: number[]): number;
}
declare const Math: Math;

declare interface Date {
  toISOString(): string;
}
declare const Date: {
  new (): Date;
  now(): number;
};
`;

const PLAYGROUND_LIB_FILE = "playground.lib.d.ts";

function mapSeverity(category: ts.DiagnosticCategory): DiagnosticMarker["severity"] {
  switch (category) {
    case ts.DiagnosticCategory.Error:
      return "error";
    case ts.DiagnosticCategory.Warning:
      return "warning";
    default:
      return "info";
  }
}

function mapDiagnostic(diagnostic: ts.Diagnostic, fallbackSource?: ts.SourceFile): DiagnosticMarker {
  const sourceFile = diagnostic.file ?? fallbackSource;
  let startLineNumber = 1;
  let startColumn = 1;
  let endLineNumber = 1;
  let endColumn = 2;

  if (sourceFile && typeof diagnostic.start === "number") {
    const start = sourceFile.getLineAndCharacterOfPosition(diagnostic.start);
    startLineNumber = start.line + 1;
    startColumn = start.character + 1;

    const endPosition =
      typeof diagnostic.length === "number" ? diagnostic.start + diagnostic.length : diagnostic.start + 1;
    const end = sourceFile.getLineAndCharacterOfPosition(endPosition);
    endLineNumber = end.line + 1;
    endColumn = Math.max(end.character + 1, startColumn + 1);
  }

  return {
    startLineNumber,
    startColumn,
    endLineNumber,
    endColumn,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    severity: mapSeverity(diagnostic.category),
  };
}

function buildResult(
  diagnostics: DiagnosticMarker[],
  startedAt: number,
  source: string,
  output?: string,
): CompileResult {
  const hasErrors = diagnostics.some((item) => item.severity === "error");
  return {
    success: !hasErrors,
    output: hasErrors ? undefined : output ?? source,
    diagnostics,
    durationMs: performance.now() - startedAt,
  };
}

function validateWithTranspile(
  source: string,
  fileName: string,
  compilerOptions: ts.CompilerOptions,
): CompileResult {
  const startedAt = performance.now();

  const result = ts.transpileModule(source, {
    fileName,
    compilerOptions,
    reportDiagnostics: true,
  });

  const diagnostics = (result.diagnostics ?? []).map((diagnostic) => mapDiagnostic(diagnostic));
  return buildResult(diagnostics, startedAt, source, result.outputText);
}

function createInMemoryLanguageService(source: string, fileName: string, options: ts.CompilerOptions) {
  const files = new Map<string, string>([
    [PLAYGROUND_LIB_FILE, PLAYGROUND_LIB],
    [fileName, source],
  ]);

  const host: ts.LanguageServiceHost = {
    getCompilationSettings: () => ({
      ...options,
      noLib: true,
      skipLibCheck: true,
    }),
    getScriptFileNames: () => [PLAYGROUND_LIB_FILE, fileName],
    getScriptVersion: () => "1",
    getScriptSnapshot: (name) => {
      const content = files.get(name);
      return content === undefined ? undefined : ts.ScriptSnapshot.fromString(content);
    },
    getCurrentDirectory: () => "/",
    fileExists: (name) => files.has(name),
    readFile: (name) => files.get(name),
    getDefaultLibFileName: () => PLAYGROUND_LIB_FILE,
  };

  return ts.createLanguageService(host, ts.createDocumentRegistry());
}

function validateTypeScriptWithLanguageService(
  source: string,
  fileName: string,
  options: ts.CompilerOptions,
): CompileResult {
  const startedAt = performance.now();
  const service = createInMemoryLanguageService(source, fileName, options);
  const sourceFile = service.getProgram()?.getSourceFile(fileName);

  const diagnostics = [
    ...service.getSyntacticDiagnostics(fileName),
    ...service.getSemanticDiagnostics(fileName),
  ].map((diagnostic) => mapDiagnostic(diagnostic, sourceFile ?? undefined));

  if (diagnostics.some((item) => item.severity === "error")) {
    return buildResult(diagnostics, startedAt, source);
  }

  const transpiled = ts.transpileModule(source, {
    fileName,
    compilerOptions: options,
    reportDiagnostics: true,
  });

  const transpileDiagnostics = (transpiled.diagnostics ?? []).map((diagnostic) => mapDiagnostic(diagnostic));

  if (transpileDiagnostics.some((item) => item.severity === "error")) {
    return buildResult(transpileDiagnostics, startedAt, source);
  }

  return buildResult(diagnostics, startedAt, source, transpiled.outputText);
}

export function validateJavaScriptSource(source: string): CompileResult {
  return validateWithTranspile(source, "playground.js", {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    allowJs: true,
    skipLibCheck: true,
  });
}

export function validateTypeScriptSource(source: string): CompileResult {
  return validateTypeScriptWithLanguageService(source, "playground.ts", {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    noEmit: true,
  });
}

export function validateSource(source: string, languageId: string): CompileResult {
  if (languageId === "typescript") {
    return validateTypeScriptSource(source);
  }
  return validateJavaScriptSource(source);
}
