import { ExternalLink } from "lucide-react";
import Container from "../common/Container.jsx";
import { featuresConfig as features } from "../../config/features.config.js";
import { schoolConfig } from "../../config/school.config.js";
import { formatAddress } from "../../utils/format.js";

const { school } = schoolConfig;

/** Google Map. Uses school.mapQuery if set, otherwise the address. No API key needed. */
export default function MapEmbed() {
  const query = school.mapQuery || `${school.name}, ${formatAddress()}`;
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const open = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <section className="bg-surface pb-16 sm:pb-24" aria-label="Map">
      <Container>
        <div className="overflow-hidden rounded-md border border-line">
          <iframe
            title={`Map showing the location of ${school.name}`}
            src={embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[20rem] w-full border-0 sm:h-[26rem]"
          />
        </div>
        <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          {features.demoNotice && !school.address.street ? (
            <p className="text-sm text-muted">
              The map shows the general area. Add the street address in school.config.js for an exact pin.
            </p>
          ) : (
            <span />
          )}
          <a href={open} target="_blank" rel="noopener noreferrer" className="link-arrow">
            Open in Google Maps <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
}
