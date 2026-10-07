import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Mail, MessageCircle } from "lucide-react";
import Button from "../common/Button.jsx";
import { featuresConfig as features } from "../../config/features.config.js";
import { schoolConfig } from "../../config/school.config.js";
import { whatsappLink } from "../../utils/whatsapp.js";

const { school, contactPage } = schoolConfig;
const empty = { name: "", phone: "", email: "", topic: contactPage.formTopics[0] || "", message: "" };

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = "Enter your name.";
  const phoneDigits = v.phone.replace(/\D/g, "");
  if (!v.phone.trim() && !v.email.trim()) errors.contact = "Enter a phone number or an email address so the school can reply.";
  if (v.phone.trim() && phoneDigits.length < 7) errors.phone = "Enter a valid phone number.";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) errors.email = "Enter a valid email address, for example name@example.com.";
  if (v.message.trim().length < 10) errors.message = "Write at least 10 characters.";
  return errors;
}

function buildMessage(v) {
  const lines = [
    `Hello, my name is ${v.name.trim()}.`,
    v.topic ? `Topic: ${v.topic}` : "",
    v.message.trim(),
    v.phone.trim() ? `Phone: ${v.phone.trim()}` : "",
    v.email.trim() ? `Email: ${v.email.trim()}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-medium">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-error">{error}</p>
      )}
    </div>
  );
}

/**
 * Front-end only in V1. It validates the message, then lets the visitor send it through
 * WhatsApp or email. Nothing is sent to a server. Swap the submit handler for an API call when a backend exists.
 */
export default function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);
  const formRef = useRef(null);
  const successRef = useRef(null);
  const attempted = useRef(false);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  // After a failed submit, move focus to the first field with an error
  useEffect(() => {
    if (!attempted.current || !Object.keys(errors).length) return;
    formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    attempted.current = false;
  }, [errors]);

  useEffect(() => {
    if (sent) successRef.current?.focus();
  }, [sent]);

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    attempted.current = true;
    setErrors(found);
    if (Object.keys(found).length === 0) setSent(values);
  };

  if (sent) {
    const message = buildMessage(sent);
    const mail = school.contact.email
      ? `mailto:${school.contact.email}?subject=${encodeURIComponent(sent.topic || "Enquiry")}&body=${encodeURIComponent(message)}`
      : "";
    return (
      <div ref={successRef} tabIndex={-1} className="rounded-md border border-line bg-surface p-6 outline-none sm:p-8" role="status">
        <CheckCircle2 size={36} className="text-link" aria-hidden="true" />
        <h3 className="mt-4 font-display text-2xl">Thank you, {sent.name.trim().split(" ")[0]}.</h3>
        <p className="mt-2 text-muted">
          Your message is ready. Choose how to send it to the school.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {features.whatsapp && (
            <Button href={whatsappLink(message)} icon={MessageCircle}>
              Send on WhatsApp
            </Button>
          )}
          {mail && (
            <Button href={mail} variant="outline" icon={Mail}>
              Send by email
            </Button>
          )}
          <Button
            variant="outline"
            href="#contact-form"
            onClick={(e) => {
              e.preventDefault();
              setSent(null);
              setValues(empty);
              setErrors({});
            }}
          >
            Write another message
          </Button>
        </div>
        <p className="mt-5 text-sm text-muted">This form does not send messages by itself. Nothing has been sent yet.</p>
      </div>
    );
  }

  return (
    <form
      id="contact-form"
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 rounded-md border border-line bg-surface p-6 sm:p-8"
      aria-label="Contact form"
    >
      <Field id="cf-name" label="Your name" error={errors.name}>
        <input id="cf-name" name="name" type="text" autoComplete="name" className="field" value={values.name} onChange={set("name")} {...(errors.name ? { "aria-invalid": "true", "aria-describedby": "cf-name-error" } : {})} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cf-phone" label="Phone number" error={errors.phone}>
          <input id="cf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" value={values.phone} onChange={set("phone")} {...(errors.phone || errors.contact ? { "aria-invalid": "true", "aria-describedby": errors.phone ? "cf-phone-error" : "cf-contact-error" } : {})} />
        </Field>
        <Field id="cf-email" label="Email address" error={errors.email}>
          <input id="cf-email" name="email" type="email" autoComplete="email" className="field" value={values.email} onChange={set("email")} {...(errors.email || errors.contact ? { "aria-invalid": "true", "aria-describedby": errors.email ? "cf-email-error" : "cf-contact-error" } : {})} />
        </Field>
      </div>
      {errors.contact && (
        <p id="cf-contact-error" className="-mt-2 text-sm font-medium text-error">{errors.contact}</p>
      )}

      {contactPage.formTopics.length > 0 && (
        <Field id="cf-topic" label="What is your message about?">
          <select id="cf-topic" name="topic" className="field" value={values.topic} onChange={set("topic")}>
            {contactPage.formTopics.map((topic) => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </Field>
      )}

      <Field id="cf-message" label="Your message" error={errors.message}>
        <textarea id="cf-message" name="message" rows={5} className="field" value={values.message} onChange={set("message")} {...(errors.message ? { "aria-invalid": "true", "aria-describedby": "cf-message-error" } : {})} />
      </Field>

      <Button type="submit" className="w-full sm:w-auto">
        Send message
      </Button>
    </form>
  );
}
