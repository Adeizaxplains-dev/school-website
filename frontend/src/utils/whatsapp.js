import { schoolConfig } from "../config/school.config.js";

const { contact } = schoolConfig.school;

/**
 * Convert a phone number to international digits only.
 * "0801 234 5678" -> "2348012345678", "+234 801 234 5678" -> "2348012345678"
 */
export function toInternational(number, countryCode = contact.countryCode) {
  const raw = String(number || "").trim();
  if (!raw) return "";
  const hadPlus = raw.startsWith("+");
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (!hadPlus && digits.startsWith("00")) digits = digits.slice(2);
  else if (!hadPlus && digits.startsWith("0")) digits = countryCode + digits.slice(1);
  return digits;
}

/** Fill {school} in a message template. */
export function fillTemplate(text) {
  return String(text || "").replaceAll("{school}", schoolConfig.school.name);
}

/** Look up a configured message by key ("admission", "visit", "general", "floating"). */
export function getWhatsAppMessage(key = "general") {
  const messages = schoolConfig.whatsapp.messages;
  return fillTemplate(messages[key] || messages.general);
}

/**
 * Build a WhatsApp link. `messageOrKey` can be a key from the config or a custom message.
 * If no number is configured yet, wa.me still opens WhatsApp with the message ready.
 */
export function whatsappLink(messageOrKey = "general") {
  const messages = schoolConfig.whatsapp.messages;
  const message = messages[messageOrKey] ? getWhatsAppMessage(messageOrKey) : fillTemplate(messageOrKey);
  const number = toInternational(contact.whatsapp);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function telLink(number = contact.phone) {
  const intl = toInternational(number);
  return intl ? `tel:+${intl}` : "";
}
