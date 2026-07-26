# Developer Playground

In-browser IDE module for **Sree Dev Tool**. Provides a Monaco-based code editor, sandboxed JavaScript/TypeScript execution, a DevTools-style console, live diagnostics, and an extensible registry architecture for future languages and tools.

> **Core docs:** [Sree Dev Tool Architecture](./SREE_DEV_TOOL.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Route & Navigation](#route--navigation)
3. [Architecture](#architecture)
4. [Module Structure](#module-structure)
5. [Registries (Extensibility)](#registries-extensibility)
6. [Runtime & Sandboxing](#runtime--sandboxing)
7. [Live Diagnostics](#live-diagnostics)
8. [Features](#features)
9. [Persistence](#persistence)
10. [Dependencies](#dependencies)
11. [Adding a Language or Tool](#adding-a-language-or-tool)
12. [File Reference](#file-reference)

---

## Overview

The Developer Playground is a **client-only module** — it does not use Prisma, Express API routes, or server-side persistence. All state is stored in the browser via `localStorage`.

Version 1 supports:

- **JavaScript** (ES2022+) — syntax validation + sandboxed execution
- **TypeScript** — live syntax/type diagnostics + compile → execute workflow

The UI is inspired by VS Code / TypeScript Playground / CodeSandbox:

- Resizable editor + console layout
- Toolbar with run/stop, format, file actions, theme, and view controls
- Status bar with cursor position, line/char counts, and runtime status

---

## Route & Navigation

| Item | Value |
|------|-------|
| Frontend route | `/dashboard/playground` |
| Sidebar label | Playground |
| API base | *(none — client-only)* |

Sidebar order: **Dashboard → Projects → Credentials → Resume → Dev Utilities → Playground**

---

## Architecture

```
PlaygroundLayout
│
├── PlaygroundToolbar      ← pluggable actions (toolbarActionRegistry)
├── MonacoEditor           ← syntax, IntelliSense, live error markers
├── PlaygroundConsole      ← log / warn / error / table / timers
└── PlaygroundStatusBar    ← language, cursor, execution stats
│
├── Language Registry      → JavaScript, TypeScript (+ future languages)
├── Runtime Registry       → JS/TS engines (Web Worker sandbox)
├── Formatter Registry     → Prettier (JS/TS)
├── Console Renderer Registry
├── Editor Theme Registry
└── Settings + Auto-save   → localStorage
```

Data flow when the user clicks **Run**:

1. `usePlaygroundExecution` calls the language's runtime `compile()`
2. Compilation errors → Monaco markers + console entries
3. On success → runtime `execute()` sends code to the sandbox Web Worker
4. Worker captures `console.*` output and posts messages back to the UI

Live validation (while typing) runs separately via `useLiveDiagnostics` with a 200ms debounce.

---

## Module Structure

```
src/app/playground/
├── components/
│   └── PlaygroundLayout.tsx       # IDE shell (panels, toolbar, status bar)
├── editor/
│   ├── MonacoEditor.tsx           # Reusable Monaco wrapper
│   └── themeRegistry.ts
├── console/
│   ├── PlaygroundConsole.tsx
│   ├── ConsoleEntryRow.tsx
│   ├── ConsoleValueTree.tsx
│   ├── serializeValue.ts
│   └── consoleRendererRegistry.ts
├── toolbar/
│   ├── PlaygroundToolbar.tsx
│   ├── defaultActions.tsx
│   └── toolbarActionRegistry.ts
├── statusBar/
│   └── PlaygroundStatusBar.tsx
├── runtime/
│   ├── sandbox.worker.ts          # Isolated execution (no eval on main thread)
│   ├── SandboxExecutor.ts
│   ├── runtimes.ts                # JavaScriptRuntime, TypeScriptRuntime
│   └── runtimeRegistry.ts
├── languages/
│   ├── languageRegistry.ts
│   ├── defaultCode.ts
│   └── types.ts
├── formatters/
│   └── formatterRegistry.ts       # Prettier integration
├── diagnostics/
│   └── validateSource.ts          # Browser-safe live validation
├── settings/
│   ├── usePlaygroundSettings.ts
│   └── defaults.ts
├── storage/
│   └── autoSave.ts                # localStorage snapshot
├── hooks/
│   ├── usePlayground.ts
│   ├── usePlaygroundExecution.ts
│   └── useLiveDiagnostics.ts
├── types/
│   └── index.ts
└── index.ts                       # Public API for extensions

src/app/routes/dashboard/playground/
└── DeveloperPlaygroundPage.tsx    # Route entry (renders PlaygroundLayout)
```

---

## Registries (Extensibility)

New languages, runtimes, formatters, and toolbar actions are added through registries — **not** switch statements.

| Registry | Register function | Purpose |
|----------|-------------------|---------|
| Language | `registerLanguage()` | Maps language id → Monaco mode, default code, runtime, formatter |
| Runtime | `registerRuntime()` | Sandboxed execution engine (`compile`, `execute`, `validate`, `dispose`) |
| Formatter | `registerFormatter()` | Code formatting (Prettier plugins, etc.) |
| Toolbar | `registerToolbarAction()` | Pluggable toolbar buttons / controls |
| Console | `registerConsoleRenderer()` | Custom log renderers |
| Theme | `registerEditorTheme()` | Monaco light/dark themes |

Import from the public API:

```typescript
import {
  registerLanguage,
  registerRuntime,
  registerFormatter,
  registerToolbarAction,
} from "@/app/playground";
```

---

## Runtime & Sandboxing

Code is **never** executed with `eval()` on the main thread.

- Execution happens inside `sandbox.worker.ts` (Web Worker)
- Communication uses `postMessage` (console output, errors, completion)
- `RuntimeEngine` interface:

```typescript
interface RuntimeEngine {
  compile(source: string): Promise<CompileResult>;
  execute(source: string, context?: RuntimeContext): Promise<ExecuteResult>;
  validate(source: string): Promise<CompileResult>;
  dispose(): void;
}
```

**TypeScript workflow:** TypeScript → compile → JavaScript → execute in worker.

---

## Live Diagnostics

Live errors appear in Monaco while typing (debounced ~200ms).

| Language | Validation approach |
|----------|---------------------|
| JavaScript | `transpileModule` (syntax errors) — browser-safe, no Node `ts.sys` |
| TypeScript | In-memory `createLanguageService` + minimal lib stub (syntax + type errors) |

> **Note:** Do not use `ts.createCompilerHost()` in the browser — it depends on Node's file system (`ts.sys`) and will throw `useCaseSensitiveFileNames` errors when bundled by Vite.

Implementation: `src/app/playground/diagnostics/validateSource.ts`  
Hook: `src/app/playground/hooks/useLiveDiagnostics.ts`

---

## Features

### Editor (Monaco)

- Syntax highlighting, IntelliSense, bracket matching, folding, minimap
- Light / dark themes
- Font size, tab size, word wrap, line numbers (settings)
- Live error squiggles and hover messages

### Toolbar

Run, Stop, Clear Console, New, Format, Copy, Download, Upload, Theme, Language selector, Font size, Word Wrap, Fullscreen, Show/Hide Console.

Shortcut: **Ctrl+Enter** (or **Cmd+Enter**) to run.

### Console

Captures `console.log`, `info`, `warn`, `error`, `debug`, `table`, `time`, `timeEnd`, `clear`. Supports expandable objects, filtering, timestamps, and auto-scroll.

### File actions

- **New** — reset to language default template
- **Upload** — load `.js`, `.ts`, or `.txt`
- **Download** — save current buffer with correct extension

---

## Persistence

Auto-save stores the playground snapshot in `localStorage`:

| Key | Content |
|-----|---------|
| `playground:snapshot` | Code, language id, settings, timestamp |
| `playground:settings` | Theme, font size, tab size, word wrap, etc. |

Controlled by the **Auto Save** setting (enabled by default).

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `@monaco-editor/react` | Monaco Editor React wrapper |
| `monaco-editor` | VS Code editor core |
| `prettier` | Code formatting (JS/TS) |
| `typescript` | TS compile + live diagnostics (already in devDependencies) |

---

## Adding a Language or Tool

### 1. Register a runtime

```typescript
import { registerRuntime } from "@/app/playground";

registerRuntime({
  id: "python",
  displayName: "Python",
  factory: () => myPythonRuntime, // implements RuntimeEngine
});
```

### 2. Register the language

```typescript
import { registerLanguage } from "@/app/playground";

registerLanguage({
  id: "python",
  displayName: "Python",
  monacoLanguage: "python",
  extension: ".py",
  defaultCode: "# Python playground\nprint('Hello')",
  runtimeId: "python",
  formatterId: "prettier", // optional
});
```

### 3. (Optional) Register a formatter or toolbar action

Use `registerFormatter()` and `registerToolbarAction()` for formatting and UI extensions.

### 4. Update this document

When the language ships, add it to the [Overview](#overview) supported list and note any new runtime/formatting requirements.

---

## File Reference

| File | Role |
|------|------|
| `src/App.tsx` | Route: `/dashboard/playground` |
| `src/app/components/Sidebar/dashboardNavItems.ts` | Sidebar + mobile nav entry |
| `src/app/routes/dashboard/playground/DeveloperPlaygroundPage.tsx` | Page component |
| `src/app/playground/index.ts` | Public module API |
| `src/app/playground/diagnostics/validateSource.ts` | Browser-safe validation |
| `src/app/playground/runtime/sandbox.worker.ts` | Sandboxed code execution |

---

## Future Extensions (Architecture Ready)

The registry design supports adding without major refactors:

- HTML / CSS / JSON / Markdown preview panes
- JSX / TSX / React / Vue / Svelte playgrounds
- Multiple files, tabs, file explorer
- Snippet library, GitHub Gist integration
- Package manager, terminal, debugger, REST/GraphQL explorers

See [Sree Dev Tool — Adding a New Module](./SREE_DEV_TOOL.md#adding-a-new-module-checklist) for the full module onboarding checklist.
