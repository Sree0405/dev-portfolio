import type { CompileResult } from "../types";
import { validateJavaScriptSource, validateTypeScriptSource } from "../diagnostics/validateSource";
import { SandboxExecutor } from "./SandboxExecutor";

function compileTypeScript(source: string): CompileResult {
  return validateTypeScriptSource(source);
}

class JavaScriptRuntime extends SandboxExecutor {
  constructor() {
    super("javascript");
  }

  override async compile(source: string) {
    return validateJavaScriptSource(source);
  }

  override async validate(source: string) {
    return validateJavaScriptSource(source);
  }
}

class TypeScriptRuntime extends SandboxExecutor {
  constructor() {
    super("typescript");
  }

  override async compile(source: string) {
    return compileTypeScript(source);
  }

  override async validate(source: string) {
    return validateTypeScriptSource(source);
  }

  override async execute(source: string, context = {}) {
    const compiled = await this.compile(source);
    if (!compiled.success || !compiled.output) {
      return {
        success: false,
        durationMs: compiled.durationMs,
        error: {
          message: compiled.diagnostics[0]?.message ?? "TypeScript compilation failed",
        },
      };
    }

    return super.execute(compiled.output, context);
  }
}

let javascriptRuntime: JavaScriptRuntime | null = null;
let typescriptRuntime: TypeScriptRuntime | null = null;

export function getJavaScriptRuntime(): JavaScriptRuntime {
  if (!javascriptRuntime) {
    javascriptRuntime = new JavaScriptRuntime();
  }
  return javascriptRuntime;
}

export function getTypeScriptRuntime(): TypeScriptRuntime {
  if (!typescriptRuntime) {
    typescriptRuntime = new TypeScriptRuntime();
  }
  return typescriptRuntime;
}

export { compileTypeScript };
