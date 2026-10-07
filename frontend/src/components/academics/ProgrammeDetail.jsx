import { Check } from "lucide-react";
import Container from "../common/Container.jsx";
import Button from "../common/Button.jsx";
import Img from "../common/Img.jsx";
import { featuresConfig as features } from "../../config/features.config.js";
import { schoolConfig } from "../../config/school.config.js";
import { getIcon } from "../../utils/icons.js";
import { whatsappLink } from "../../utils/whatsapp.js";

const tones = ["primary", "dark", "gold"];

/** Full description of one programme. Image alternates left and right down the page. */
export default function ProgrammeDetail({ programme, index }) {
  const Icon = getIcon(programme.icon);
  const flip = index % 2 === 1;
  const target = features.whatsapp
    ? {
        href: whatsappLink(
          `Hello, I would like to enquire about the ${programme.title} programme at ${schoolConfig.school.name}.`
        ),
      }
    : { to: "/contact" };

  return (
    <section id={programme.id} className={`py-16 sm:py-20 lg:py-24 ${index % 2 === 0 ? "bg-cream" : "bg-surface"}`}>
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className={flip ? "lg:order-2" : ""}>
          <div className="arch mx-auto aspect-[4/5] max-w-sm bg-primary lg:max-w-md">
            <Img src={programme.image} alt={programme.image ? programme.title : ""} icon={Icon} tone={tones[index % tones.length]} />
          </div>
        </div>

        <div>
          <h2 className="title">{programme.title}</h2>
          {programme.ageRange && (
            <p className="mt-2 font-medium text-link">{programme.ageRange}</p>
          )}
          <p className="lead mt-5 text-muted">{programme.description}</p>

          {programme.objectives?.length > 0 && (
            <>
              <h3 className="mt-8 font-display text-xl">Learning objectives</h3>
              <ul className="mt-3 space-y-2.5">
                {programme.objectives.map((objective) => (
                  <li key={objective} className="flex items-start gap-3">
                    <Check size={20} className="mt-1 shrink-0 text-link" aria-hidden="true" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {programme.subjects?.length > 0 && (
            <>
              <h3 className="mt-8 font-display text-xl">Subjects</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {programme.subjects.map((subject) => (
                  <li key={subject} className="rounded-full border border-line bg-cream px-3.5 py-1.5 text-sm">
                    {subject}
                  </li>
                ))}
              </ul>
            </>
          )}

          <Button variant="outline" className="mt-9" {...target}>
            Enquire about {programme.title}
          </Button>
        </div>
      </Container>
    </section>
  );
}
