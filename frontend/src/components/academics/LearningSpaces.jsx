import Container from "../common/Container.jsx";
import SectionHeading from "../common/SectionHeading.jsx";
import Img from "../common/Img.jsx";
import { homeImages } from "../home/homeImages.js";

const spaces = [
  { key: "library", title: "Library & reading", text: "Quiet space for reading and research." },
  { key: "science", title: "Science & practicals", text: "Hands-on experiments that make ideas concrete." },
  { key: "ict", title: "ICT & computing", text: "Digital skills for school and beyond." },
  { key: "arts", title: "Arts & creativity", text: "Room to create, perform and express." },
];

export default function LearningSpaces() {
  return (
    <section className="section bg-surface">
      <Container>
        <SectionHeading title="Learning beyond the classroom" intro="Every subject is supported by spaces where learners can practise, explore and create." />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {spaces.map((s) => (
            <li key={s.key} className="overflow-hidden rounded-lg border border-line bg-cream">
              <div className="aspect-[4/3] bg-primary">
                <Img src={homeImages.academics[s.key]} alt={s.title} width="800" height="600" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
