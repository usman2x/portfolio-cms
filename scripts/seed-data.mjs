const paragraph = (text) => ({
  children: [
    {
      detail: 0,
      format: 0,
      mode: "normal",
      style: "",
      text,
      type: "text",
      version: 1,
    },
  ],
  direction: "ltr",
  format: "",
  indent: 0,
  type: "paragraph",
  version: 1,
});

const heading = (text) => ({
  ...paragraph(text),
  tag: "h2",
  type: "heading",
});

export const richText = (sections) => ({
  root: {
    children: sections.flatMap(({ body, title }) => [
      heading(title),
      ...body.map(paragraph),
    ]),
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
});

export const tags = [
  {
    name: "AI",
    slug: "ai",
    description: "Practical AI engineering and delivery.",
  },
  {
    name: "Backend",
    slug: "backend",
    description: "Backend systems and APIs.",
  },
  {
    name: "Java",
    slug: "java",
    description: "Java and Spring services.",
  },
  {
    name: "Case Study",
    slug: "case-study",
    description: "Portfolio project case studies.",
  },
  {
    name: "Data Platforms",
    slug: "data-platforms",
    description: "Data platform architecture and operations.",
  },
  {
    name: "Engineering",
    slug: "engineering",
    description: "Software engineering practice.",
  },
  {
    name: "Fintech",
    slug: "fintech",
    description: "Payments and financial technology.",
  },
  {
    name: "Cloud",
    slug: "cloud",
    description: "Cloud platforms, migrations, and operations.",
  },
  {
    name: "Mobile",
    slug: "mobile",
    description: "Mobile applications and platform delivery.",
  },
  { name: "Java", slug: "java", description: "Java and Spring engineering." },
  {
    name: "Security",
    slug: "security",
    description: "Application security and secure delivery.",
  },
  {
    name: "Real-time Systems",
    slug: "real-time",
    description: "Streaming and real-time product systems.",
  },
];

// Mirrors ../portfolio/testimonials (the source of truth): full text, relationship, company, date, order, featured.
export const testimonials = [
  {
    name: "Clinton Jones",
    role: "Product Leader in Data & Metadata Management",
    relationship: "manager",
    recommendationDate: "2024-10-19T00:00:00.000Z",
    quote:
      "He is able to deliver technical solutions based on a combination of functional and technical requirements and deliver software outcomes in areas where he feels comfortable. Where he lacks knowledge he will research and acquire the knowledge needed to grow his understanding of the problem space.",
    featured: true,
    sortOrder: 10,
  },
  {
    name: "Pascal Inard",
    role: "Former Software Development Manager",
    relationship: "manager",
    recommendationDate: "2024-10-16T00:00:00.000Z",
    quote: "Muhammad Usman was a key member of one of the software development teams I managed, and it was a real pleasure to have him in my team: he is a consistent, reliable, honest and conscientious person with an open mind and readily adaptable to any challenge he is given, so I heartily recommend him with no reservations.",
    featured: false,
    sortOrder: 20,
  },
  {
    name: "Harsha Siriwardana",
    role: "Staff Software Engineer",
    relationship: "manager",
    recommendationDate: "2024-10-14T00:00:00.000Z",
    quote: "I've had the privilege of working closely with Usman, a highly skilled Senior Developer on our team. His technical expertise, dedication, and problem-solving abilities consistently exceed expectations.\n\nUsman is particularly proficient in Java and he brings a deep understanding of software architecture and development best practices. He is always willing to take on complex challenges, and his code quality is impeccable. Beyond his technical prowess, Usman is an excellent collaborator. He actively contributes to discussions, offers valuable insights, and mentors junior team members with patience and clarity.\n\nWhat truly sets Usman apart is his proactive mindset and his ability to deliver high-quality solutions under tight deadlines. Whether it's optimizing performance, debugging tricky issues, or implementing new features, Usman can always be relied upon to get the job done.\n\nI wholeheartedly recommend Usman to any organization looking for a top-notch developer with a passion for excellence.",
    featured: false,
    sortOrder: 30,
  },
  {
    name: "Juan Franco Rosa",
    role: "Engineering Manager",
    company: "Alex Solutions",
    relationship: "manager",
    recommendationDate: "2024-10-11T00:00:00.000Z",
    quote: "I had the pleasure of working with Muhammad Usman for almost two years in Alex, and during that time, he consistently demonstrated outstanding performance as a highly capable software engineer. His role at Alex was particularly challenging, involving complex tasks that required both technical expertise, focus and resilience. Muhammad not only met these challenges head-on, but he also excelled in them. His attention to detail and structured approach to problem-solving enabled him to frequently exceed expectations. Easy to work with him, he is a great team player, always willing to lend a hand and support his colleagues in achieving the team's objectives. Muhammad's contributions have been invaluable, and I highly recommend him for any role he pursues.",
    featured: false,
    sortOrder: 40,
  },
  {
    name: "Talha Iftikhar",
    role: "Data Analytics and Business Intelligence Consultant",
    relationship: "colleague",
    recommendationDate: "2024-10-14T00:00:00.000Z",
    quote: "Had the privilege of working with Usman across many Project.\n\n- He is a top notch Java guy. - Proactive and attentive. - His Programming skills to find solutions is commendable. - I never found him stuck due to any technical difficulty, He always delivered. - The best thing about him is he can find loop holes with in the provided task very quickly. - Could be an important asset to any organization he works with.",
    featured: false,
    sortOrder: 50,
  },
  {
    name: "Dr.-Ing. Karl Magdans",
    role: "Head of Manufacturing Applications",
    relationship: "manager",
    recommendationDate: "2020-11-02T00:00:00.000Z",
    quote: "To whom it may concern,\n\nMuhammad approached me and asked if I could compose a recommendation letter for him. Since I met Muhammad as a kind and supportive person, I hereby happily follow his request.\n\nMy name is Karl Magdans and I am involved in digitalization topics -mainly in the manufacturing industry- since about 10 years.\n\nMuhammad was part of a project team I worked with during the course of 2016-2019. The project was about implementing a CPQ solution at a SMB located in Germany. Muhammad was responsible for developing the integration into adjacent systems (e.g. CRM) as well as for the continuous improvement of the Frontend (User Interface). Even though our collaboration was exclusively virtual, Muhammad was very dependable, responsive and provided excellent solutions. In areas where he lacked information/data, Muhammad was not shy to pro-actively ask for support.\n\nMuhammad and me parted ways as we changed the companies we work for. However, I'd not hesitate to work again with him. Muhammad is a valuable colleague and I can warmly recommend him for software development projects, esp. in the manufacturing industries (B2B and B2C).\n\nPlease do not hesitate to get in touch in case you would like to have a personal exchange.\n\nKind regards Dr. Karl Magdans",
    featured: false,
    sortOrder: 60,
  },
  {
    name: "Marc Müller",
    role: "Senior Software Developer",
    relationship: "colleague",
    recommendationDate: "2019-06-28T00:00:00.000Z",
    quote: "Muhammad was a very helpful and experienced full stack developer. Working together with him was a great pleasure for me.",
    featured: false,
    sortOrder: 70,
  },
].map((testimonial) => ({
  ...testimonial,
  sourceLabel: "LinkedIn recommendation",
  sourceUrl: "https://www.linkedin.com/in/usman313/details/recommendations",
  status: "published",
}));

export const services = [
  {
    title: "Technical co-founder",
    summary:
      "For founders turning an idea into a company. I own the architecture, the first build and the technical roadmap, and share the risk with you.",
    highlights: [
      "Problem framing and MVP scope",
      "Architecture, first build and early hires",
      "Equity or hybrid terms",
    ],
    contactIntent: "Project or services",
    ctaLabel: "Talk about co-founding",
    sortOrder: 10,
  },
  {
    title: "Product build",
    summary:
      "For a defined problem and a budget. I design and ship the product end to end, from data model to production, with AI only where it earns its place.",
    highlights: [
      "Fixed-scope MVPs and platform builds",
      "Fintech, retail and data integrations",
      "Production-ready, observable, cost-aware",
    ],
    contactIntent: "Project or services",
    ctaLabel: "Start a project",
    sortOrder: 20,
  },
  {
    title: "Architecture and AI consulting",
    summary:
      "For teams with a live platform. An outside review of architecture, AI features, data pipelines and cloud costs, with a plan you can act on.",
    highlights: [
      "Architecture and AI readiness reviews",
      "Inference and cloud cost reduction",
      "Hands-on fixes for the critical path",
    ],
    contactIntent: "Consultancy",
    ctaLabel: "Request a review",
    sortOrder: 30,
  },
].map((service) => ({ ...service, showOnHome: true, status: "published" }));

// Mirrors ../portfolio/profile/experience.md; highlights lead with business outcomes.
export const workExperience = [
  {
    company: "Tabrem",
    // The current role replaces the earlier independent-work entry.
    previousCompanyNames: ["Self-employed", "Self-Employed"],
    role: "Lead Product Engineer",
    period: "May 2026 - Present",
    // Not stated in the portfolio source; empty clears any stored value.
    location: "",
    website: "https://tabrem.com",
    sortOrder: 10,
    summary:
      "Leading product discovery and architecture for new AI products, from an accounting workflow to agri-trade finance.",
    highlights: [
      "Defining the MVP of an AI accounting platform that turns invoices from a client's inbox into reviewed, ERP-ready ledger entries.",
      "Building MandiOne, digital infrastructure for Pakistan's mandi trade that combines trade operations, running khata, collections and Shariah-compliant financing.",
      "Deployed a fine-tuned NVIDIA NeMo speech model behind a real-time WebSocket pipeline for a language-learning platform.",
    ],
  },
  {
    company: "Techling",
    role: "Principal Software Engineer",
    period: "Nov 2025 - Apr 2026",
    // Not stated in the portfolio source; empty clears any stored value.
    location: "",
    website: "https://techling.ai",
    sortOrder: 20,
    summary:
      "Owned an early-stage AI product end to end and served as technical architect for a multi-vendor auto-parts network.",
    highlights: [
      "Turned StreetApp around: stabilised the team and codebase, simplified onboarding and launched subscriptions, holding user retention at 80%.",
      "Architected CAPA's warehouse-to-dealership network on QuickBooks and Odoo sync, so warehouses sell to dealerships from their own ERP.",
      "Built LLM-based just-in-time order prediction with cost monitoring and caching to keep forecasts fast and affordable.",
    ],
  },
  {
    company: "The Neo Solutions",
    role: "Senior Software Engineer",
    period: "Jul 2025 - Oct 2025",
    // Not stated in the portfolio source; empty clears any stored value.
    location: "",
    website: "https://theneosolutions.com",
    sortOrder: 30,
    summary:
      "Scaled Seulah, a SAMA-licensed, Sharia-compliant microfinance platform in Saudi Arabia, to more than 25,000 customers.",
    highlights: [
      "Automated loan decisions by wiring KYC, AML, SIMAH, GOSI, NCGR and Lean Open Banking into one debt-burden pipeline, cutting onboarding friction and decision time.",
      "Cut third-party API costs with leaner integrations and shipped an admin portal for SAMA compliance audits.",
    ],
  },
  {
    company: "Alex Solutions",
    role: "Senior Software Engineer",
    period: "Feb 2023 - Oct 2024",
    location: "Remote",
    website: "https://www.alexsolutions.com.au",
    sortOrder: 40,
    summary:
      "Built metadata discovery and lineage connectors for an enterprise data-governance product used across 40+ data technologies.",
    highlights: [
      "Unified lineage for Snowflake, Databricks, Azure Data Factory, Synapse and dbt in single scanners, so customers no longer needed third-party lineage tools.",
      "Cut scanner run time by 10-20% and closed SQL-injection risks across 25+ scanners, supporting customer retention.",
    ],
  },
  {
    company: "Confiz",
    role: "Software Engineer (III)",
    period: "Oct 2019 - Feb 2023",
    location: "Lahore, Pakistan",
    website: "https://www.confiz.com",
    sortOrder: 50,
    summary:
      "Engineered Walmart's Unified Data Platform and cloud-migration tooling while leading delivery for an eight-person team.",
    highlights: [
      "Built a Kafka-based error reprocessing system from scratch; the MVP shipped in eight weeks and secured a high-value engagement.",
      "Helped move Walmart data, services and pipelines from on-premise to Azure, and cut senior training overhead by 90% with structured onboarding.",
    ],
  },
  {
    company: "Cloud Card Inc.",
    role: "Software Engineer",
    period: "Feb 2019 - Oct 2019",
    location: "Lahore, Pakistan",
    website: "https://www.cloudcardinc.com",
    sortOrder: 60,
    summary:
      "Built PCI-compliant, multi-tenant banking infrastructure for a US fintech's prepaid-card and payment products.",
    highlights: [
      "Shipped an embedded-finance API for cards, payments and fees, so client teams could launch financial products without building banking rails.",
      "Wrapped a legacy SOAP payments module in REST, halving client integration effort.",
    ],
  },
  {
    company: "Trangolabs",
    role: "Software Developer (Java)",
    period: "Jan 2017 - Feb 2019",
    location: "Lahore, Pakistan",
    website: "https://www.trangolabs.com",
    sortOrder: 70,
    summary:
      "Customised an enterprise CPQ engine for a major German pump manufacturer while leading and growing a Java team.",
    highlights: [
      "Cut quotation cycles for complex industrial pump systems from days to minutes inside the client's CRM.",
      "Led three developers, interviewed 20+ candidates, and hired and trained five team members.",
    ],
  },
].map((entry) => ({ ...entry, status: "published" }));

const optionRows = (values) => values.map((value) => ({ label: value, value }));

export const globals = {
  "site-settings": {
    name: "Muhammad Usman",
    shortLabel: "AI product architect and technical co-founder",
    professionalTitle: "AI Product Architect and Technical Co-founder",
    defaultSeoTitle: "Muhammad Usman",
    defaultSeoDescription:
      "AI product architect helping startups and enterprises turn fintech, retail and big-data problems into working products with the team, data and budget they already have.",
    logoPath: "/images/usman.png",
    logoAlt: "Muhammad Usman",
    portraitPath: "/images/usman.jpg",
    portraitAlt: "Portrait of Muhammad Usman",
    resumeLink:
      "https://drive.google.com/file/d/1HYaTYlszhcU58GmjxboLlOkTfHRwQEoA/view?usp=sharing",
    email: "hafizusman313@hotmail.com",
    phone: "+923217995855",
    meetingLink: "https://calendar.app.google/baTVjxZDoBMnjdip9",
    socialLinks: [
      { name: "GitHub", url: "https://github.com/usman2x" },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/usman313" },
    ],
    navigation: [
      { label: "About", url: "/about/" },
      { label: "Projects", url: "/projects/" },
      { label: "Articles", url: "/blog/" },
      { label: "Testimonials", url: "/testimonials/" },
      { label: "Contact", url: "/contact/" },
      {
        label: "Book a call",
        url: "https://calendar.app.google/baTVjxZDoBMnjdip9",
        isPrimary: true,
      },
    ],
    footerDescription:
      "AI product architect and technical co-founder. I turn fintech, retail and data problems into products that ship, using the resources you already have.",
    bookCall: {
      title: "Have a problem worth building a product around?",
      description:
        "Book a focused call. We'll pin down the problem, what you already have, and the smallest product that proves it.",
      buttonLabel: "Book a call",
    },
  },
  "home-page": {
    seoTitle: "AI Product Architect and Technical Co-founder",
    seoDescription:
      "Muhammad Usman helps founders and enterprise teams turn fintech, retail and big-data problems into AI products, starting from the problem and the resources already in hand.",
    eyebrow: "AI Product Architect · Fintech · Retail · Big Data",
    headline: "From business problem to working AI product.",
    supportingText:
      "10+ years building fintech, retail and big-data products for startups and enterprises such as Walmart. I start with the problem and the people, data and budget you already have, then architect and ship the smallest product that proves it, as your technical co-founder, delivery partner or advisor.",
    trustChips: [
      "9+ Years Experience",
      "Walmart & Global Teams",
      "Java + Python + React",
      "Data + AI Platforms",
    ].map((text) => ({ text })),
    primaryCtaLabel: "Book a call",
    secondaryCtaLabel: "See selected work",
    primaryCtaNote:
      "A focused call on your problem, what you already have, and the smallest product worth building.",
    postHeroLine:
      "Latest articles, selected work, and practical ways to start a conversation are below.",
    proofTitle: "Trusted by teams at",
    proofCompanies: [
      "Walmart",
      "Seulah",
      "StreetApp",
      "CAPA",
      "Alex Solutions",
      "Tacton",
    ].map((text) => ({ text })),
    proofStats: [
      { value: "25K+", label: "customers on a lending platform scaled in Saudi Arabia" },
      { value: "80%", label: "user retention after an AI marketplace turnaround" },
      { value: "Minutes", label: "to quote complex industrial systems, down from days" },
      { value: "10+", label: "years taking products from idea to production" },
    ],
    writingsTitle: "Articles",
    writingsDescription:
      "Practical notes on building reliable software, data platforms, and useful AI systems.",
    writingsArchiveLabel: "All articles",
    writingsLimit: 2,
    projectsTitle: "Selected work",
    projectsArchiveLabel: "All case studies",
    servicesTitle: "Ways to work together",
    servicesDescription:
      "Choose the involvement your stage needs: a partner who owns the product, a build you can hand over, or a second opinion before you commit.",
    servicesLimit: 4,
    // The first three case studies by `order` in ../portfolio/projects.
    featuredProjectSlugs: [
      "capa-multi-vendor-warehouse",
      "streetapp-ai-marketplace",
      "seulah-digital-microfinance",
    ],
    testimonialsEyebrow: "Recommendation",
    testimonialsTitle: "Trusted by the people I’ve worked with",
    testimonialsDescription:
      "One direct perspective from an engineering leader, with more available in the full archive.",
    testimonialsArchiveLabel: "Read all testimonials",
    testimonialLimit: 1,
  },
  "about-page": {
    seoTitle: "About",
    seoDescription:
      "AI product architect with 10+ years across fintech, retail and big data, helping startups and enterprises turn real problems into products.",
    eyebrow: "About",
    title: "A pragmatic engineer who starts with the problem, not the technology.",
    summary: [
      "I’m an AI product architect with 10+ years of building fintech, retail and big-data products for startups and global enterprises, including Walmart. My work starts with the business problem and the resources already in the room: the team, the data, the budget and the systems that must keep running.",
      "From there I design the smallest product that solves the problem and grow it into a platform: a SAMA-licensed lending engine in Saudi Arabia, a B2B network for US auto-parts warehouses, an AI marketplace turnaround in France, and data platforms at Walmart scale. I work as a technical co-founder, a delivery partner or an advisor, depending on what the stage needs.",
    ].map((text) => ({ text })),
    video: {
      eyebrow: "Meet the engineer",
      title: "A quick introduction",
      description:
        "A short introduction to my background, the systems I build, and how I approach complex engineering work.",
      url: "https://youtu.be/tT3TjJnuhxQ?si=l3TaUHi-mHH5lhQ4",
      transcriptLabel: "Read video transcript",
      transcript:
        "I introduce my background as a full-stack engineer, the product and platform problems I work on, and the practical, systems-minded approach I bring to complex delivery.",
    },
    experienceTitle: "Work experience",
    strengthsTitle: "Core strengths",
    // Resolved to the testimonial's id by seed-api.mjs.
    featuredTestimonialName: "Pascal Inard",
    strengths: [
      {
        title: "Problem-first product architecture",
        description:
          "Framing the real problem, sizing the smallest useful product, and designing systems that grow without rewrites.",
      },
      {
        title: "Applied AI that earns its place",
        description:
          "LLM features, RAG, agentic workflows, forecasting and speech, with cost monitoring and observability from day one.",
      },
      {
        title: "Fintech and regulated platforms",
        description:
          "Lending, payments, KYC and open banking under SAMA and PCI rules: multi-tenant, API-first and audit-ready.",
      },
      {
        title: "Data platforms and integrations",
        description:
          "Big-data pipelines, streaming, lineage and ERP integrations such as QuickBooks and Odoo that turn scattered data into a working product.",
      },
    ],
  },
  "testimonials-page": {
    seoTitle: "Testimonials",
    seoDescription:
      "Recommendations from engineering managers, product leaders, and colleagues who have worked directly with Muhammad Usman.",
    eyebrow: "Testimonials",
    title: "What collaborators say about working with me.",
    description:
      "Direct recommendations from managers and engineering colleagues across enterprise platforms, product teams, and consulting engagements.",
  },
  "quote-page": {
    seoTitle: "Contact Me",
    seoDescription:
      "Talk to Muhammad Usman about a technical co-founder partnership, a product build, architecture and AI consulting, or send feedback.",
    eyebrow: "Contact",
    title: "Start a conversation",
    description:
      "Looking for a technical co-founder, a product build or a second opinion? Choose what brings you here and I’ll ask only what matters for that.",
    process: [
      {
        title: "Choose your reason",
        description: "The form adapts so you only see relevant questions.",
      },
      {
        title: "Share the essentials",
        description:
          "A short note is enough for feedback; work enquiries can include scope and timing.",
      },
      {
        title: "Choose whether to connect",
        description:
          "Feedback can be anonymous, while enquiries include the details needed for a reply.",
      },
    ],
    responseNote: "Replies usually arrive within 1–2 business days.",
    privacyNote: "Your details are used only to respond to this message.",
    nextStepsTitle: "What happens next",
    alternativesTitle: "Prefer a conversation?",
    callLabel: "Book a short call",
    emailLinkLabel: "Send an email",
    formEyebrow: "Contact",
    formTitle: "Start with your intent",
    requiredFieldsLabel: "Required fields",
    scopeLegend: "Scope and constraints",
    selectPlaceholder: "Select an option",
    helpTypeLabel: "What brings you here?",
    workTypeLabel: "What type of engagement is this?",
    timelineLabel: "What is your timeline?",
    budgetLabel: "What is your budget or engagement range?",
    helpTypes: optionRows([
      "Feedback",
      "Project or services",
      "Consultancy",
      "General message",
    ]),
    workTypes: optionRows([
      "Technical co-founder / founding partner",
      "Fixed-scope product build",
      "Ongoing engineering partnership",
      "Architecture or AI review",
      "Short consultation",
    ]),
    timelines: optionRows([
      "ASAP",
      "Within 2 weeks",
      "Within 1 month",
      "Within 1 to 3 months",
      "Flexible / exploring",
    ]),
    budgets: optionRows([
      "Under $2k",
      "$2k to $5k",
      "$5k to $10k",
      "$10k+",
      "Equity or hybrid (co-founder)",
      "Prefer to discuss first",
    ]),
    contactMethods: optionRows(["Email", "WhatsApp", "Schedule a call"]),
    contextLabel: "What should I know before replying?",
    contextPlaceholder:
      "What are you trying to build, improve, or fix? Include any useful context.",
    contextLegend: "Your message",
    contextHelp: "Include goals, current state, and the outcome you need.",
    contactLegend: "Contact details",
    nameLabel: "Name",
    namePlaceholder: "Enter your name",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email",
    companyLabel: "Company or project name",
    companyPlaceholder: "Optional",
    preferredContactLabel: "Preferred contact method",
    submitLabel: "Send message",
    submittingLabel: "Sending...",
    successMessage:
      "Thanks — your message has been received. I’ll reply if you requested a response.",
    errorMessage:
      "Your message could not be sent. Please try again or use the email link below.",
    successEyebrow: "Message received",
    successTitle: "Thanks for reaching out.",
    sendAnotherLabel: "Send another message",
  },
  "archive-settings": {
    writingsTitle: "Articles",
    writingsDescription:
      "Practical notes on building reliable software, data platforms, and useful AI systems.",
    writingsSeoDescription:
      "Software engineering notes on backend systems, data platforms, cloud delivery, and practical AI work.",
    filterTitle: "Browse by topic",
    filterDescription:
      "Choose a topic to narrow the archive while keeping the articles easy to scan.",
    postsPerPage: 6,
    writingCtaLabel: "Need help with similar work?",
    readArticleLabel: "Read article",
    projectsTitle: "Projects",
    projectsDescription:
      "A focused selection of systems and products shaped around real delivery constraints and measurable outcomes.",
    projectsSeoDescription:
      "Selected software engineering, data platform, cloud, and product delivery projects by Muhammad Usman.",
  },
  "project-template": {
    backLabel: "Back to all projects",
    stackLabel: "Tech stack",
    linkLabel: "Project link",
    defaultLinkLabel: "View external reference",
    linkDescription:
      "Explore the external reference for additional context around the project.",
    storyTitle: "Case study",
    previousLabel: "Previous project",
    nextLabel: "Next project",
  },
  "system-pages": {
    notFoundTitle: "This page doesn’t exist",
    notFoundMessage: "It may have moved, or the link may be mistyped.",
    thankYouTitle: "Thank you",
    thankYouMessage:
      "Your message has been received. I’ll get back to you soon.",
    homeButtonLabel: "Back to home",
  },
};

const rawPosts = [
  {
    title: "Data Landscape Scanner",
    slug: "data-landscape-scanner",
    excerpt:
      "Cloud-agnostic metadata discovery and lineage framework supporting 40+ enterprise data technologies.",
    seoTitle: "Data Landscape Scanner | Project Case Study",
    seoDescription:
      "Case study covering metadata discovery, connector security, lineage, and scanner optimization.",
    readingTimeMinutes: 4,
    featured: false,
    tagSlugs: ["case-study", "data-platforms", "backend"],
    sections: [
      {
        title: "Context",
        body: [
          "Enterprise data teams needed dependable discovery, normalized metadata, and end-to-end lineage across databases, warehouses, BI tools, and cloud platforms.",
        ],
      },
      {
        title: "Contribution",
        body: [
          "I built and enhanced scanners for Azure Synapse, Azure Data Factory, Databricks on AWS and Azure, Snowflake, dbt, and other systems. The work included parameterized SQL and pipeline parsing, metadata relationships, streams, tags, and external lineage.",
          "I optimized H2 queries and Groovy/Python processing to reduce memory use and improve execution speed by 10–20%, remediated SQL-injection risks across 25+ scanners, and migrated Jenkins delivery pipelines to GitLab CI/CD.",
        ],
      },
      {
        title: "Outcome",
        body: [
          "The framework supported 40+ technologies and gave customers a safer, faster foundation for discovery, impact analysis, root-cause investigation, governance, and compliance.",
        ],
      },
    ],
  },
  {
    title: "Unified Data Platform (UDP)",
    slug: "unified-data-platform",
    excerpt:
      "Walmart's centralized ETL ecosystem for ingestion, Spark/Beam processing, Airflow orchestration, and governance.",
    seoTitle: "Unified Data Platform | Project Case Study",
    seoDescription:
      "Case study covering backend platform capabilities, Airflow integration, quality controls, and automated testing.",
    readingTimeMinutes: 4,
    featured: false,
    tagSlugs: ["case-study", "data-platforms", "backend"],
    sections: [
      {
        title: "Problem",
        body: [
          "Engineering teams were spending too much time managing fragmented infrastructure, custom connectors, scheduling, and validation instead of delivering dependable data products.",
        ],
      },
      {
        title: "Approach",
        body: [
          "I engineered fault-tolerant backend and Notebook APIs, Apache Airflow integration, Kafka and database ingestion, and YAML-driven workflows running on Apache Beam and Spark.",
          "Automated end-to-end validation and SonarQube quality gates eliminated P1 issues, reduced OWASP exposure, and raised test coverage across repositories from 10% to 80%.",
        ],
      },
      {
        title: "Result",
        body: [
          "The platform standardized large-scale ingestion and orchestration, accelerated time to production, and improved operational visibility while meeting strict production SLAs without escalations.",
        ],
      },
    ],
  },
  {
    title: "Error Reprocessing Tool",
    slug: "error-reprocessing-tool",
    excerpt:
      "Kafka and Azure platform for monitoring and replaying millions of cloud-migration records.",
    seoTitle: "Error Reprocessing Tool | Project Case Study",
    seoDescription:
      "Case study covering migration observability, structured recovery workflows, and operational reliability.",
    readingTimeMinutes: 3,
    featured: false,
    tagSlugs: ["case-study", "data-platforms", "engineering"],
    sections: [
      {
        title: "Operational challenge",
        body: [
          "Data teams migrating on-premise systems to Azure needed near-real-time visibility into failures across domains and subdomains, plus reliable automated and manual recovery.",
        ],
      },
      {
        title: "Solution",
        body: [
          "I designed the Kafka-based pipeline, Spring Boot synchronization and REST services, a web dashboard for filtering and manual replay, and a scheduler for automated retries.",
          "The containerized components ran on Azure Container Instances with Event Hubs and Azure SQL, enabling fast rollout across markets.",
        ],
      },
      {
        title: "Impact",
        body: [
          "The platform helped teams migrate millions of records daily with domain-level transparency, faster root-cause analysis, controlled replay, and lower operational risk.",
        ],
      },
    ],
  },
  {
    title: "CAPA Multi-Vendor Warehouse Platform",
    slug: "capa-multi-vendor-warehouse",
    excerpt:
      "A multi-tenant B2B procurement network connecting US auto dealerships with warehouse inventory and accounting systems.",
    seoTitle: "CAPA Multi-Vendor Warehouse Platform | Case Study",
    seoDescription:
      "Multi-tenant warehouse procurement, ERP synchronization, zero-friction onboarding, and AI-assisted order forecasting.",
    readingTimeMinutes: 5,
    featured: true,
    tagSlugs: ["case-study", "backend", "ai", "cloud"],
    sections: [
      {
        title: "The challenge",
        body: [
          "Dealerships needed to buy from a broad warehouse network without forcing suppliers to abandon QuickBooks, Odoo, or their existing operational systems.",
        ],
      },
      {
        title: "Architecture and delivery",
        body: [
          "I engineered a multi-tenant synchronization layer for products, prices, discounts, customers, orders, and invoices, with onboarding workflows designed to import historic business data with minimal friction.",
          "The portal unified multiple warehouses behind one purchasing experience while preserving each supplier’s underlying ERP and accounting workflow.",
        ],
      },
      {
        title: "Intelligent operations",
        body: [
          "I added LLM-assisted order forecasting based on purchase history and warehouse-level cost visibility so administrators could monitor AI recommendations and procurement economics.",
        ],
      },
    ],
  },
  {
    title: "StreetApp AI Marketplace",
    slug: "streetapp-ai-marketplace",
    excerpt:
      "Product and engineering turnaround for an AI-driven peer-to-peer marketplace in France.",
    seoTitle: "StreetApp AI Marketplace | Case Study",
    seoDescription:
      "How product telemetry, backend refactoring, AI observability, and delivery improvements stabilized retention and enabled monetization.",
    readingTimeMinutes: 6,
    featured: true,
    tagSlugs: ["case-study", "ai", "backend", "mobile"],
    sections: [
      {
        title: "Starting point",
        body: [
          "StreetApp had an inconsistent early-stage codebase, database memory leaks, slow delivery, unclear product direction, and limited insight into how users moved through the marketplace.",
        ],
      },
      {
        title: "Product and platform turnaround",
        body: [
          "I standardized FastAPI repositories, improved sprint execution and ownership, fixed data duplication and session leakage, and introduced end-to-end journey telemetry across the supply-and-demand funnel.",
          "I also introduced QA automation, database-level consistency checks, and an AI observability layer for prompts, consumption, and governance.",
        ],
      },
      {
        title: "Outcome",
        body: [
          "The work turned an unstable prototype into a measurable product, stabilized retention around 80%, improved delivery with the same team, and established premium subscriptions and advertising lifecycle insights.",
        ],
      },
    ],
  },
  {
    title: "Enterprise CPQ Engine",
    slug: "enterprise-cpq-engine",
    excerpt:
      "Customized Configure, Price, Quote platform for a German pump manufacturer's CRM sales workflow.",
    seoTitle: "Enterprise CPQ Engine | Project Case Study",
    seoDescription:
      "Full-stack Java CPQ customization, concurrent quotation processing, team leadership, and faster enterprise sales workflows.",
    readingTimeMinutes: 5,
    featured: false,
    tagSlugs: ["case-study", "java", "backend", "engineering"],
    sections: [
      {
        title: "Business problem",
        body: [
          "Sales teams needed to configure complex pump products for residential, industrial, and sewerage use cases directly inside their CRM without spending days assembling quotations.",
        ],
      },
      {
        title: "Engineering contribution",
        body: [
          "I delivered full-stack Java customizations, an in-memory Pub-Sub model for concurrent quote processing, JSON-backed quotation grouping, and a multilevel expanding interface for managing related configurations.",
        ],
      },
      {
        title: "Delivery impact",
        body: [
          "The customized engine reduced quotation work from days to hours, and I helped scale the team by leading three developers, interviewing more than 20 candidates, and training five new team members.",
        ],
      },
    ],
  },
  {
    title: "Seulah Digital Microfinance Platform",
    slug: "seulah-digital-microfinance",
    excerpt:
      "SAMA-licensed, Sharia-compliant digital lending platform scaled to more than 25,000 customers in Saudi Arabia.",
    seoTitle: "Seulah Digital Microfinance Platform | Case Study",
    seoDescription:
      "Regulated fintech delivery across digital lending, KYC, credit checks, open banking, compliance, and recurring loans.",
    readingTimeMinutes: 5,
    featured: true,
    tagSlugs: ["case-study", "fintech", "backend", "cloud"],
    sections: [
      {
        title: "Regulated lending at scale",
        body: [
          "The platform needed to automate loan applications and due diligence while meeting SAMA, AML, SIMAH, and Sharia-compliant operational requirements.",
        ],
      },
      {
        title: "Integrations and platform work",
        body: [
          "I built administrative loan workflows and integrated KYC, SIMAH, GOSI, NCGR, and Lean Open Banking services for automated decisions and debt-burden-ratio validation.",
          "I also maintained database schemas and Liquibase migrations, improved third-party integration reliability and cost, added multilingual support, recurring loans, and flexible products for special customer segments.",
        ],
      },
      {
        title: "Outcome",
        body: [
          "The API-first platform supported more than 25,000 customers while reducing onboarding friction, improving decision speed, and creating a foundation for future e-commerce and BNPL use cases.",
        ],
      },
    ],
  },
  {
    title: "Real-Time NeMo ASR Pipeline",
    slug: "real-time-nemo-asr",
    excerpt:
      "Low-latency speech-to-text connecting browser audio to NVIDIA NeMo via Java and Python WebSockets.",
    seoTitle: "Real-Time NVIDIA NeMo ASR Pipeline | Case Study",
    seoDescription:
      "Real-time audio streaming with Angular, Spring Boot WebSockets, Python, Google Cloud, and NVIDIA NeMo.",
    readingTimeMinutes: 4,
    featured: false,
    tagSlugs: ["case-study", "ai", "java", "cloud"],
    sections: [
      {
        title: "Goal",
        body: [
          "A language-learning product needed responsive browser transcription using a fine-tuned speech recognition model for its target language.",
        ],
      },
      {
        title: "System design",
        body: [
          "I deployed NVIDIA NeMo as a Python inference service on Google Cloud and designed a full-duplex WebSocket pipeline through Spring Boot to an Angular frontend.",
          "The solution coordinated streaming audio, real-time transcription results, backend APIs, and frontend state across three technology stacks.",
        ],
      },
      {
        title: "Result",
        body: [
          "The architecture delivered low-latency in-browser transcription and gave the client a maintainable path for using its custom ASR model in an interactive learning experience.",
        ],
      },
    ],
  },
  {
    title: "Multi-Tenant Banking-as-a-Service Platform",
    slug: "banking-as-a-service-platform",
    excerpt:
      "PCI-compliant platform supporting prepaid cards, payments, fees, KYC, notifications, and customer preferences.",
    seoTitle: "Multi-Tenant Banking-as-a-Service Platform | Case Study",
    seoDescription:
      "Six-plus Spring microservices, AWS infrastructure, payment processing, KYC, fee management, and SOAP-to-REST integration.",
    readingTimeMinutes: 5,
    featured: false,
    tagSlugs: ["case-study", "fintech", "java", "cloud"],
    sections: [
      {
        title: "Platform scope",
        body: [
          "A US fintech startup needed a multi-tenant Banking-as-a-Service foundation so B2B customers could issue and manage prepaid cards without building financial infrastructure themselves.",
        ],
      },
      {
        title: "Engineering delivery",
        body: [
          "I built and supported more than six Spring services covering card activation and KYC, transaction processing, configurable fees, notifications, customer preferences, and payment middleware.",
          "The system used AWS SQS and EC2 for asynchronous processing and transformed legacy third-party SOAP capabilities into easier-to-integrate REST APIs.",
        ],
      },
      {
        title: "Impact",
        body: [
          "The platform supported the full digital payment lifecycle, improved operational visibility, and reduced integration effort for downstream product teams by approximately 50%.",
        ],
      },
    ],
  },
];

// Roles and order mirror ../portfolio/projects/<slug>/index.md. Archives list projects by
// publishedAt (newest first), so publishedAt encodes the source `order` (1 = newest).
const projectOrderDate = (order) => new Date(Date.UTC(2026, 8, 30 - order)).toISOString();

const projectEnhancements = {
  "capa-multi-vendor-warehouse": {
    projectRole: "Lead Full-Stack Engineer",
    projectOutcome: "Warehouses sell to dealerships straight from their own ERP, with no re-keying",
    publishedAt: projectOrderDate(1),
    referenceCaseStudy: "capa.md",
    projectGalleryDirectory: "Capa",
    projectGalleryCoverMatch: "12.11.16",
  },
  "streetapp-ai-marketplace": {
    projectRole: "Senior Product Engineer",
    projectOutcome: "80% user retention and the platform's first subscription revenue",
    publishedAt: projectOrderDate(2),
    referenceCaseStudy: "streetapp.md",
    projectGalleryDirectory: "StreetApp",
    projectGalleryCoverMatch: "11.54.21",
  },
  "seulah-digital-microfinance": {
    projectRole: "Senior Backend Engineer",
    projectOutcome: "25K+ customers served through automated, SAMA-compliant loan decisions",
    publishedAt: projectOrderDate(3),
    referenceCaseStudy: "seulah.md",
    projectGalleryDirectory: "Seulah",
  },
  "data-landscape-scanner": {
    projectRole: "Senior Software Engineer",
    projectOutcome: "One lineage engine across 40+ technologies replaced customers' third-party tools",
    publishedAt: projectOrderDate(4),
    referenceCaseStudy: "rover.md",
    projectGalleryDirectory: "rover",
    projectGalleryCoverMatch: "Screenshot 2026-07-16",
  },
  "enterprise-cpq-engine": {
    projectRole: "Full-Stack Java Engineer and Team Lead",
    projectOutcome: "Complex industrial quotes in minutes instead of days, inside the CRM",
    publishedAt: projectOrderDate(5),
    referenceCaseStudy: "cpq.md",
    projectGalleryDirectory: "CPQ",
    projectGalleryCoverMatch: "11.46.27",
  },
  "banking-as-a-service-platform": {
    projectRole: "Backend Engineer",
    projectOutcome: "A US fintech offered white-label card issuing without building banking rails",
    publishedAt: projectOrderDate(6),
    referenceCaseStudy: "embedding-finance.md",
  },
  "error-reprocessing-tool": {
    projectRole: "Technical Lead",
    projectOutcome: "Millions of migration records a day, recovered automatically instead of by hand",
    publishedAt: projectOrderDate(7),
    referenceCaseStudy: "ert.md",
  },
  "unified-data-platform": {
    projectRole: "Backend Engineer and Team Lead",
    projectOutcome: "Walmart teams build data pipelines from YAML instead of custom infrastructure",
    publishedAt: projectOrderDate(8),
    referenceCaseStudy: "udp.md",
    projectGalleryFiles: ["UDP.jpg"],
  },
  "real-time-nemo-asr": {
    projectRole: "Full-Stack and AI Integration Engineer",
    projectOutcome: "Real-time browser transcription on a fine-tuned speech model",
    publishedAt: projectOrderDate(9),
    referenceCaseStudy: "nemo-asr.md",
    projectGalleryFiles: ["ASR.png"],
  },
};

export const posts = rawPosts.map((post) => ({
  ...post,
  ...(projectEnhancements[post.slug] || {}),
}));
