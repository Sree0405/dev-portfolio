import type { ToolbarActionDefinition } from "./types";

const toolbarActionRegistry = new Map<string, ToolbarActionDefinition>();

export function registerToolbarAction(action: ToolbarActionDefinition): void {
  toolbarActionRegistry.set(action.id, action);
}

export function getToolbarAction(id: string): ToolbarActionDefinition | undefined {
  return toolbarActionRegistry.get(id);
}

export function listToolbarActions(): ToolbarActionDefinition[] {
  return Array.from(toolbarActionRegistry.values()).sort((a, b) => a.order - b.order);
}

export function listToolbarActionsByGroup(group: ToolbarActionDefinition["group"]): ToolbarActionDefinition[] {
  return listToolbarActions().filter((action) => action.group === group);
}
