import { featuresConfig as features } from "../config/features.config.js";
import { schoolConfig } from "../config/school.config.js";
import { useSeo } from "../hooks/useSeo.js";
import { homeImages } from "../components/home/homeImages.js";
import PageHero from "../components/common/PageHero.jsx";
import CtaBand from "../components/common/CtaBand.jsx";
import History from "../components/about/History.jsx";
import MissionVision from "../components/about/MissionVision.jsx";
import Philosophy from "../components/about/Philosophy.jsx";
import Facilities from "../components/about/Facilities.jsx";
import WhyChooseUs from "../components/home/WhyChooseUs.jsx";
import LeadershipMessage from "../components/home/LeadershipMessage.jsx";

const { school, about } = schoolConfig;

export default function About() {
  useSeo({
    title: "About us",
    description: `About ${school.name}: our story, mission, vision and values.`,
    path: "/about",
  });

  return (
    <>
      <PageHero title={`About ${school.name}`} intro={about.introduction} image="/images/about-campus.svg" imageAlt="Our school campus" />
      <History />
      <MissionVision />
      {features.values && (
        <WhyChooseUs title="Our core values" intro="The principles that guide teaching and school life every day." background="surface" />
      )}
      <Philosophy />
      <LeadershipMessage background="surface" />
      <Facilities />
      <CtaBand />
    </>
  );
}
