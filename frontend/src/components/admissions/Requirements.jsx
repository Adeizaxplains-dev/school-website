import { Check } from "lucide-react";
import Container from "../common/Container.jsx";
import { schoolConfig } from "../../config/school.config.js";

const { admissions } = schoolConfig;

/** "Who can apply" and the document checklist, side by side on large screens. */
export default function Requirements() {
  return (
    <section className="section bg-cream">
      <Container className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        {admissions.whoCanApply && (
          <div>
            <h2 className="title">Who can apply</h2>
            <p className="lead mt-5 text-muted">{admissions.whoCanApply}</p>
          </div>
        )}
        {admissions.requirements.length > 0 && (
          <div>
            <h2 className="title">Requirements</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {admissions.requirements.map((item) => (
                <li key={item} className="flex items-start gap-3 py-4">
                  <Check size={22} className="mt-0.5 shrink-0 text-link" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
