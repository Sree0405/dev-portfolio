import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "@/app/hooks/useCopyToClipboard";
import { getDefaultLanguageId, getLanguage, listLanguages } from "../languages/languageRegistry";
import { getFormatterForLanguage } from "../formatters/formatterRegistry";
import { loadPlaygroundSnapshot, savePlaygroundSnapshot } from "../storage/autoSave";
import { usePlaygroundSettings } from "../settings/usePlaygroundSettings";
import { usePlaygroundExecution } from "./usePlaygroundExecution";
import { useLiveDiagnostics } from "./useLiveDiagnostics";
import type { CursorPosition } from "../types";

export function usePlayground() {
  const snapshot = useMemo(() => loadPlaygroundSnapshot(), []);
  const defaultLanguage = getDefaultLanguageId();
  const initialLanguageId = snapshot?.languageId ?? defaultLanguage;
  const initialCode = snapshot?.code ?? getLanguage(initialLanguageId).defaultCode;

  const [code, setCode] = useState(initialCode);
  const [languageId, setLanguageId] = useState(initialLanguageId);
  const [cursor, setCursor] = useState<CursorPosition>({ line: 1, column: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { settings, updateSettings, toggleSetting } = usePlaygroundSettings(code, languageId);
  const { copy } = useCopyToClipboard();
  const execution = usePlaygroundExecution();
  const liveDiagnostics = useLiveDiagnostics(code, languageId);

  const language = getLanguage(languageId);
  const lineCount = useMemo(() => code.split("\n").length, [code]);
  const characterCount = code.length;

  useEffect(() => {
    execution.clearRuntimeDiagnostics();
  }, [code, languageId, execution.clearRuntimeDiagnostics]);

  useEffect(() => {
    if (!settings.autoSave) return;
    const timer = window.setTimeout(() => {
      savePlaygroundSnapshot({
        code,
        languageId,
        settings,
        updatedAt: Date.now(),
      });
    }, 400);
    return () => window.clearTimeout(timer);
  }, [code, languageId, settings]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        void execution.run(code, languageId);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [code, languageId, execution]);

  const handleLanguageChange = useCallback(
    (nextLanguageId: string) => {
      const nextLanguage = getLanguage(nextLanguageId);
      setLanguageId(nextLanguageId);
      setCode(nextLanguage.defaultCode);
      execution.clearConsole();
      setCursor({ line: 1, column: 1 });
    },
    [execution],
  );

  const formatCode = useCallback(async () => {
    const formatter = getFormatterForLanguage(languageId);
    if (!formatter) {
      toast.error("No formatter registered for this language");
      return;
    }
    try {
      const formatted = await formatter.format(code);
      setCode(formatted.trimEnd());
      toast.success("Code formatted");
    } catch (error) {
      toast.error((error as Error).message || "Failed to format code");
    }
  }, [code, languageId]);

  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `playground${language.extension}`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  }, [code, language.extension]);

  const uploadCode = useCallback((content: string) => {
    setCode(content);
    toast.success("File loaded");
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const element = containerRef.current;
    if (!element) return;

    if (!document.fullscreenElement) {
      await element.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toolbarContext = {
    code,
    languageId,
    isRunning: execution.isRunning,
    wordWrap: settings.wordWrap,
    theme: settings.theme,
    fontSize: settings.fontSize,
    setCode,
    run: () => void execution.run(code, languageId),
    stop: execution.stop,
    clearConsole: execution.clearConsole,
    formatCode,
    copyCode: () => void copy(code, "Code copied"),
    downloadCode,
    uploadCode,
    toggleTheme: () => updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" }),
    setLanguageId: handleLanguageChange,
    toggleWordWrap: () => toggleSetting("wordWrap"),
    toggleFullscreen,
    setFontSize: (size: number) => updateSettings({ fontSize: size }),
  };

  return {
    containerRef,
    code,
    setCode,
    languageId,
    language,
    languages: listLanguages(),
    cursor,
    setCursor,
    lineCount,
    characterCount,
    settings,
    updateSettings,
    isFullscreen,
    toolbarContext,
    execution,
    liveDiagnostics,
    handleLanguageChange,
  };
}
