import { Eye, Target } from "lucide-react";
import Container from "../common/Container.jsx";
import { schoolConfig } from "../../config/school.config.js";

const { about } = schoolConfig;

export default function MissionVision() {
  const blocks = [
    { title: "Our mission", text: about.mission, icon: Target },
    { title: "Our vision", text: about.vision, icon: Eye },
  ].filter((b) => b.text);
  if (!blocks.length) return null;

  return (
    <section className="on-primary section bg-primary text-on-primary">
      <Container className={`grid gap-12 ${blocks.length > 1 ? "lg:grid-cols-2 lg:gap-20" : ""}`}>
        {blocks.map(({ title, text, icon: Icon }) => (
          <div key={title}>
            <Icon size={32} className="text-accent-primary" aria-hidden="true" />
            <h2 className="title mt-4">{title}</h2>
            <p className="lead mt-4 max-w-xl opacity-90">{text}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
