import { useMemo } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { MonacoEditor } from "../editor/MonacoEditor";
import { PlaygroundConsole } from "../console/PlaygroundConsole";
import { PlaygroundToolbar } from "../toolbar/PlaygroundToolbar";
import { PlaygroundStatusBar } from "../statusBar/PlaygroundStatusBar";
import { usePlayground } from "../hooks/usePlayground";
import { cn } from "@/lib/utils";

export function PlaygroundLayout() {
  const {
    containerRef,
    code,
    setCode,
    languageId,
    language,
    cursor,
    setCursor,
    lineCount,
    characterCount,
    settings,
    updateSettings,
    toolbarContext,
    execution,
    liveDiagnostics,
    handleLanguageChange,
  } = usePlayground();

  const editorDiagnostics = useMemo(() => {
    const merged = [...liveDiagnostics.diagnostics];
    for (const marker of execution.runtimeDiagnostics) {
      const duplicate = merged.some(
        (item) =>
          item.startLineNumber === marker.startLineNumber &&
          item.startColumn === marker.startColumn &&
          item.message === marker.message,
      );
      if (!duplicate) {
        merged.push(marker);
      }
    }
    return merged;
  }, [liveDiagnostics.diagnostics, execution.runtimeDiagnostics]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex min-h-[calc(100vh-0px)] flex-col bg-[#1e1e1e] md:min-h-screen",
        "md:h-[calc(100vh-0px)]",
      )}
    >
      <PlaygroundToolbar
        context={toolbarContext}
        onLanguageChange={handleLanguageChange}
        onFontSizeChange={(size) => updateSettings({ fontSize: size })}
        onToggleConsole={() => updateSettings({ consoleCollapsed: !settings.consoleCollapsed })}
        consoleCollapsed={settings.consoleCollapsed}
      />

      <div className="min-h-0 flex-1">
        <PanelGroup direction="horizontal" className="h-full">
          <Panel defaultSize={settings.consoleCollapsed ? 100 : 62} minSize={35}>
            <MonacoEditor
              className="h-full"
              value={code}
              language={language.monacoLanguage}
              theme={settings.theme}
              fontSize={settings.fontSize}
              tabSize={settings.tabSize}
              wordWrap={settings.wordWrap}
              lineNumbers={settings.lineNumbers}
              minimap={settings.minimap}
              diagnostics={editorDiagnostics}
              onChange={setCode}
              onCursorChange={setCursor}
            />
          </Panel>

          {!settings.consoleCollapsed ? (
            <>
              <PanelResizeHandle className="w-1 bg-zinc-800 transition-colors hover:bg-sky-600" />
              <Panel defaultSize={38} minSize={20}>
                <PlaygroundConsole
                  entries={execution.entries}
                  filter={settings.consoleFilter}
                  onFilterChange={(filter) => updateSettings({ consoleFilter: filter })}
                  onClear={execution.clearConsole}
                />
              </Panel>
            </>
          ) : null}
        </PanelGroup>
      </div>

      <PlaygroundStatusBar
        languageLabel={language.displayName}
        cursor={cursor}
        lineCount={lineCount}
        characterCount={characterCount}
        executionTimeMs={execution.executionTimeMs}
        runtimeStatus={
          liveDiagnostics.isValidating && execution.runtimeStatus === "idle"
            ? "compiling"
            : execution.runtimeStatus
        }
      />
    </div>
  );
}
