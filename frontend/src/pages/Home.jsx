import { featuresConfig as features } from "../config/features.config.js";
import { useSeo } from "../hooks/useSeo.js";
import Hero from "../components/home/Hero.jsx";
import Welcome from "../components/home/Welcome.jsx";
import AboutPreview from "../components/home/AboutPreview.jsx";
import ProgrammesSection from "../components/home/ProgrammesSection.jsx";
import WhyChooseUs from "../components/home/WhyChooseUs.jsx";
import Statistics from "../components/home/Statistics.jsx";
import LeadershipMessage from "../components/home/LeadershipMessage.jsx";
import AdmissionsSection from "../components/home/AdmissionsSection.jsx";
import TestimonialsSection from "../components/home/TestimonialsSection.jsx";
import NewsSection from "../components/home/NewsSection.jsx";

export default function Home() {
  useSeo({ path: "/" });

  return (
    <>
      <Hero />
      <Welcome />
      <AboutPreview />
      {features.academics && <ProgrammesSection />}
      {features.values && <WhyChooseUs />}
      {features.statistics && <Statistics />}
      <LeadershipMessage />
      {features.admissions && <AdmissionsSection />}
      {features.testimonials && <TestimonialsSection />}
      {features.news && <NewsSection />}
    </>
  );
}
