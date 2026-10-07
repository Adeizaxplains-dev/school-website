import Container from "../common/Container.jsx";
import AdmissionActions from "./AdmissionActions.jsx";
import { schoolConfig } from "../../config/school.config.js";

const { admissions } = schoolConfig;

export default function StatusSummary() {
  return (
    <section className="border-b border-line bg-surface">
      <Container className="grid gap-8 py-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-16">
        <dl className="grid grid-cols-2 gap-8">
          <div>
            <dt className="text-sm text-muted">Admissions status</dt>
            <dd className="mt-1 flex items-center gap-2 font-display text-2xl">
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${admissions.open ? "bg-secondary ring-2 ring-primary/30" : "bg-muted"}`}
              />
              {admissions.open ? "Open" : "Closed"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Current session</dt>
            <dd className="mt-1 font-display text-2xl">{admissions.session}</dd>
          </div>
        </dl>
        <AdmissionActions className="lg:justify-end" />
      </Container>
    </section>
  );
}
