import type { LucideIcon } from "lucide-react";
import {
  Braces,
  Clock,
  Code2,
  FileCode2,
  FileText,
  Fingerprint,
  Globe,
  Hash,
  KeyRound,
  QrCode,
  Regex,
  Shield,
} from "lucide-react";

export const DEV_UTILITY_IDS = [
  "json-formatter",
  "jwt-decoder",
  "uuid-generator",
  "base64-codec",
  "url-codec",
  "password-generator",
  "qr-code-generator",
  "unix-timestamp",
  "markdown-preview",
  "sql-formatter",
  "html-preview",
  "regex-tester",
] as const;

export type DevUtilityId = (typeof DEV_UTILITY_IDS)[number];

export type DevUtilityCategory = "Data" | "Security" | "Text" | "Web" | "Time";

export interface DevUtilityDefinition {
  id: DevUtilityId;
  name: string;
  description: string;
  category: DevUtilityCategory;
  icon: LucideIcon;
  keywords: string[];
}

export const DEV_UTILITIES: readonly DevUtilityDefinition[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON payloads.",
    category: "Data",
    icon: Braces,
    keywords: ["json", "format", "validate", "pretty", "minify"],
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "Inspect JWT header and payload claims.",
    category: "Security",
    icon: KeyRound,
    keywords: ["jwt", "token", "decode", "auth", "bearer"],
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description: "Generate random UUID v4 identifiers.",
    category: "Data",
    icon: Fingerprint,
    keywords: ["uuid", "guid", "id", "random"],
  },
  {
    id: "base64-codec",
    name: "Base64 Encode / Decode",
    description: "Convert text to and from Base64.",
    category: "Data",
    icon: Hash,
    keywords: ["base64", "encode", "decode", "binary"],
  },
  {
    id: "url-codec",
    name: "URL Encode / Decode",
    description: "Percent-encode or decode URL strings.",
    category: "Web",
    icon: Globe,
    keywords: ["url", "encode", "decode", "uri", "percent"],
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Create strong random passwords.",
    category: "Security",
    icon: Shield,
    keywords: ["password", "generate", "secure", "random"],
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    description: "Generate QR codes from text or URLs.",
    category: "Web",
    icon: QrCode,
    keywords: ["qr", "code", "barcode", "scan"],
  },
  {
    id: "unix-timestamp",
    name: "Unix Timestamp",
    description: "Convert between Unix timestamps and dates.",
    category: "Time",
    icon: Clock,
    keywords: ["unix", "timestamp", "epoch", "date", "time"],
  },
  {
    id: "markdown-preview",
    name: "Markdown Preview",
    description: "Preview rendered Markdown in real time.",
    category: "Text",
    icon: FileText,
    keywords: ["markdown", "md", "preview", "render"],
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    description: "Format and beautify SQL queries.",
    category: "Data",
    icon: Code2,
    keywords: ["sql", "query", "format", "database"],
  },
  {
    id: "html-preview",
    name: "HTML Preview",
    description: "Render HTML snippets in a sandboxed preview.",
    category: "Web",
    icon: FileCode2,
    keywords: ["html", "preview", "markup", "render"],
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "Test regular expressions against sample text.",
    category: "Text",
    icon: Regex,
    keywords: ["regex", "regexp", "pattern", "match", "test"],
  },
] as const;

const utilityMap = new Map(DEV_UTILITIES.map((utility) => [utility.id, utility]));

export function getDevUtility(id: string): DevUtilityDefinition | undefined {
  return utilityMap.get(id as DevUtilityId);
}

export function isDevUtilityId(id: string): id is DevUtilityId {
  return DEV_UTILITY_IDS.includes(id as DevUtilityId);
}
