/**
 * FEATURE FLAGS
 * -------------
 * Turn sections and pages on or off. Disabled features disappear completely:
 * navigation links, page routes, homepage sections and footer entries.
 */
export const featuresConfig = {
  // Pages
  admissions: true,
  academics: true,
  gallery: true,

  // Homepage sections and extras
  testimonials: true,
  statistics: true,
  values: true, // "Why choose us"
  news: false, // simple news/announcements block on the homepage (uses school.config.js > news)

  // Admissions behaviour
  onlineApplication: true, // true = "Apply Now" opens admissions.applicationUrl (e.g. a Google Form)

  // Parent portal link in the navbar/footer. The portal itself talks to the
  // backend API and works independently of this flag; this only hides the link.
  parentPortal: true,

  // Contact and communication
  whatsapp: true, // floating button and all WhatsApp CTAs
  map: true, // Google Map on the contact page
  contactForm: true,
  socialMedia: true,

  // Sales-demo helper. Shows a slim "demo preview" bar and marks sample figures.
  // Set to false when the real school content has been added.
  demoNotice: false,
};
