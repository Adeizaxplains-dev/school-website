import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import SocialLinks, { getSocialLinks } from "../common/SocialLinks.jsx";
import { featuresConfig as features } from "../../config/features.config.js";
import { schoolConfig } from "../../config/school.config.js";
import { formatAddress } from "../../utils/format.js";
import { telLink, whatsappLink } from "../../utils/whatsapp.js";

const { school } = schoolConfig;
const { phone, whatsapp, email, hours } = school.contact;

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-4 border-t border-line py-5 first:border-t-0 first:pt-0">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-on-primary">
        <Icon size={22} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="font-display text-lg font-semibold">{label}</dt>
        <dd className="mt-1 text-muted">{children}</dd>
      </div>
    </div>
  );
}

const link = "font-medium text-link underline decoration-secondary decoration-2 underline-offset-4 break-words";
/** Shown in demo mode when a detail has not been provided yet. Hidden in production. */
const Pending = ({ children }) => (features.demoNotice ? <span>{children}</span> : null);

export default function ContactInfo() {
  const hasHours = hours?.length > 0;
  return (
    <dl>
      <Row icon={MapPin} label="Address">
        {formatAddress()}
      </Row>

      {(phone || features.demoNotice) && (
        <Row icon={Phone} label="Phone">
          {phone ? (
            <a href={telLink(phone)} className={link}>{phone}</a>
          ) : (
            <Pending>[Phone number to be provided]</Pending>
          )}
        </Row>
      )}

      {features.whatsapp && (
        <Row icon={MessageCircle} label="WhatsApp">
          <a href={whatsappLink("general")} target="_blank" rel="noopener noreferrer" className={link}>
            {whatsapp ? `Message us on ${whatsapp}` : "Chat with us on WhatsApp"}
          </a>
        </Row>
      )}

      {(email || features.demoNotice) && (
        <Row icon={Mail} label="Email">
          {email ? <a href={`mailto:${email}`} className={link}>{email}</a> : <Pending>[Email address to be provided]</Pending>}
        </Row>
      )}

      {hasHours && (
        <Row icon={Clock} label="Opening hours">
          <ul className="space-y-1">
            {hours.map((h) => (
              <li key={h.days}>
                <span className="font-medium text-ink">{h.days}:</span> {h.time}
              </li>
            ))}
          </ul>
        </Row>
      )}

      {getSocialLinks().length > 0 && (
        <div className="border-t border-line pt-5">
          <dt className="font-display text-lg font-semibold">Follow us</dt>
          <dd className="mt-3">
            <SocialLinks />
          </dd>
        </div>
      )}
    </dl>
  );
}
