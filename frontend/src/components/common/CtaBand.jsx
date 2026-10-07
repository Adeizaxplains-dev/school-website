import Container from "./Container.jsx";
import Button from "./Button.jsx";
import WhatsAppButton from "./WhatsAppButton.jsx";
import { getAdmissionsTarget, getVisitTarget } from "../../utils/navigation.js";

/** Closing call to action used at the bottom of inner pages. */
export default function CtaBand({ title = "Ready to see the school for yourself?", text = "Message us to ask about admission or arrange a visit." }) {
  return (
    <section className="on-primary bg-primary text-on-primary">
      <Container className="section flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="title">{title}</h2>
          <p className="lead mt-3 opacity-85">{text}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button variant="gold" {...getAdmissionsTarget()}>Explore Admissions</Button>
          <Button variant="light" {...getVisitTarget()}>Book a Visit</Button>
          <WhatsAppButton variant="light" message="general" label="Chat on WhatsApp" />
        </div>
      </Container>
    </section>
  );
}
