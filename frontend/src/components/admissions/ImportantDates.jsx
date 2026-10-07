import { schoolConfig } from "../../config/school.config.js";

const { admissions } = schoolConfig;

export default function ImportantDates() {
  if (!admissions.importantDates.length) return null;
  return (
    <div>
      <h2 className="title">Important dates</h2>
      <dl className="mt-6 divide-y divide-line border-y border-line">
        {admissions.importantDates.map((item) => (
          <div key={item.label} className="flex flex-col gap-1 py-4 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="font-medium">{item.label}</dt>
            <dd className="text-muted sm:text-right">{item.date}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
