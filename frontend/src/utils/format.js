import { schoolConfig } from "../config/school.config.js";

/** Join the parts of the address that are filled in. */
export function formatAddress(separator = ", ") {
  const a = schoolConfig.school.address;
  return [a.street, a.area, a.lga, a.state, a.country].filter(Boolean).join(separator);
}

/** Short location line, e.g. "Sagamu, Sagamu, Ogun State". */
export function formatLocation() {
  const a = schoolConfig.school.address;
  return [a.area, a.lga, a.state].filter(Boolean).join(", ");
}

/** Split "[some placeholder]" text so the UI can style placeholders subtly if wanted. */
export function isPlaceholder(text) {
  return typeof text === "string" && /^\s*\[.*\]/.test(text);
}

/** Naira currency formatting for invoices, receipts and payment history. */
export function formatNaira(amount = 0) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(
    amount || 0
  );
}

export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export function initialsOf(name = "") {
  return name
    .replace(/[\[\]]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}
