import { featuresConfig as features } from "../../config/features.config.js";
import { schoolConfig } from "../../config/school.config.js";

/* Simple brand glyphs (lucide no longer ships brand icons). 24x24, filled. */
const glyphs = {
  facebook: {
    label: "Facebook",
    d: "M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21h3z",
  },
  instagram: {
    label: "Instagram",
    d: "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm0 1.8A3.2 3.2 0 0 0 4.8 8v8A3.2 3.2 0 0 0 8 19.2h8a3.2 3.2 0 0 0 3.2-3.2V8A3.2 3.2 0 0 0 16 4.8H8zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4zm4.9-2.6a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1z",
  },
  youtube: {
    label: "YouTube",
    d: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z",
  },
  x: {
    label: "X (Twitter)",
    d: "M17.8 3h3.1l-6.7 7.7L22 21h-6.1l-4.8-6.2L5.6 21H2.5l7.2-8.2L2 3h6.3l4.3 5.7L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z",
  },
  tiktok: {
    label: "TikTok",
    d: "M16.6 3c.3 2.3 1.6 3.8 3.9 3.9v3a7 7 0 0 1-3.8-1.2v6.1a5.8 5.8 0 1 1-5.8-5.8c.3 0 .6 0 .9.1v3.1a2.8 2.8 0 1 0 1.9 2.6V3h2.9z",
  },
};

/** Returns the social links that are configured. Empty when none, or when the feature is off. */
export function getSocialLinks() {
  if (!features.socialMedia) return [];
  return Object.entries(schoolConfig.school.social)
    .filter(([key, url]) => url && glyphs[key])
    .map(([key, url]) => ({ key, url, ...glyphs[key] }));
}

/** Icon row. Renders nothing when no social links are configured, so there are never empty icons. */
export default function SocialLinks({ tone = "light", className = "" }) {
  const links = getSocialLinks();
  if (!links.length) return null;
  const style =
    tone === "dark"
      ? "border-on-dark/30 text-on-dark hover:bg-on-dark/10"
      : "border-line text-link hover:bg-primary hover:text-on-primary";
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`} aria-label="Social media">
      {links.map(({ key, url, label, d }) => (
        <li key={key}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${schoolConfig.school.name} on ${label}`}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${style}`}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d={d} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
