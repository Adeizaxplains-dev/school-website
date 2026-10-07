import { useEffect } from "react";
import { schoolConfig } from "../config/school.config.js";
import { formatAddress } from "../utils/format.js";
import { toInternational } from "../utils/whatsapp.js";

const { school, seo } = schoolConfig;

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function absolute(path) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return seo.siteUrl ? `${seo.siteUrl}${path.startsWith("/") ? "" : "/"}${path}` : path;
}

/**
 * Keeps the document title and meta tags in sync with the current page.
 * The home page uses seo.title. Other pages use "Page | School name".
 */
export function useSeo({ title, description, path = "/" } = {}) {
  useEffect(() => {
    const isHome = !title;
    const fullTitle = isHome ? seo.title : `${title} | ${school.name}`;
    const desc = description || seo.description;
    const url = seo.siteUrl ? `${seo.siteUrl}${path === "/" ? "" : path}` : "";

    document.title = fullTitle;
    upsertMeta("name", "description", desc);
    upsertMeta("name", "keywords", seo.keywords?.join(", "));
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", school.name);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", absolute(seo.ogImage));
    upsertMeta("name", "twitter:card", seo.ogImage ? "summary_large_image" : "summary");
    upsertCanonical(url);

    // Structured data so search engines understand this is a school
    let ld = document.getElementById("ld-school");
    if (!ld) {
      ld = document.createElement("script");
      ld.id = "ld-school";
      ld.type = "application/ld+json";
      document.head.appendChild(ld);
    }
    const phone = toInternational(school.contact.phone);
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "School",
      name: school.name,
      description: school.description,
      url: seo.siteUrl || undefined,
      logo: school.logo ? absolute(school.logo) : undefined,
      email: school.contact.email || undefined,
      telephone: phone ? `+${phone}` : undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: school.address.street || undefined,
        addressLocality: school.address.area,
        addressRegion: school.address.state,
        addressCountry: "NG",
        description: formatAddress(),
      },
      sameAs: Object.values(school.social).filter(Boolean),
    });
  }, [title, description, path]);
}
