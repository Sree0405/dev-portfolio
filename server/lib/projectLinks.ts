export function parseProjectLinks(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((link) => link.trim())
    .filter(Boolean);
}

export function normalizeProjectLinks(raw: string | null | undefined): string | null {
  const links = parseProjectLinks(raw);
  return links.length > 0 ? links.join(", ") : null;
}

export function ensureUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}
