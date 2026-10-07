import Container from "../common/Container.jsx";
import SectionHeading from "../common/SectionHeading.jsx";
import { schoolConfig } from "../../config/school.config.js";

const { admissions } = schoolConfig;

/** Application process. The steps really are a sequence, so they are numbered. */
export default function ProcessSteps() {
  if (!admissions.process.length) return null;
  return (
    <section className="section bg-surface">
      <Container>
        <SectionHeading title="How to apply" />
        <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(13rem,1fr))]">
          {admissions.process.map((step, i) => (
            <li key={step.title} className="relative">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-display text-xl text-on-primary ring-2 ring-secondary ring-offset-2 ring-offset-surface"
              >
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-xl">{step.title}</h3>
              <p className="mt-2 text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
