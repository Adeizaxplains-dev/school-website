import { featuresConfig as features } from "../config/features.config.js";
import { schoolConfig } from "../config/school.config.js";
import { whatsappLink } from "./whatsapp.js";

/** Pages shown in the navbar and footer. Disabled pages are removed automatically. */
export function getNavItems() {
  return [
    { label: "Home", to: "/", enabled: true },
    { label: "About", to: "/about", enabled: true },
    { label: "Academics", to: "/academics", enabled: features.academics },
    { label: "Admissions", to: "/admissions", enabled: features.admissions },
    { label: "Gallery", to: "/gallery", enabled: features.gallery },
    { label: "Contact", to: "/contact", enabled: true },
    { label: "Parent Portal", to: "/portal/login", enabled: features.parentPortal },
  ].filter((item) => item.enabled);
}

/**
 * Where an action button should go, based on which features are on.
 * Returns { href } for external links or { to } for in-app routes.
 */
export function getApplyTarget() {
  if (features.onlineApplication && schoolConfig.admissions.applicationUrl) {
    return { href: schoolConfig.admissions.applicationUrl };
  }
  if (features.whatsapp) return { href: whatsappLink("admission") };
  return { to: "/contact" };
}

export function getVisitTarget() {
  if (features.whatsapp) return { href: whatsappLink("visit") };
  return { to: "/contact" };
}

export function getAdmissionsTarget() {
  return features.admissions ? { to: "/admissions" } : getApplyTarget();
}

export function getProgrammeTarget(programme) {
  return features.academics ? { to: `/academics#${programme.id}` } : getApplyTarget();
}
