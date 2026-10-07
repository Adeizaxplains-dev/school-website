import { themeConfig } from "../config/theme.config.js";

/* ---------- Colour maths (WCAG relative luminance and contrast) ---------- */

function hexToRgb(hex) {
  let h = String(hex).trim().replace("#", "");

  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const n = parseInt(h, 16);

  return [
    (n >> 16) & 255,
    (n >> 8) & 255,
    n & 255,
  ];
}

function rgbToHex([r, g, b]) {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        Math.round(v)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;

    return c <= 0.03928
      ? c / 12.92
      : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return (
    0.2126 * r +
    0.7152 * g +
    0.0722 * b
  );
}

export function contrastRatio(a, b) {
  const [l1, l2] = [
    luminance(a),
    luminance(b),
  ].sort((x, y) => y - x);

  return (l1 + 0.05) / (l2 + 0.05);
}

function mix(a, b, t) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);

  return rgbToHex([
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t,
  ]);
}

/**
 * Pick whichever of white or near-black has
 * better contrast against the background.
 */
export function readableOn(bg) {
  return contrastRatio(bg, "#FFFFFF") >=
    contrastRatio(bg, "#111111")
    ? "#FFFFFF"
    : "#111111";
}

/**
 * Ensure foreground colour has sufficient contrast
 * against its background.
 */
export function ensureContrast(fg, bg, min = 4.5) {
  if (!fg || !bg) return "#111111";

  if (contrastRatio(fg, bg) >= min) {
    return fg;
  }

  const target =
    luminance(bg) > 0.4
      ? "#000000"
      : "#FFFFFF";

  for (let t = 0.05; t <= 1; t += 0.05) {
    const candidate = mix(fg, target, t);

    if (contrastRatio(candidate, bg) >= min) {
      return candidate;
    }
  }

  return target;
}

/* ---------- Theme to CSS variables ---------- */

/**
 * Turns theme.config.js into the full set of CSS variables the stylesheet and
 * Tailwind utilities rely on. Every foreground colour is checked against the
 * background it is used on, so changing the brand colours cannot silently
 * produce unreadable text.
 */
export function buildThemeVars(theme = themeConfig) {
  const c = theme.colors;
  const cream = c.background;
  const dark = c.dark || c.primaryDark;
  const onDark = c.onDark || "#F7F5EC";

  return {
    /* Brand */
    "--c-primary": c.primary,
    "--c-primary-dark": c.primaryDark,
    "--c-primary-light": c.primaryLight,
    "--c-secondary": c.secondary,
    "--c-secondary-dark": c.secondaryDark,
    "--c-secondary-light": c.secondaryLight,

    /* Surfaces */
    "--c-cream": cream, // public-site page background
    "--c-canvas": c.canvas || "#F3F6F4", // dashboard background (cooler, easier on the eyes for data)
    "--c-surface": c.surface,
    "--c-dark": dark, // footer, hero overlays, dark sections
    "--c-border": c.border,

    /* Text: each one is contrast-checked against where it is used */
    "--c-ink": ensureContrast(c.text, cream, 7),
    "--c-muted": ensureContrast(c.textLight, cream, 4.5),
    "--c-link": ensureContrast(c.primary, cream, 4.5),
    "--c-gold-text": ensureContrast(c.secondaryDark, cream, 4.5), // gold-ish text on LIGHT backgrounds
    "--c-on-primary": readableOn(c.primary),
    "--c-on-secondary": readableOn(c.secondary),
    "--c-on-dark": ensureContrast(onDark, dark, 7),
    "--c-accent-on-dark": ensureContrast(c.secondaryLight, dark, 4.5), // gold text on dark
    "--c-accent-on-primary": ensureContrast(c.secondaryLight, c.primary, 4.5),
    "--c-accent": c.primary, // focus ring colour: visible on cream and white

    /* Typography + shape */
    "--f-display": theme.typography.display,
    "--f-body": theme.typography.body,
    "--r-sm": theme.radius.sm,
    "--r-md": theme.radius.md,
    "--r-lg": theme.radius.lg,
  };
}

export function applyTheme(theme = themeConfig) {
  const root = document.documentElement;
  Object.entries(buildThemeVars(theme)).forEach(([key, value]) => root.style.setProperty(key, value));
}
