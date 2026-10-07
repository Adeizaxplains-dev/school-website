import Container from "../common/Container.jsx";
import Reveal from "../common/Reveal.jsx";
import SectionHeading from "../common/SectionHeading.jsx";
import { schoolConfig } from "../../config/school.config.js";
import { getIcon } from "../../utils/icons.js";

const { values } = schoolConfig;

export default function WhyChooseUs({ title = values.heading, intro = values.intro, background = "surface" }) {
  if (!values.items.length) return null;

  return (
    <section className={`section ${background === "cream" ? "bg-cream" : "bg-surface"}`}>
      <Container>
        <SectionHeading title={title} intro={intro} />
        <Reveal as="ul" className="mt-12 grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
          {values.items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <li key={item.title} className="border-t border-line py-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-on-primary ring-1 ring-secondary/70">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-xl">{item.title}</h3>
                <p className="mt-2 text-muted">{item.description}</p>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
