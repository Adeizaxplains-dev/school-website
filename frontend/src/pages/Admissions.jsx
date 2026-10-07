import { schoolConfig } from "../config/school.config.js";
import { useSeo } from "../hooks/useSeo.js";
import Container from "../components/common/Container.jsx";
import PageHero from "../components/common/PageHero.jsx";
import AdmissionActions from "../components/admissions/AdmissionActions.jsx";
import StatusSummary from "../components/admissions/StatusSummary.jsx";
import Requirements from "../components/admissions/Requirements.jsx";
import ProcessSteps from "../components/admissions/ProcessSteps.jsx";
import ImportantDates from "../components/admissions/ImportantDates.jsx";
import Faq from "../components/admissions/Faq.jsx";

const { admissions, school } = schoolConfig;

export default function Admissions() {
  useSeo({
    title: "Admissions",
    description: `Admissions at ${school.name} for the ${admissions.session} session: requirements, process, dates and FAQs.`,
    path: "/admissions",
  });

  return (
    <>
      <PageHero
        title={admissions.open ? admissions.headline : admissions.closedHeadline}
        intro={admissions.description}
      />
      <StatusSummary />
      <Requirements />
      <ProcessSteps />

      <section className="section bg-cream">
        <Container className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <ImportantDates />
          <Faq />
        </Container>
      </section>

      <section className="on-dark section bg-dark text-on-dark">
        <Container>
          <h2 className="title max-w-xl">Ready to take the next step?</h2>
          <p className="lead mt-4 max-w-xl text-on-dark/85">
            Message the school to ask a question, arrange a visit or start an application.
          </p>
          <AdmissionActions tone="dark" className="mt-8" />
        </Container>
      </section>
    </>
  );
}
