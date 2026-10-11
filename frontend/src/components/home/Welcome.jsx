import { ArrowUpRight, Sparkles } from "lucide-react";
import Container from "../common/Container.jsx";
import Reveal from "../common/Reveal.jsx";
import Img from "../common/Img.jsx";
import { schoolConfig } from "../../config/school.config.js";
import { homeImages } from "./homeImages.js";

const { welcome } = schoolConfig;

export default function Welcome() {
  return (
    <section id="welcome" className="section bg-cream">
      <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -left-4 -top-4 h-28 w-28 rounded-full border border-secondary/50" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] rounded-tl-[7rem] shadow-[0_28px_70px_-35px_rgba(6,61,50,.55)]">
            <div className="aspect-[4/3]">
              <Img src={homeImages.welcome} alt="Students learning together at school" width="1200" height="900" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/25 bg-dark/80 p-4 text-white backdrop-blur-md">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Sparkles size={19} /></span>
              <div>
                <p className="font-semibold">Learning with purpose</p>
                <p className="text-sm text-white/70">Knowledge, character and confidence.</p>
              </div>
            </div>
          </div>
        </div>

        <Reveal className="order-1 lg:order-2">
          <p className="eyebrow">Welcome to our school</p>
          <h2 className="title mt-3 max-w-xl">{welcome.heading}</h2>
          <div className="mt-6 space-y-5 text-muted">
            {welcome.body.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "lead text-ink" : "lead"}>{paragraph}</p>
            ))}
          </div>
          <a href="#programmes" className="link-arrow mt-7">See how we learn <ArrowUpRight size={18} /></a>
        </Reveal>
      </Container>
    </section>
  );
}
