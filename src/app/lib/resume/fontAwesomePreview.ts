import { replaceMacroCalls } from "./latexMacroUtils";

export interface FontAwesomePreviewIcon {
  glyph: string;
  label: string;
}

/** Preview-safe replacements for common Font Awesome LaTeX commands. */
export const FONT_AWESOME_PREVIEW_ICONS: Record<string, FontAwesomePreviewIcon> = {
  faGithub: { glyph: "GH", label: "GitHub" },
  faGitHub: { glyph: "GH", label: "GitHub" },
  faGitlab: { glyph: "GL", label: "GitLab" },
  faLinkedin: { glyph: "in", label: "LinkedIn" },
  faLinkedinIn: { glyph: "in", label: "LinkedIn" },
  faEnvelope: { glyph: "✉", label: "Email" },
  faPhone: { glyph: "☎", label: "Phone" },
  faMobile: { glyph: "📱", label: "Mobile" },
  faGlobe: { glyph: "🌐", label: "Website" },
  faLink: { glyph: "🔗", label: "Link" },
  faTwitter: { glyph: "𝕏", label: "Twitter" },
  faX: { glyph: "𝕏", label: "X" },
  faInstagram: { glyph: "IG", label: "Instagram" },
  faFacebook: { glyph: "f", label: "Facebook" },
  faYoutube: { glyph: "▶", label: "YouTube" },
  faMapMarker: { glyph: "📍", label: "Location" },
  faMapMarkerAlt: { glyph: "📍", label: "Location" },
  faCalendar: { glyph: "📅", label: "Calendar" },
  faBriefcase: { glyph: "💼", label: "Work" },
  faGraduationCap: { glyph: "🎓", label: "Education" },
  faCode: { glyph: "Code", label: "Code" },
  faUser: { glyph: "👤", label: "User" },
};

export function normalizeFaMacroName(suffix: string): string {
  const macroName = `fa${suffix}`;
  if (FONT_AWESOME_PREVIEW_ICONS[macroName]) {
    return macroName;
  }

  const match = Object.keys(FONT_AWESOME_PREVIEW_ICONS).find(
    (key) => key.toLowerCase() === macroName.toLowerCase(),
  );
  return match ?? macroName;
}

export function resolveFaMacroName(raw: string): string {
  const cleaned = raw.replace(/[^a-z0-9]/gi, "");
  if (!cleaned) return "faLink";

  const direct = `fa${cleaned}`;
  if (FONT_AWESOME_PREVIEW_ICONS[direct]) return direct;

  const capitalized = `fa${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1).toLowerCase()}`;
  if (FONT_AWESOME_PREVIEW_ICONS[capitalized]) return capitalized;

  const lower = `fa${cleaned.toLowerCase()}`;
  if (FONT_AWESOME_PREVIEW_ICONS[lower]) return lower;

  return capitalized;
}

/** Replace Font Awesome macros with plain preview glyphs (no custom macro needed). */
export function replaceFontAwesomeForPreview(source: string): string {
  let result = source;

  result = replaceMacroCalls(result, "faIcon", 1, ([name]) => {
    const macro = resolveFaMacroName(name);
    const icon = FONT_AWESOME_PREVIEW_ICONS[macro];
    return icon?.glyph ?? "";
  });

  result = result.replace(/\\fa(?!Icon)([A-Za-z0-9]+)/g, (_match, suffix: string) => {
    const macroName = normalizeFaMacroName(suffix);
    const icon = FONT_AWESOME_PREVIEW_ICONS[macroName];
    return icon?.glyph ?? "";
  });

  return result;
}
