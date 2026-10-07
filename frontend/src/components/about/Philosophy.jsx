import Container from "../common/Container.jsx";
import { schoolConfig } from "../../config/school.config.js";

const { philosophy } = schoolConfig.about;

export default function Philosophy() {
  if (!philosophy?.body?.length) return null;
  return (
    <section className="section bg-cream">
      <Container className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <h2 className="title max-w-md">{philosophy.heading}</h2>
        <div className="space-y-5 text-muted">
          {philosophy.body.map((paragraph, i) => (
            <p key={i} className="lead">{paragraph}</p>
          ))}
        </div>
      </Container>
    </section>
  );
}
