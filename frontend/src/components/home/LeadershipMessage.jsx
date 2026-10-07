import { Quote, User } from "lucide-react";
import Container from "../common/Container.jsx";
import Img from "../common/Img.jsx";
import { schoolConfig } from "../../config/school.config.js";
import { homeImages } from "./homeImages.js";

const { leadership } = schoolConfig;

export default function LeadershipMessage({ background = "surface" }) {
  if (!leadership.enabled) return null;
  return (
    <section className={`section ${background === "surface" ? "bg-surface" : "bg-cream"}`}>
      <Container>
        <div className="overflow-hidden rounded-[2rem] bg-primary text-white shadow-[0_35px_90px_-50px_rgba(6,61,50,.75)]">
          <div className="grid lg:grid-cols-[.62fr_1.38fr]">
            <div className="relative min-h-[24rem]">
              <Img src={leadership.image} fallbackSrc={homeImages.leadership} alt={leadership.image ? `${leadership.name}, ${leadership.title}` : "School leader"} icon={User} tone="gold" width="900" height="1125" className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-2xl font-semibold">{leadership.name}</p>
                <p className="text-white/70">{leadership.title}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="eyebrow !text-secondary-light">Leadership</p>
              <h2 className="title mt-3 text-white">{leadership.heading}</h2>
              <Quote size={42} className="mt-7 text-secondary" />
              <div className="mt-4 space-y-5 font-display text-xl leading-relaxed text-white/90 sm:text-2xl">
                {leadership.message.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
