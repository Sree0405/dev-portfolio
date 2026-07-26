import { useCallback, useEffect, useRef } from "react";
import Editor, { loader, type Monaco, type OnChange, type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import * as monaco from "monaco-editor";
import type { DiagnosticMarker, PlaygroundTheme } from "../types";
import { getEditorTheme } from "./themeRegistry";

loader.config({ monaco });

export interface MonacoEditorProps {
  value: string;
  language: string;
  theme: PlaygroundTheme;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  readOnly?: boolean;
  diagnostics?: DiagnosticMarker[];
  onChange?: (value: string) => void;
  onCursorChange?: (position: { line: number; column: number }) => void;
  className?: string;
}

function applyDiagnostics(monacoInstance: Monaco, model: editor.ITextModel, diagnostics: DiagnosticMarker[]) {
  const markers: editor.IMarkerData[] = diagnostics.map((diagnostic) => ({
    startLineNumber: diagnostic.startLineNumber,
    startColumn: diagnostic.startColumn,
    endLineNumber: diagnostic.endLineNumber,
    endColumn: diagnostic.endColumn,
    message: diagnostic.message,
    severity:
      diagnostic.severity === "error"
        ? monacoInstance.MarkerSeverity.Error
        : diagnostic.severity === "warning"
          ? monacoInstance.MarkerSeverity.Warning
          : monacoInstance.MarkerSeverity.Info,
  }));

  monacoInstance.editor.setModelMarkers(model, "playground", markers);
}

export function MonacoEditor({
  value,
  language,
  theme,
  fontSize,
  tabSize,
  wordWrap,
  lineNumbers,
  minimap,
  readOnly = false,
  diagnostics = [],
  onChange,
  onCursorChange,
  className,
}: MonacoEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleMount: OnMount = (editorInstance, monacoInstance) => {
    editorRef.current = editorInstance;
    monacoRef.current = monacoInstance;

    editorInstance.onDidChangeCursorPosition((event) => {
      onCursorChange?.({
        line: event.position.lineNumber,
        column: event.position.column,
      });
    });

    const model = editorInstance.getModel();
    if (model) {
      applyDiagnostics(monacoInstance, model, diagnostics);
    }
  };

  useEffect(() => {
    const model = editorRef.current?.getModel();
    if (model && monacoRef.current) {
      applyDiagnostics(monacoRef.current, model, diagnostics);
    }
  }, [diagnostics]);

  const handleChange: OnChange = useCallback(
    (nextValue) => {
      onChange?.(nextValue ?? "");
    },
    [onChange],
  );

  const monacoTheme = getEditorTheme(theme).monacoTheme;

  return (
    <div className={className}>
      <Editor
        height="100%"
        language={language}
        theme={monacoTheme}
        value={value}
        onChange={handleChange}
        onMount={handleMount}
        options={{
          automaticLayout: true,
          fontSize,
          tabSize,
          wordWrap: wordWrap ? "on" : "off",
          lineNumbers: lineNumbers ? "on" : "off",
          minimap: { enabled: minimap },
          scrollBeyondLastLine: false,
          readOnly,
          folding: true,
          bracketPairColorization: { enabled: true },
          renderValidationDecorations: "on",
          formatOnType: false,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
}
