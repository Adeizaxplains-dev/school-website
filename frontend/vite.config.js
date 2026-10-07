import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { schoolConfig } from "./src/config/school.config.js";
import { themeConfig } from "./src/config/theme.config.js";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Writes the school's title, description, Open Graph tags, favicon and theme colour
 * into index.html so search engines and social previews see them before JavaScript runs.
 * Values come straight from the config files, so a new school needs no edits here.
 */
function schoolHead() {
  return {
    name: "school-head",
    transformIndexHtml(html) {
      const { school } = schoolConfig;
      const { seo } = schoolConfig;
      const abs = (p) => (!p ? "" : /^https?:\/\//.test(p) ? p : seo.siteUrl ? seo.siteUrl + p : p);
      const tags = [
        `<title>${esc(seo.title)}</title>`,
        `<meta name="description" content="${esc(seo.description)}" />`,
        seo.keywords?.length ? `<meta name="keywords" content="${esc(seo.keywords.join(", "))}" />` : "",
        `<meta name="theme-color" content="${esc(themeConfig.colors.primary)}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${esc(school.name)}" />`,
        `<meta property="og:title" content="${esc(seo.title)}" />`,
        `<meta property="og:description" content="${esc(seo.description)}" />`,
        seo.siteUrl ? `<meta property="og:url" content="${esc(seo.siteUrl)}" />` : "",
        seo.ogImage ? `<meta property="og:image" content="${esc(abs(seo.ogImage))}" />` : "",
        `<meta name="twitter:card" content="${seo.ogImage ? "summary_large_image" : "summary"}" />`,
        seo.siteUrl ? `<link rel="canonical" href="${esc(seo.siteUrl)}" />` : "",
        school.favicon ? `<link rel="icon" href="${esc(school.favicon)}" />` : "",
      ].filter(Boolean);
      return html.replace("<!-- SCHOOL_HEAD -->", tags.join("\n    "));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), schoolHead()],
});
