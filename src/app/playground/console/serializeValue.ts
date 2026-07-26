import type { SerializedValue } from "../types";

const MAX_DEPTH = 4;
const MAX_KEYS = 50;
const MAX_ARRAY_ITEMS = 100;

function truncatePreview(value: string, max = 120): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max)}…`;
}

export function serializeValue(value: unknown, depth = 0, seen = new WeakSet<object>()): SerializedValue {
  if (value === null) {
    return { type: "null", value: "null", preview: "null" };
  }

  const valueType = typeof value;

  if (valueType === "undefined") {
    return { type: "undefined", value: "undefined", preview: "undefined" };
  }

  if (valueType === "string") {
    const stringValue = value as string;
    return { type: "string", value: stringValue, preview: `"${truncatePreview(stringValue)}"` };
  }

  if (valueType === "number" || valueType === "boolean" || valueType === "bigint") {
    const primitive = String(value);
    return { type: valueType as SerializedValue["type"], value: primitive, preview: primitive };
  }

  if (valueType === "symbol") {
    const symbolValue = (value as symbol).toString();
    return { type: "symbol", value: symbolValue, preview: symbolValue };
  }

  if (valueType === "function") {
    const fn = value as { name?: string };
    const preview = `[Function${fn.name ? `: ${fn.name}` : ""}]`;
    return { type: "function", value: preview, preview };
  }

  if (value instanceof Error) {
    return {
      type: "error",
      value: value.message,
      preview: `${value.name}: ${value.message}`,
      stack: value.stack,
    };
  }

  if (value instanceof Date) {
    const iso = value.toISOString();
    return { type: "date", value: iso, preview: iso };
  }

  if (Array.isArray(value)) {
    if (depth >= MAX_DEPTH) {
      return { type: "array", value: "[Array]", preview: `Array(${value.length})`, expandable: true };
    }

    const items = value.slice(0, MAX_ARRAY_ITEMS).map((item, index) => ({
      ...serializeValue(item, depth + 1, seen),
      name: String(index),
    }));

    return {
      type: "array",
      value: `Array(${value.length})`,
      preview: `Array(${value.length})`,
      children: items,
      expandable: true,
    };
  }

  if (valueType === "object") {
    const objectValue = value as object;

    if (seen.has(objectValue)) {
      return { type: "object", value: "[Circular]", preview: "[Circular]" };
    }

    seen.add(objectValue);

    if (depth >= MAX_DEPTH) {
      return { type: "object", value: "[Object]", preview: "[Object]", expandable: true };
    }

    const entries = Object.entries(objectValue as Record<string, unknown>).slice(0, MAX_KEYS);
    const children = entries.map(([key, entryValue]) => ({
      ...serializeValue(entryValue, depth + 1, seen),
      name: key,
    }));

    const preview = `{ ${entries.map(([key, entryValue]) => `${key}: ${serializeValue(entryValue, depth + 1, seen).preview}`).join(", ")} }`;

    return {
      type: "object",
      value: "[Object]",
      preview: truncatePreview(preview),
      children,
      expandable: children.length > 0,
    };
  }

  return { type: "unknown", value: String(value), preview: String(value) };
}

export function serializeArgs(args: unknown[]): SerializedValue[] {
  return args.map((arg) => serializeValue(arg));
}
