import { useCallback, useEffect, useMemo, useState } from "react";
import type { PlaygroundSettings } from "./types";
import { DEFAULT_PLAYGROUND_SETTINGS } from "./defaults";
import { loadPlaygroundSnapshot, savePlaygroundSnapshot } from "../storage/autoSave";

const SETTINGS_STORAGE_KEY = "playground:settings";

function loadSettings(): PlaygroundSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_PLAYGROUND_SETTINGS;
    return { ...DEFAULT_PLAYGROUND_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PLAYGROUND_SETTINGS;
  }
}

function persistSettings(settings: PlaygroundSettings) {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function usePlaygroundSettings(initialCode: string, initialLanguageId: string) {
  const snapshot = useMemo(() => loadPlaygroundSnapshot(), []);
  const [settings, setSettingsState] = useState<PlaygroundSettings>(() => ({
    ...loadSettings(),
    ...(snapshot?.settings as Partial<PlaygroundSettings> | undefined),
  }));

  const updateSettings = useCallback((patch: Partial<PlaygroundSettings>) => {
    setSettingsState((current) => {
      const next = { ...current, ...patch };
      persistSettings(next);
      return next;
    });
  }, []);

  const toggleSetting = useCallback(<K extends keyof PlaygroundSettings>(key: K) => {
    setSettingsState((current) => {
      const value = current[key];
      const nextValue = typeof value === "boolean" ? !value : value;
      const next = { ...current, [key]: nextValue };
      persistSettings(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!settings.autoSave) return;
    savePlaygroundSnapshot({
      code: initialCode,
      languageId: initialLanguageId,
      settings,
      updatedAt: Date.now(),
    });
  }, [initialCode, initialLanguageId, settings]);

  return { settings, updateSettings, toggleSetting };
}
