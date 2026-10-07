import { MessageCircle } from "lucide-react";
import { featuresConfig as features } from "../../config/features.config.js";
import { schoolConfig } from "../../config/school.config.js";
import { whatsappLink } from "../../utils/whatsapp.js";

/**
 * Reusable WhatsApp button. Renders nothing when features.whatsapp is off.
 *
 *  message: a key from school.config.js > whatsapp.messages ("admission", "visit", "general")
 *           or any custom text.
 *  variant: "solid" | "outline" | "light" | "floating"
 */
export default function WhatsAppButton({ message = "general", label = "Chat on WhatsApp", variant = "outline", className = "" }) {
  if (!features.whatsapp) return null;
  const href = whatsappLink(message);

  if (variant === "floating") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${schoolConfig.school.name} on WhatsApp`}
        className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-40 inline-flex h-14 items-center gap-2 rounded-full bg-whatsapp px-4 text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 focus-visible:outline-offset-4 print:hidden"
      >
        <MessageCircle size={26} aria-hidden="true" />
        <span className="hidden text-sm font-semibold sm:inline">{label}</span>
      </a>
    );
  }

  const styles = { solid: "btn-primary", outline: "btn-outline", light: "btn-outline-light" };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${styles[variant] || styles.outline} ${className}`}
    >
      <MessageCircle size={19} aria-hidden="true" />
      {label}
    </a>
  );
}
