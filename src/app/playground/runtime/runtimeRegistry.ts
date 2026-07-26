import type { RuntimeEngine } from "./types";
import { getJavaScriptRuntime, getTypeScriptRuntime } from "./runtimes";

export interface RuntimeRegistration {
  id: string;
  displayName: string;
  factory: () => RuntimeEngine;
}

const runtimeRegistry = new Map<string, RuntimeRegistration>();

export function registerRuntime(registration: RuntimeRegistration): void {
  runtimeRegistry.set(registration.id, registration);
}

export function getRuntime(id: string): RuntimeEngine {
  const registration = runtimeRegistry.get(id);
  if (!registration) {
    throw new Error(`Runtime "${id}" is not registered.`);
  }
  return registration.factory();
}

export function listRuntimes(): RuntimeRegistration[] {
  return Array.from(runtimeRegistry.values()).sort((a, b) => a.displayName.localeCompare(b.displayName));
}

registerRuntime({
  id: "javascript",
  displayName: "JavaScript",
  factory: getJavaScriptRuntime,
});

registerRuntime({
  id: "typescript",
  displayName: "TypeScript",
  factory: getTypeScriptRuntime,
});
