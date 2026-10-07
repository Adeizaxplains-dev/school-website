import Container from "../common/Container.jsx";
import { featuresConfig as features } from "../../config/features.config.js";
import { schoolConfig } from "../../config/school.config.js";
import { useCountUp } from "../../hooks/useCountUp.js";
import { useInView } from "../../hooks/useInView.js";

const { statistics } = schoolConfig;

/** Splits "500+" into prefix "", number 500, suffix "+". Text-only values are shown as they are. */
function parseValue(value) {
  const match = String(value).match(/^(\D*)(\d[\d,]*)(.*)$/);
  if (!match) return { prefix: "", number: null, suffix: String(value) };
  return { prefix: match[1], number: Number(match[2].replace(/,/g, "")), suffix: match[3] };
}

function Stat({ value, label, active }) {
  const { prefix, number, suffix } = parseValue(value);
  const counted = useCountUp(number ?? 0, active);
  return (
    <div className="flex flex-col-reverse justify-end border-t border-on-primary/25 pt-6 lg:flex-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 lg:first:border-l-0 lg:first:pl-0">
      <dt className="mt-3 text-base text-on-primary/85">{label}</dt>
      <dd className="font-display text-5xl font-semibold leading-none text-accent-primary sm:text-6xl">
        <span className="sr-only">{value}</span>
        <span aria-hidden="true">
          {prefix}
          {number === null ? "" : counted.toLocaleString("en-NG")}
          {suffix}
        </span>
      </dd>
    </div>
  );
}

export default function Statistics() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  if (!statistics.items.length) return null;

  return (
    <section className="on-primary section bg-primary text-on-primary" aria-label="School statistics">
      <Container>
        <dl ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-10 lg:flex lg:gap-0">
          {statistics.items.map((item) => (
            <Stat key={item.label} value={item.value} label={item.label} active={inView} />
          ))}
        </dl>
        {features.demoNotice && (
          <p className="mt-10 text-sm text-on-primary/75">
            Sample figures for demonstration. Replace with verified information.
          </p>
        )}
      </Container>
    </section>
  );
}
