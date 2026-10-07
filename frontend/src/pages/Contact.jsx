import { featuresConfig as features } from "../config/features.config.js";
import { schoolConfig } from "../config/school.config.js";
import { useSeo } from "../hooks/useSeo.js";
import Container from "../components/common/Container.jsx";
import Img from "../components/common/Img.jsx";
import PageHero from "../components/common/PageHero.jsx";
import ContactInfo from "../components/contact/ContactInfo.jsx";
import ContactForm from "../components/contact/ContactForm.jsx";
import MapEmbed from "../components/contact/MapEmbed.jsx";

const { contactPage, school } = schoolConfig;

export default function Contact() {
  useSeo({ title: "Contact", description: `Contact ${school.name}: address, phone, WhatsApp and enquiry form.`, path: "/contact" });

  return (
    <>
      <PageHero title={contactPage.heading} intro={contactPage.intro} image="/images/contact.svg" imageAlt="Map showing the school location" />

      <section className="section bg-surface">
        <Container className={`grid gap-12 ${features.contactForm ? "lg:grid-cols-[0.9fr_1.1fr] lg:gap-20" : "max-w-2xl"}`}>
          <div>
            <h2 className="title mb-8">Find us</h2>
            <div className="mb-8 aspect-[16/9] overflow-hidden rounded-lg border border-line bg-primary">
              <Img src="/images/admissions.svg" alt={`${school.name} front gate`} width="800" height="450" />
            </div>
            <ContactInfo />
          </div>
          {features.contactForm && (
            <div className="bg-cream lg:-mt-2 lg:p-0">
              <h2 className="title mb-8">Send a message</h2>
              <ContactForm />
            </div>
          )}
        </Container>
      </section>

      {features.map && <MapEmbed />}
    </>
  );
}
