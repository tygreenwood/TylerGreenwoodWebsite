/**
 * All site copy lives here. Edit this file to update the site — the page
 * components read from it and nothing else hard-codes text.
 */

export type Project = {
  /** URL-safe id, also used as the React key. */
  slug: string;
  name: string;
  /** One line shown under the title in the card. */
  tagline: string;
  /** A short paragraph: the problem, what you built, why it mattered. */
  description: string;
  /** Rendered as pills on the card. */
  stack: string[];
  /** Optional links — omit or leave undefined to hide the link. */
  repo?: string;
  demo?: string;
  /** Optional path under /public, e.g. "/images/projects/foo.png". */
  image?: string;
  /** Free text: "2025", "2024 — present", etc. */
  period?: string;
  /** Shown first in the Projects section. */
  featured?: boolean;
};

export type TimelineEntry = {
  id: string;
  /** Picks the marker icon and the label colour. */
  kind: "work" | "contract" | "education" | "research";
  role: string;
  org: string;
  location: string;
  start: string;
  /** `null` means "Present" — it also lights up the marker. */
  end: string | null;
  /** One line of context about the org, shown in muted text. */
  summary?: string;
  highlights: string[];
};

export const site = {
  name: "Tyler Greenwood",
  role: "Software Engineer",
  location: "Seattle, Washington",
  email: "t.r.greenwood.pdx@gmail.com",
  github: "https://github.com/tygreenwood",
  linkedin: "https://www.linkedin.com/in/tyler-greenwood-pdx/",
  resume: "", // e.g. "/resume.pdf" — leave "" to hide the résumé link
  // Credited in the footer's "about this site" line.
  source: "https://github.com/tygreenwood/TylerGreenwoodWebsite",
  host: { name: "Fly.io", url: "https://fly.io" },
};

export const home = {
  greeting: "Hi, I'm Tyler.",
  headline: "I build web software that people use every day.",
  intro:
    "Software engineer in Seattle. I've shipped front ends for a national car-buying platform and a university college of engineering, prototyped IoT alert systems end to end, and lately I build internal tools that take tedious work off engineers' desks. I care about the details that make software still pleasant a year after it ships.",
};

export const about = {
  // Each string is its own paragraph.
  paragraphs: [
    "I'm a software engineer in Seattle, with a B.S. and a Master of Engineering in Computer Science from Oregon State University. I've been writing code almost as long as I can remember, and I was drawn to computer science and software engineering because I like using these powerful machines to solve problems and automate solutions.",
    "Most of what I've built lives on the web. I owned the React account pages on driveway.com, led a redesign of Oregon State's degree pages that lifted engagement over 73%, and implemented a design system from scratch alongside the College of Engineering's lead designer. My emphasis on accessibility and scalability has allowed our team to ship features with a higher level of quality and efficiency than ever before.",
    "Lately I've also been contracting on internal tooling, which has pushed me to ship useful automations extremely quickly. At Altitude Aerospace I built an AI search over a vector database of PDF embeddings so engineers can find prior certification work instead of recreating it, and automated the document-release pipeline that used to require a fully staffed position.",
  ],
  // Grouped skills, rendered as a definition list in the About section.
  skills: [
    {
      label: "Languages",
      items: [
        "Python",
        "C / C++",
        "Rust",
        "Java",
        "C#",
        "Kotlin",
        "JavaScript / TypeScript",
        "Haskell",
        "HTML / CSS",
      ],
    },
    {
      label: "Frameworks & Libraries",
      items: [
        "React",
        "React Native",
        "Node.js",
        "Flask",
        "Material UI",
        "MJML",
        "Drupal",
      ],
    },
    {
      label: "Tools & Concepts",
      items: [
        "Agile",
        "MQTT",
        "Vector Databases",
        "Linux Administration",
        "Web Accessibility (WCAG)",
      ],
    },
  ],
  // Photos in the About section. Drop the matching files into public/images/.
  photos: [
    {
      src: "/images/judo.jpg",
      alt: "Tyler executing a throw during a judo competition",
      caption: "Kata Guruma: a judo throw.",
    },
    {
      src: "/images/backpacking.jpg",
      alt: "Tyler crossing a snowfield on a forested trail with a loaded backpack",
      caption: "Crossing a late-season snowfield in the Cascades.",
    },
    {
      src: "/images/graduation.jpg",
      alt: "Tyler in cap and gown at Oregon State University graduation",
      caption: "Graduating from Oregon State University.",
    },
  ],
};

/**
 * Rendered top to bottom in array order — current roles first, then reverse
 * chronological. Reorder here rather than sorting in the component, so the
 * story reads the way you want it to.
 */
export const timeline: TimelineEntry[] = [
  {
    id: "altitude-aerospace",
    kind: "contract",
    role: "Contracting Software Engineer",
    org: "Altitude Aerospace",
    location: "Portland, OR",
    start: "Oct 2025",
    end: null,
    summary:
      "Aerospace engineering and aircraft-certification firm — document-control and technical-records systems.",
    highlights: [
      "Built an AI search that surfaces similar PDFs from a technical prompt, letting engineers reuse prior work instead of recreating it.",
      "Designed a vector database of PDF embeddings, preconverting documents to keep the search API fast.",
      "Automated document releases through a web portal that finalizes PDFs, copies them to the shared drive, and sends release notifications — eliminating manual handoffs and a full-time document-handling position.",
      "Stood up and administer the Linux environment hosting the company's internal-tool APIs.",
    ],
  },
  {
    id: "osu-senior-web-developer",
    kind: "work",
    role: "Senior Web Developer",
    org: "Oregon State University — College of Engineering",
    location: "Corvallis, OR",
    start: "Jan 2024",
    end: null,
    summary:
      "The web team responsible for every external-facing Engineering site.",
    highlights: [
      "Implemented the College's modern design system from scratch with the lead designer.",
      "Led a redesign of the degree information pages, increasing engagement over 73% and key events such as applications over 40%.",
      "Redesigned high-level pages including the home page — 36% more new users and a 52% increase in key events.",
      "Met WCAG AA across new components while working toward AAA conformance.",
    ],
  },
  {
    id: "enercalc",
    kind: "contract",
    role: "Contracting Software Engineer",
    org: "EnerCalc",
    location: "Missoula, MT",
    start: "Jan 2026",
    end: "Jun 2026",
    summary:
      "Structural-engineering calculation software — their unreleased next-generation web platform.",
    highlights: [
      "Built the database-table functionality for the platform's React front end: the components that let users browse, sort, and edit structured engineering data.",
    ],
  },
  {
    id: "osu-meng",
    kind: "education",
    role: "Master of Engineering, Computer Science",
    org: "Oregon State University",
    location: "Corvallis, OR",
    start: "Sept 2024",
    end: "Jun 2026",
    highlights: [],
  },
  {
    id: "outsafe",
    kind: "work",
    role: "Software Engineer",
    org: "OutSafe",
    location: "Washington, D.C.",
    start: "Sept 2023",
    end: "Jun 2024",
    summary:
      "Startup building IoT safety and emergency-alert systems for school campuses and event venues.",
    highlights: [
      "Designed and prototyped a full end-to-end IoT alert system.",
      "Built the React Native app used to send preset alerts and custom messages to the server.",
      "Developed the Node.js server that ingests device messages and publishes them over MQTT.",
      "Implemented the system-level C++ that receives those messages on the device side.",
    ],
  },
  {
    id: "lithia-driveway",
    kind: "work",
    role: "Software Engineer",
    org: "Lithia & Driveway",
    location: "Portland, OR",
    start: "Jun 2022",
    end: "Sept 2023",
    summary: "Lithia Motors' online platform for buying and selling vehicles.",
    highlights: [
      "Owned the React front end powering user account pages on driveway.com.",
      "Shipped saved-state features — favourite vehicles, custom searches.",
      "Cut page load times with caching, making repeat visits near instant.",
      "Delivered an internal employee-recognition app in under eight weeks, covering nomination submission and administrative review.",
      "Led the Material UI 4 → 5 migration, improving performance and unlocking newer components.",
      "Authored MJML email templates that gave customers clearer purchase and account information.",
    ],
  },
  {
    id: "osu-web-developer",
    kind: "work",
    role: "Web Developer",
    org: "Oregon State University — College of Engineering",
    location: "Corvallis, OR",
    start: "Apr 2022",
    end: "Sept 2022",
    highlights: [
      "Maintained the live Drupal 7 site while contributing to its Drupal 9 rebuild.",
      "Partnered with faculty, staff, and state-government stakeholders to scope and implement UI changes.",
      "Introduced Agile tools and methods that streamlined the team's workflow and helped deliver the updated site on time.",
    ],
  },
  {
    id: "osu-research",
    kind: "research",
    role: "Research Assistant",
    org: "Oregon State University",
    location: "Corvallis, OR",
    start: "Feb 2021",
    end: "Jun 2021",
    summary: "Data privacy for smart-home and machine-learning systems.",
    highlights: [
      "Researched and built data-sanitization techniques that strip personal data not essential to a system's function.",
    ],
  },
  {
    id: "osu-bs",
    kind: "education",
    role: "B.S. Computer Science, Magna Cum Laude",
    org: "Oregon State University",
    location: "Corvallis, OR",
    start: "Sept 2020",
    end: "Jun 2024",
    highlights: [],
  },
];

export const projects: Project[] = [
  // TODO: replace these with real projects. The section and cards are already
  // wired up — the Projects section and its nav link appear as soon as there's
  // an entry here.
];
