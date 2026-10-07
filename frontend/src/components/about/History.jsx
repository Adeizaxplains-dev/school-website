import Container from "../common/Container.jsx";
import Img from "../common/Img.jsx";
import { schoolConfig } from "../../config/school.config.js";

const { school, about } = schoolConfig;

export default function History() {
  return (
    <section className="section bg-cream">
      <Container className="grid items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <h2 className="title">Our story</h2>
          <div className="mt-6 space-y-5 text-muted">
            {about.history.map((paragraph, i) => (
              <p key={i} className="lead">{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="arch aspect-[5/4] bg-primary lg:mt-2">
          <Img src={about.image} alt={about.imageAlt || school.name} tone="dark" />
        </div>
      </Container>
    </section>
  );
}
