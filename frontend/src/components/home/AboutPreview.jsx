import { ArrowRight, Check, ShieldCheck, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../common/Container.jsx";
import Img from "../common/Img.jsx";
import { schoolConfig } from "../../config/school.config.js";
import { homeImages } from "./homeImages.js";

const { school, about } = schoolConfig;

export default function AboutPreview() {
  return (
    <section className="section bg-surface">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-20">
          <div className="relative">
            <div className="absolute -bottom-5 -right-5 hidden h-40 w-40 rounded-[2rem] bg-secondary/15 lg:block" />
            <div className="relative overflow-hidden rounded-[2rem] rounded-br-[7rem] shadow-[0_30px_80px_-45px_rgba(23,33,29,.6)]">
              <div className="aspect-[4/5]">
                <Img src={about.image} fallbackSrc={homeImages.about} alt={about.imageAlt} width="900" height="1125" />
              </div>
            </div>
            <div className="absolute -bottom-7 left-5 max-w-[18rem] rounded-2xl bg-primary p-5 text-white shadow-xl sm:left-8">
              <p className="text-3xl font-semibold font-display">Child first</p>
              <p className="mt-1 text-sm text-white/70">Every learner is seen, supported and challenged to grow.</p>
            </div>
          </div>

          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="title mt-3">About {school.shortName}</h2>
            <p className="lead mt-5 max-w-2xl text-muted">{about.introduction}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                [BookOpen, "Purposeful learning"],
                [Users, "Parent partnership"],
                [ShieldCheck, "Safe community"],
              ].map(([Icon, label]) => (
                <div key={label} className="rounded-2xl border border-line bg-cream/55 p-4">
                  <Icon size={22} className="text-primary" />
                  <p className="mt-3 text-sm font-semibold">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="border-l-2 border-secondary pl-5">
                <h3 className="font-display text-xl">Our mission</h3>
                <p className="mt-2 line-clamp-4 text-muted">{about.mission}</p>
              </div>
              <div className="border-l-2 border-secondary pl-5">
                <h3 className="font-display text-xl">Our vision</h3>
                <p className="mt-2 line-clamp-4 text-muted">{about.vision}</p>
              </div>
            </div>

            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {about.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium">
                  <Check size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/about" className="link-arrow mt-7">Meet the school <ArrowRight size={18} /></Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
