import { Plus } from "lucide-react";
import { schoolConfig } from "../../config/school.config.js";

const { admissions } = schoolConfig;

/** Accessible accordion built on native <details>, so it works with keyboard and screen readers. */
export default function Faq() {
  if (!admissions.faqs.length) return null;
  return (
    <div>
      <h2 className="title">Frequently asked questions</h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {admissions.faqs.map((item) => (
          <details key={item.question} className="group py-1">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-2 font-medium marker:hidden [&::-webkit-details-marker]:hidden">
              {item.question}
              <Plus
                size={22}
                className="shrink-0 text-link transition-transform duration-200 group-open:rotate-45"
                aria-hidden="true"
              />
            </summary>
            <p className="pb-4 pr-8 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
