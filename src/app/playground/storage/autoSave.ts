import type { PlaygroundSnapshot } from "../types";

const SNAPSHOT_STORAGE_KEY = "playground:snapshot";

export function loadPlaygroundSnapshot(): PlaygroundSnapshot | null {
  try {
    const raw = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlaygroundSnapshot;
  } catch {
    return null;
  }
}

export function savePlaygroundSnapshot(snapshot: PlaygroundSnapshot): void {
  localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearPlaygroundSnapshot(): void {
  localStorage.removeItem(SNAPSHOT_STORAGE_KEY);
}
