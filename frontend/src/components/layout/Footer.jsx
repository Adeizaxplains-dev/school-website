import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import Logo from "../common/Logo.jsx";
import SocialLinks from "../common/SocialLinks.jsx";
import { featuresConfig as features } from "../../config/features.config.js";
import { schoolConfig } from "../../config/school.config.js";
import { getNavItems } from "../../utils/navigation.js";
import { formatAddress } from "../../utils/format.js";
import { telLink, whatsappLink } from "../../utils/whatsapp.js";

const { school, academics } = schoolConfig;

const linkClass = "inline-flex min-h-9 items-center text-on-dark/80 transition-colors hover:text-accent-dark hover:underline underline-offset-4";
const headingClass = "font-display text-lg font-semibold text-on-dark";

export default function Footer() {
  const items = getNavItems();
  const { phone, email, whatsapp } = school.contact;

  return (
    <footer className="on-dark bg-dark text-on-dark">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.3fr]">
        <div className="max-w-sm">
          <Logo variant="light" />
          <p className="mt-5 text-on-dark/80">{school.tagline}</p>
          <SocialLinks tone="dark" className="mt-6" />
        </div>

        <nav aria-label="Footer">
          <h2 className={headingClass}>Explore</h2>
          <ul className="mt-4 space-y-1">
            {items.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkClass}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {features.academics && academics.programmes.length > 0 && (
          <div>
            <h2 className={headingClass}>Programmes</h2>
            <ul className="mt-4 space-y-1">
              {academics.programmes.map((p) => (
                <li key={p.id}>
                  <Link to={`/academics#${p.id}`} className={linkClass}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className={headingClass}>Contact</h2>
          <ul className="mt-4 space-y-3 text-on-dark/85">
            <li className="flex gap-3">
              <MapPin size={20} className="mt-1 shrink-0 text-accent-dark" aria-hidden="true" />
              <span>{formatAddress()}</span>
            </li>
            {phone && (
              <li className="flex gap-3">
                <Phone size={20} className="mt-1 shrink-0 text-accent-dark" aria-hidden="true" />
                <a href={telLink(phone)} className={linkClass}>{phone}</a>
              </li>
            )}
            {features.whatsapp && (
              <li className="flex gap-3">
                <MessageCircle size={20} className="mt-1 shrink-0 text-accent-dark" aria-hidden="true" />
                <a href={whatsappLink("general")} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {whatsapp ? `WhatsApp: ${whatsapp}` : "Chat on WhatsApp"}
                </a>
              </li>
            )}
            {email && (
              <li className="flex gap-3">
                <Mail size={20} className="mt-1 shrink-0 text-accent-dark" aria-hidden="true" />
                <a href={`mailto:${email}`} className={`${linkClass} break-all`}>{email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-on-dark/15">
        <div className="container-page py-6 text-sm text-on-dark/70">
          &copy; {new Date().getFullYear()} {school.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
