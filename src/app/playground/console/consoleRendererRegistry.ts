import type { ReactNode } from "react";
import type { ConsoleLogLevel, SerializedValue } from "../types";

export interface ConsoleRendererContext {
  level: ConsoleLogLevel;
  args: SerializedValue[];
  label?: string;
  duration?: number;
  stack?: string;
}

export type ConsoleRenderer = (context: ConsoleRendererContext) => ReactNode;

const consoleRendererRegistry = new Map<ConsoleLogLevel, ConsoleRenderer>();

export function registerConsoleRenderer(level: ConsoleLogLevel, renderer: ConsoleRenderer): void {
  consoleRendererRegistry.set(level, renderer);
}

export function getConsoleRenderer(level: ConsoleLogLevel): ConsoleRenderer | undefined {
  return consoleRendererRegistry.get(level);
}

export function listConsoleRenderers(): Array<{ level: ConsoleLogLevel; renderer: ConsoleRenderer }> {
  return Array.from(consoleRendererRegistry.entries()).map(([level, renderer]) => ({ level, renderer }));
}
