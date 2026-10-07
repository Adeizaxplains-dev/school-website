import Img from "../common/Img.jsx";
import Container from "../common/Container.jsx";
import SectionHeading from "../common/SectionHeading.jsx";
import { schoolConfig } from "../../config/school.config.js";
import { getIcon } from "../../utils/icons.js";

const { about } = schoolConfig;

export default function Facilities() {
  if (!about.facilities?.length) return null;
  return (
    <section className="section bg-surface">
      <Container>
        <SectionHeading title="School facilities" intro={about.facilitiesIntro} />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {about.facilities.map((facility, i) => {
            const Icon = getIcon(facility.icon);
            return (
              <li key={`${facility.title}-${i}`} className="overflow-hidden rounded-md border border-line bg-cream">
                {facility.image && (
                  <div className="aspect-[16/10] bg-primary">
                    <Img src={facility.image} alt={facility.title} width="800" height="500" />
                  </div>
                )}
                <div className="flex gap-4 p-6">
                  <Icon size={28} className="mt-0.5 shrink-0 text-link" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-xl">{facility.title}</h3>
                    <p className="mt-1 text-muted">{facility.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
