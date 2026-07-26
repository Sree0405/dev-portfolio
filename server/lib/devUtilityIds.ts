/** Keep in sync with src/app/lib/devUtilities/registry.ts */
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

export const MAX_RECENT_UTILITIES = 10;
