import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../common/Container.jsx";
import Img from "../common/Img.jsx";
import Reveal from "../common/Reveal.jsx";
import SectionHeading from "../common/SectionHeading.jsx";
import { schoolConfig } from "../../config/school.config.js";
import { getProgrammeTarget } from "../../utils/navigation.js";
import { homeImages } from "./homeImages.js";

const { academics } = schoolConfig;

export default function ProgrammesSection() {
  if (!academics.programmes.length) return null;

  return (
    <section id="programmes" className="section bg-cream">
      <Container>
        <SectionHeading title={academics.heading} intro={academics.intro} />
        <Reveal className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {academics.programmes.map((programme, i) => {
            const target = getProgrammeTarget(programme);
            return (
              <article key={programme.id} className="group overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-[0_18px_50px_-42px_rgba(23,33,29,.7)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_55px_-35px_rgba(23,33,29,.55)]">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Img src={programme.image} fallbackSrc={homeImages.programmes[i % homeImages.programmes.length]} alt={`${programme.title} learning programme`} width="1000" height="625" className="transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl border border-white/20 bg-dark/75 px-4 py-3 text-white backdrop-blur-md">
                    <span className="font-semibold">{programme.title}</span>
                    {programme.ageRange && <span className="text-xs text-white/70">{programme.ageRange}</span>}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted">{programme.description}</p>
                  <div className="mt-5">
                    {target.to ? (
                      <Link to={target.to} className="link-arrow" aria-label={`Learn more about ${programme.title}`}>Explore programme <ArrowRight size={18} /></Link>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
