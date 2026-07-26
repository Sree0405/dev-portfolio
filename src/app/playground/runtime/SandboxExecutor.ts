import type { CompileResult, ExecuteResult } from "../types";
import { validateJavaScriptSource } from "../diagnostics/validateSource";
import type { RuntimeConsoleEvent, RuntimeContext, RuntimeEngine, WorkerInboundMessage, WorkerOutboundMessage } from "./types";

function createExecutionId(): string {
  return `exec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export class SandboxExecutor implements RuntimeEngine {
  readonly id: string;
  private worker: Worker | null = null;
  private activeExecutionId: string | null = null;

  constructor(id: string) {
    this.id = id;
  }

  private getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL("./sandbox.worker.ts", import.meta.url), { type: "module" });
    }
    return this.worker;
  }

  async compile(source: string): Promise<CompileResult> {
    return {
      success: true,
      output: source,
      diagnostics: [],
      durationMs: 0,
    };
  }

  async validate(source: string): Promise<CompileResult> {
    return this.compile(source);
  }

  execute(source: string, context: RuntimeContext = {}): Promise<ExecuteResult> {
    const worker = this.getWorker();
    const executionId = createExecutionId();
    this.activeExecutionId = executionId;
    const startedAt = performance.now();

    return new Promise((resolve) => {
      let settled = false;

      const finish = (result: ExecuteResult) => {
        if (settled) return;
        settled = true;
        worker.removeEventListener("message", onMessage);
        context.signal?.removeEventListener("abort", onAbort);
        this.activeExecutionId = null;
        resolve(result);
      };

      const onAbort = () => {
        worker.postMessage({ type: "stop", id: executionId } satisfies WorkerInboundMessage);
        finish({ success: false, durationMs: performance.now() - startedAt, error: { message: "Execution stopped" } });
      };

      const onMessage = (event: MessageEvent<WorkerOutboundMessage>) => {
        const message = event.data;
        if (message.id !== executionId) return;

        switch (message.type) {
          case "console":
            context.onConsole?.(message.event as RuntimeConsoleEvent);
            break;
          case "error":
            finish({
              success: false,
              durationMs: performance.now() - startedAt,
              error: {
                message: message.message,
                stack: message.stack,
                line: message.line,
                column: message.column,
              },
            });
            break;
          case "done":
            finish({ success: true, durationMs: message.durationMs });
            break;
          case "stopped":
            finish({
              success: false,
              durationMs: performance.now() - startedAt,
              error: { message: "Execution stopped" },
            });
            break;
          default:
            break;
        }
      };

      worker.addEventListener("message", onMessage);
      context.signal?.addEventListener("abort", onAbort, { once: true });

      worker.postMessage({ type: "execute", id: executionId, code: source } satisfies WorkerInboundMessage);
    });
  }

  stop(): void {
    if (!this.activeExecutionId || !this.worker) return;
    this.worker.postMessage({ type: "stop", id: this.activeExecutionId } satisfies WorkerInboundMessage);
  }

  dispose(): void {
    if (this.worker) {
      this.worker.postMessage({ type: "dispose" } satisfies WorkerInboundMessage);
      this.worker.terminate();
      this.worker = null;
    }
    this.activeExecutionId = null;
  }
}

export function compileJavaScript(source: string): CompileResult {
  return validateJavaScriptSource(source);
}
