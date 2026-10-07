import Container from "../common/Container.jsx";
import { schoolConfig } from "../../config/school.config.js";

/** Row of anchor links to each programme. Adapts automatically to the number of programmes. */
export default function ProgrammeJumpLinks() {
  const { programmes } = schoolConfig.academics;
  if (programmes.length < 2) return null;
  return (
    <nav aria-label="Programmes" className="border-b border-line bg-surface">
      <Container>
        <ul className="flex gap-2 overflow-x-auto py-3">
          {programmes.map((p) => (
            <li key={p.id} className="shrink-0">
              <a
                href={`#${p.id}`}
                className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-[0.95rem] font-medium text-link transition-colors hover:bg-primary hover:text-on-primary"
              >
                {p.title}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
