/**
 * SCHOOL CONFIG
 * -------------
 * Everything that is specific to ONE school lives in this file.
 * To build a website for another school, edit this file (plus theme.config.js
 * and features.config.js) and replace the images in /public/images.
 *
 * Conventions
 *  - Anything wrapped in [square brackets] is placeholder text. Replace it with verified information.
 *  - An empty string ("") means "not provided". The website hides that item instead of showing a blank.
 *  - Images: use a path such as "/images/classroom.jpg" (file in /public/images) or a full URL.
 *    An empty image shows a neutral placeholder so the layout still looks finished.
 *  - Icons: use a name from src/utils/icons.js (for example "BookOpen").
 */
export const schoolConfig = {
  /* ------------------------------------------------------------------ */
  /* Identity and contact                                                */
  /* ------------------------------------------------------------------ */
  school: {
    name: "Gold Success Comprehensive College",
    shortName: "Gold Success College",
    tagline: "Building confident learners for a brighter future.",
    description:
      "A private school in 3, Ifesowapo-Irenitemi CDA , Ogun State, where learning, character and community grow together.",

    logo: "/images/logo.svg",
    favicon: "/images/favicon.svg",

    address: {
      street: "", // e.g. "12 School Road"
      area: "Ogusanwo Street",
      lga: "Sabo, Sagamu",
      state: "Ogun State",
      country: "Nigeria",
    },

    contact: {
      phone: "", // e.g. "08032321869"
      whatsapp: "", // e.g. "08032321869". Nigerian numbers starting with 0 are converted automatically.
      email: "", // e.g. "info@school.edu.ng"
      countryCode: "234", // used to convert local numbers into international format
      hours: [
        { days: "Monday to Friday", time: "[Opening hours to be confirmed]" },
        // { days: "Saturday", time: "Closed" },
      ],
    },

    social: {
      facebook: "",
      instagram: "",
      youtube: "",
      x: "",
      tiktok: "",
    },

    // Google Map. Leave "mapQuery" empty to build it from the address above,
    // or paste an exact place name / address for a precise pin.
    mapQuery: "",
  },

  /* ------------------------------------------------------------------ */
  /* SEO                                                                 */
  /* ------------------------------------------------------------------ */
  seo: {
    siteUrl: "", // e.g. "https://rightlegacyschools.com.ng" (no trailing slash). Enables canonical and OG URLs.
    title: "Gold Success Comprehensive College | Sagamu, Ogun State",
    description:
      "Gold Success Comprehensive College, Sagamu, Ogun State. Learn about our programmes, admissions and community, and get in touch.",
    keywords: [
      "private school in Sagamu",
      "school in Sagamu",
      "private school Ogun State",
      "school admission Ogun State",
      "nursery and primary school",
    ],
    ogImage: "/images/p 4.webp", // 1200x630 recommended
  },

  /* ------------------------------------------------------------------ */
  /* WhatsApp message templates. {school} is replaced with the school name */
  /* ------------------------------------------------------------------ */
  whatsapp: {
    messages: {
      admission: "Hello, I would like to enquire about admission at {school}.",
      visit: "Hello, I would like to book a visit to {school}.",
      general: "Hello, I would like to learn more about {school}.",
      floating: "Hello, I would like to learn more about {school}.",
    },
  },

  /* ------------------------------------------------------------------ */
  /* Homepage                                                            */
  /* ------------------------------------------------------------------ */
 hero: {
  image: "/images/p 4.webp",
  imageAlt: "Learners at Gold Success Comprehensive College",
  supportingText:
    "A warm, well-ordered school community in Sagamu where children are known by name and encouraged to grow in knowledge, character and confidence.",
  primaryCta: "Explore Admissions",
  secondaryCta: "Discover Our School",
},

  welcome: {
    heading: "A school where every child can grow.",
    body: [
      "Every child arrives with different strengths, questions and dreams. Our work is to notice them, encourage them, and give each learner the support to move forward with confidence.",
      "We work closely with parents so that what a child learns in the classroom is supported at home.",
    ],
  },

  /* ------------------------------------------------------------------ */
  /* About                                                               */
  /* ------------------------------------------------------------------ */
  about: {
   image: "/images/p 5.jpeg",
    imageAlt: "The school community",
    introduction:
      "Gold Success Comprehensive College serves families in Sagamu and the surrounding communities of Sagamu, Ogun State.",
    history: [
      "[School history to be provided by the school. Include the year of establishment, the founder's story and key milestones.]",
    ],
    mission:
      "[Mission statement to be provided.] Replace with the school's verified mission.",
    vision:
      "[Vision statement to be provided.] Replace with the school's verified vision.",
    highlights: [
      "Learning that starts with each child",
      "Clear expectations and caring discipline",
      "Open communication with parents",
    ],
    philosophy: {
      heading: "How we think about learning",
      body: [
        "[Learning philosophy to be provided.] Describe how the school approaches teaching, discipline, character formation and the involvement of parents.",
      ],
    },
    facilitiesIntro:
      "[Introduce the school's facilities here. Replace the entries below with verified information.]",
    facilities: [
      { title: "[Library]", description: "Replace with verified facility information.", icon: "Library", image: "/images/academics-library.svg" },
      { title: "[Science laboratory]", description: "Replace with verified facility information.", icon: "FlaskConical", image: "/images/academics-science.svg" },
      { title: "[Sports field]", description: "Replace with verified facility information.", icon: "Trophy", image: "/images/gallery-sports.svg" },
    ],
  },

  values: {
    heading: "Why families choose us",
    intro: "What parents can expect from a school that takes learning and character seriously.",
    items: [
      {
        title: "Academic excellence",
        description: "High expectations, clear teaching and regular feedback so learners keep improving.",
        icon: "GraduationCap",
      },
      {
        title: "Character development",
        description: "Honesty, respect and responsibility are taught and practised every day.",
        icon: "HeartHandshake",
      },
      {
        title: "Qualified teachers",
        description: "Teachers who care about their subjects and about the children in front of them.",
        icon: "Users",
      },
      {
        title: "Safe learning environment",
        description: "A secure, orderly school where children can concentrate and feel at ease.",
        icon: "ShieldCheck",
      },
      {
        title: "Leadership development",
        description: "Opportunities for learners to take responsibility, speak up and lead.",
        icon: "Compass",
      },
      {
        title: "Parent partnership",
        description: "Open lines of communication so parents are part of their child's progress.",
        icon: "Handshake",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Statistics. Sample figures only. Replace with verified numbers.     */
  /* "value" can be a number or text such as "10+".                       */
  /* ------------------------------------------------------------------ */
  statistics: {
    items: [
      { value: "10+", label: "Years of excellence" },
      { value: "500+", label: "Learners" },
      { value: "30+", label: "Teachers" },
      { value: "1", label: "Strong community" },
    ],
  },

  leadership: {
    enabled: true,
    name: "[Proprietor's name]",
    title: "Proprietor",
    image: "/images/leadership.svg", // portrait photo. Empty = neutral placeholder.
    heading: "A message from the proprietor",
    message: [
      "[The proprietor's welcome message to be provided.]",
      "Replace this text with a short, personal message to parents and prospective families.",
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Academics                                                           */
  /* Add, remove or reorder programmes freely. No code changes needed.   */
  /* ------------------------------------------------------------------ */
  academics: {
    heading: "Academic programmes",
    intro:
      "A clear path from a child's first classroom to graduation, with each stage building on the last.",
    programmes: [
      {
        id: "early-years",
        title: "Early Years",
        description:
          "A gentle start to school life through play, language, songs and early number work.",
        ageRange: "[Age / class range]",
        icon: "Baby",
        image: "/images/programme-early-years.svg",
        objectives: [
          "Build early language and number confidence",
          "Develop social skills and independence",
          "Grow a love of coming to school",
        ],
        subjects: [],
      },
      {
        id: "nursery",
        title: "Nursery",
        description:
          "Structured early learning that prepares children for the primary classroom.",
        ageRange: "[Age / class range]",
        icon: "Sprout",
        image: "/images/programme-nursery.svg",
        objectives: [
          "Introduce reading, writing and counting",
          "Encourage curiosity and creativity",
          "Develop good habits and routines",
        ],
        subjects: [],
      },
      {
        id: "primary",
        title: "Primary",
        description:
          "Strong foundations in literacy, numeracy and character, with attention to each child's progress.",
        ageRange: "[Age / class range]",
        icon: "BookOpen",
        image: "/images/programme-primary.svg",
        objectives: [
          "Secure core skills in reading, writing and mathematics",
          "Encourage confident speaking and independent thinking",
          "Build responsibility and good conduct",
        ],
        subjects: [],
      },
      {
        id: "junior-secondary",
        title: "Junior Secondary",
        description:
          "Broadening knowledge across subjects while building study skills and self-discipline.",
        ageRange: "[Age / class range]",
        icon: "Lightbulb",
        image: "/images/programme-junior-secondary.svg",
        objectives: [
          "Widen subject knowledge and study skills",
          "Support learners through the move to secondary school",
          "Develop leadership and teamwork",
        ],
        subjects: [],
      },
      {
        id: "senior-secondary",
        title: "Senior Secondary",
        description:
          "Focused preparation for external examinations and the next stage of education.",
        ageRange: "[Age / class range]",
        icon: "GraduationCap",
        image: "/images/programme-senior-secondary.svg",
        objectives: [
          "Prepare learners for external examinations",
          "Guide subject and career choices",
          "Develop maturity and responsibility",
        ],
        subjects: [],
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Admissions                                                          */
  /* ------------------------------------------------------------------ */
  admissions: {
    open: true,
    session: "2026/2027",
    headline: "Admissions now open",
    closedHeadline: "Admissions are currently closed",
    description:
      "Places are available for the new session. Message the school to ask about available classes, fees and how to secure a place for your child.",
    applicationUrl: "", // used when features.onlineApplication is true (e.g. a Google Form link)

    whoCanApply:
      "Parents and guardians seeking a place for a child in any class the school offers. [Confirm entry age and class requirements.]",

    requirements: [
      "Completed application form",
      "Copy of the child's birth certificate",
      "Most recent school report (for transfer students)",
      "Recent passport photographs",
    ],

    process: [
      { title: "Make an enquiry", description: "Message the school on WhatsApp or use the contact form." },
      { title: "Visit the school", description: "Meet the team and see the school for yourself." },
      { title: "Submit your application", description: "Complete the application form with the required documents." },
      { title: "Receive a decision", description: "The school will let you know the outcome and next steps." },
    ],

    importantDates: [
      { label: "Admissions open", date: "[Date to be confirmed]" },
      { label: "Entrance / placement", date: "[Date to be confirmed]" },
      { label: "Resumption for the new session", date: "[Date to be confirmed]" },
    ],

    faqs: [
      {
        question: "What are the school fees?",
        answer:
          "Fees depend on the class. Message the school on WhatsApp or use the contact form to receive the current fee schedule.",
      },
      {
        question: "Can I visit the school before applying?",
        answer:
          "Yes. Use the Book a Visit button to arrange a time that suits you.",
      },
      {
        question: "Which classes are currently open for admission?",
        answer:
          "Availability changes during the year. Contact the school to confirm which classes have places.",
      },
      {
        question: "How do I apply?",
        answer:
          "Send an enquiry, visit the school, then submit the application form and required documents. The steps are listed above.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Gallery                                                             */
  /* aspect: "landscape" | "portrait" | "square"                          */
  /* ------------------------------------------------------------------ */
  gallery: {
    heading: "Life at the school",
    intro: "A look at learning, activities and school life.",
    categories: ["Learning", "Activities", "Campus", "Events"],
    items: [
      { image: "/images/gallery-classroom.svg", title: "Classroom", category: "Learning", aspect: "landscape", alt: "Learners in a classroom" },
      { image: "/images/gallery-reading.svg", title: "Reading time", category: "Learning", aspect: "portrait", alt: "A child reading" },
      { image: "/images/gallery-sports.svg", title: "Sports day", category: "Activities", aspect: "landscape", alt: "Learners taking part in sport" },
      { image: "/images/gallery-arts.svg", title: "Creative arts", category: "Activities", aspect: "square", alt: "Learners doing art" },
      { image: "/images/gallery-grounds.svg", title: "School grounds", category: "Campus", aspect: "portrait", alt: "The school grounds" },
      { image: "/images/gallery-assembly.svg", title: "Assembly", category: "Events", aspect: "landscape", alt: "School assembly" },
      { image: "/images/gallery-science.svg", title: "Science activity", category: "Learning", aspect: "square", alt: "A science activity" },
      { image: "/images/gallery-cultural.svg", title: "Cultural day", category: "Events", aspect: "portrait", alt: "Learners on cultural day" },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Testimonials. Samples only. Replace with real parent feedback.       */
  /* "demo: true" shows a "Sample" badge. Remove it for real testimonials. */
  /* ------------------------------------------------------------------ */
  testimonials: {
    heading: "What parents say",
    items: [
      {
        name: "[Parent name]",
        role: "Parent",
        message:
          "This space is for a real parent's words about their child's experience at the school.",
        image: "",
        demo: true,
      },
      {
        name: "[Parent name]",
        role: "Parent",
        message:
          "Add two or three short testimonials, with permission, once the school has collected them.",
        image: "",
        demo: true,
      },
      {
        name: "[Parent name]",
        role: "Guardian",
        message:
          "Testimonials build trust with new families. Remove the demo flag on each entry when it is real.",
        image: "",
        demo: true,
      },
    ],
  },

  /* News (only shown when features.news is true). Example item:
     { title: "Resumption date announced", date: "2026-09-08", summary: "…", link: "" } */
  news: [],

  /* ------------------------------------------------------------------ */
  /* Contact                                                             */
  /* ------------------------------------------------------------------ */
  contactPage: {
    heading: "Contact the school",
    intro: "Ask about admissions, book a visit or send a question. We will reply as soon as we can.",
    formTopics: ["Admission enquiry", "Book a school visit", "General question"],
  },
};
