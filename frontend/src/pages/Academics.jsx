import { schoolConfig } from "../config/school.config.js";
import { useSeo } from "../hooks/useSeo.js";
import PageHero from "../components/common/PageHero.jsx";
import CtaBand from "../components/common/CtaBand.jsx";
import ProgrammeJumpLinks from "../components/academics/ProgrammeJumpLinks.jsx";
import LearningSpaces from "../components/academics/LearningSpaces.jsx";
import ProgrammeDetail from "../components/academics/ProgrammeDetail.jsx";

const { academics, school } = schoolConfig;

export default function Academics() {
  useSeo({
    title: "Academics",
    description: `Academic programmes at ${school.name}.`,
    path: "/academics",
  });

  return (
    <>
      <PageHero title={academics.heading} intro={academics.intro} image="/images/programme-primary.svg" imageAlt="Learners in a classroom" />
      <ProgrammeJumpLinks />
      {academics.programmes.map((programme, index) => (
        <ProgrammeDetail key={programme.id} programme={programme} index={index} />
      ))}
      <LearningSpaces />
      <CtaBand title="Choose the right stage for your child" text="Tell us your child's age or class and we will guide you." />
    </>
  );
}
