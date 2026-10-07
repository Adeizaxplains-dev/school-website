import { ArrowUpRight } from "lucide-react";
import Container from "../common/Container.jsx";
import SectionHeading from "../common/SectionHeading.jsx";
import { schoolConfig } from "../../config/school.config.js";

/** Latest news. Only shown when features.news is true and school.config.js > news has items. */
export default function NewsSection() {
  const items = schoolConfig.news;
  if (!items.length) return null;

  return (
    <section className="section bg-cream">
      <Container>
        <SectionHeading title="School news" />
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="rounded-md border border-line bg-surface p-6">
              {item.date && (
                <time dateTime={item.date} className="text-sm text-muted">
                  {new Date(item.date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                </time>
              )}
              <h3 className="mt-2 font-display text-xl">{item.title}</h3>
              {item.summary && <p className="mt-2 text-muted">{item.summary}</p>}
              {item.link && (
                <a href={item.link} className="link-arrow mt-3">
                  Read more <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
