import Button from "../common/Button.jsx";
import WhatsAppButton from "../common/WhatsAppButton.jsx";
import { schoolConfig } from "../../config/school.config.js";
import { getApplyTarget, getVisitTarget } from "../../utils/navigation.js";

/**
 * The three admission buttons: Apply Now, Chat on WhatsApp, Book a Visit.
 * Every destination is generated from configuration. Use tone="dark" on dark backgrounds.
 */
export default function AdmissionActions({ tone = "light", className = "" }) {
  const { open } = schoolConfig.admissions;
  const secondary = tone === "dark" ? "light" : "outline";
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      <Button variant={tone === "dark" ? "gold" : "primary"} {...getApplyTarget()}>
        {open ? "Apply Now" : "Ask About Next Session"}
      </Button>
      <WhatsAppButton variant={secondary} message="admission" label="Chat on WhatsApp" />
      <Button variant={secondary} {...getVisitTarget()}>
        Book a Visit
      </Button>
    </div>
  );
}
