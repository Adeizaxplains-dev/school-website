import { ArrowRight, CheckCircle2, ChevronDown, MapPin } from "lucide-react";
import Container from "../common/Container.jsx";
import Button from "../common/Button.jsx";
import Img from "../common/Img.jsx";
import { schoolConfig } from "../../config/school.config.js";
import { formatLocation } from "../../utils/format.js";
import { getAdmissionsTarget } from "../../utils/navigation.js";
import { homeImages } from "./homeImages.js";

const { school, hero, admissions } = schoolConfig;

export default function Hero() {
  const status = admissions.open ? "Admissions open" : "Admissions closed";

  return (
    <section className="home-hero relative isolate overflow-hidden bg-dark text-on-dark">
      <div className="absolute inset-0 -z-20">
        <Img src={hero.image} fallbackSrc={homeImages.hero} alt={hero.imageAlt} eager width="1800" height="1100" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(4,35,29,.96)_0%,rgba(4,35,29,.86)_38%,rgba(4,35,29,.52)_68%,rgba(4,35,29,.34)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(4,35,29,.72),transparent_45%)]" />

      <Container className="relative flex min-h-[min(46rem,calc(100vh-4.5rem))] items-end py-14 sm:py-20 lg:items-center lg:py-24">
        <div className="max-w-3xl">
          <div className="hero-rise inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-none" style={{ "--d": "0ms" }}>
            <span className={`h-2.5 w-2.5 rounded-full ${admissions.open ? "bg-secondary" : "bg-white/50"}`} />
            {status} · {admissions.session}
          </div>

          <p className="hero-rise mt-7 text-sm font-semibold uppercase tracking-[0.22em] text-secondary-light" style={{ "--d": "80ms" }}>
            {school.shortName}
          </p>

          <h1 className="display hero-rise mt-3 max-w-4xl text-white" style={{ "--d": "140ms" }}>
            {school.tagline}
          </h1>

          <p className="lead hero-rise mt-6 max-w-2xl text-white/82" style={{ "--d": "220ms" }}>
            {hero.supportingText}
          </p>

          <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ "--d": "300ms" }}>
            <Button variant="gold" {...getAdmissionsTarget()}>
              {hero.primaryCta}
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button variant="light" to="/about">
              {hero.secondaryCta}
            </Button>
          </div>

          <div className="hero-rise mt-9 grid max-w-2xl gap-3 text-sm sm:grid-cols-3" style={{ "--d": "380ms" }}>
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-none">
              <CheckCircle2 className="shrink-0 text-secondary" size={19} />
              <span>Child-focused learning</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-none">
              <CheckCircle2 className="shrink-0 text-secondary" size={19} />
              <span>Strong parent partnership</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-none">
              <MapPin className="shrink-0 text-secondary" size={19} />
              <span>{formatLocation()}</span>
            </div>
          </div>
        </div>
      </Container>

      <a href="#welcome" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors hover:text-white lg:flex">
        Explore the school <ChevronDown size={16} />
      </a>
    </section>
  );
}
