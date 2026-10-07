import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../common/Container.jsx";
import AdmissionActions from "../admissions/AdmissionActions.jsx";
import { schoolConfig } from "../../config/school.config.js";
import Img from "../common/Img.jsx";
import { homeImages } from "./homeImages.js";

const { admissions } = schoolConfig;

/** Homepage admissions panel. One of the main conversion points on the site. */
export default function AdmissionsSection() {
  return (
    <section id="admissions" className="on-dark section bg-dark text-on-dark">
      <Container className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-8">
        <div className="p-2 sm:p-4 lg:p-8">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-on-dark/25 px-4 py-1.5 text-sm font-medium">
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${admissions.open ? "bg-secondary" : "bg-on-dark/50"}`} />
            {admissions.open ? "Admissions open" : "Admissions closed"}, {admissions.session} session
          </p>
          <h2 className="title mt-6">{admissions.open ? admissions.headline : admissions.closedHeadline}</h2>
          <p className="lead mt-5 max-w-xl text-on-dark/85">{admissions.description}</p>
          <AdmissionActions tone="dark" className="mt-9" />
        </div>

        <div className="relative min-h-[26rem] overflow-hidden rounded-[1.5rem]">
          <Img src="" fallbackSrc={homeImages.admissions} alt="Students learning at school" width="1400" height="1000" className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <h3 className="font-display text-xl">What you will need</h3>
          <ul className="mt-4 space-y-3">
            {admissions.requirements.slice(0, 4).map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={20} className="mt-1 shrink-0 text-accent-dark" aria-hidden="true" />
                <span className="text-on-dark/90">{item}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-display text-xl">How it works</h3>
          <ol className="mt-4 space-y-3">
            {admissions.process.slice(0, 4).map((step, i) => (
              <li key={step.title} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-on-secondary"
                >
                  {i + 1}
                </span>
                <span className="text-on-dark/90">{step.title}</span>
              </li>
            ))}
          </ol>

          <Link
            to="/admissions"
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-dark underline decoration-2 underline-offset-4"
          >
            Full admissions details <ArrowRight size={18} aria-hidden="true" />
          </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
