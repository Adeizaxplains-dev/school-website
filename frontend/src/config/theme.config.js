/**
 * THEME CONFIG
 * ------------
 * Gold Success Comprehensive College
 *
 * Centralized branding configuration for the reusable
 * single-school website.
 */

export const themeConfig = {
  colors: {
    // Gold Success Comprehensive College brand
    primary: "#0B5D4B",        // Deep emerald
    secondary: "#D4A72C",      // School gold

    // Primary shades
    primaryDark: "#063D32",
    primaryLight: "#2F8F7A",

    // Gold shades
    secondaryDark: "#7A5A00", // gold for TEXT on light backgrounds (6:1 on cream)
    secondaryLight: "#F3D98A",

    // General UI
    accent: "#FFFFFF",

    // Public-site page background (warm cream) and dashboard background (cool neutral)
    background: "#FFF9E8",
    canvas: "#F3F6F4",

    // Footer / dark sections and the text colour used on them
    dark: "#063D32",
    onDark: "#F7F5EC",

    // White content surfaces
    surface: "#FFFFFF",

    // Dark readable text
    text: "#14201B",
    textLight: "#4A5A53",

    // Borders
    border: "#E7DDBF",
  },

  typography: {
    display:
      "'Lora Variable', 'Lora', Georgia, 'Times New Roman', serif",

    body:
      "'Figtree Variable', 'Figtree', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",

    accent:
      "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  },

  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
};