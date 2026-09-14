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
    quote:
      "Muhammad Usman was a key member of one of the software development teams I managed, and it was a real pleasure to have him in my team: he is a consistent, reliable, honest and conscientious person with an open mind and readily adaptable to any challenge he is given, so I heartily recommend him with no reservations.",
    featured: true,
    sortOrder: 20,
  },
  {
    name: "Harsha Siriwardana",
    role: "Staff Software Engineer",
    relationship: "manager",
    recommendationDate: "2024-10-14T00:00:00.000Z",
    quote:
      "His technical expertise, dedication, and problem-solving abilities consistently exceed expectations. Beyond his technical prowess, Usman is an excellent collaborator. He actively contributes to discussions, offers valuable insights, and mentors junior team members with patience and clarity.",
    featured: true,
    sortOrder: 30,
  },
  {
    name: "Juan Franco Rosa",
    role: "Engineering Manager",
    relationship: "manager",
    recommendationDate: "2024-10-11T00:00:00.000Z",
    quote:
      "He consistently demonstrated outstanding performance as a highly capable software engineer. His attention to detail and structured approach to problem-solving enabled him to frequently exceed expectations.",
    featured: true,
    sortOrder: 40,
  },
  {
    name: "Talha Iftikhar",
    role: "Data Analytics and Business Intelligence Consultant",
    relationship: "colleague",
    recommendationDate: "2024-10-14T00:00:00.000Z",
    quote:
      "He is a top notch Java guy—proactive and attentive. His programming skills to find solutions are commendable. I never found him stuck due to any technical difficulty; he always delivered.",
    featured: false,
    sortOrder: 50,
  },
  {
    name: "Dr.-Ing. Karl Magdans",
    role: "Head of Manufacturing Applications",
    relationship: "manager",
    recommendationDate: "2020-11-02T00:00:00.000Z",
    quote:
      "Muhammad was very dependable, responsive and provided excellent solutions. In areas where he lacked information or data, Muhammad was not shy to proactively ask for support.",
    featured: false,
    sortOrder: 60,
  },
  {
    name: "Marc Müller",
    role: "Senior Software Developer",
    relationship: "colleague",
    recommendationDate: "2019-06-28T00:00:00.000Z",
    quote:
      "Muhammad was a very helpful and experienced full stack developer. Working together with him was a great pleasure for me.",
    featured: false,
    sortOrder: 70,
  },
].map((testimonial) => ({
  ...testimonial,
  sourceLabel: "LinkedIn recommendation",
  status: "published",
}));

export const workExperience = [
  {
    company: "Self-Employed",
    role: "Independent Professional",
    period: "Jan 2025 - Present",
    location: "Remote",
    website: "https://www.linkedin.com/in/usman313",
    sortOrder: 10,
    summary:
      "Delivering full-stack, event-driven, headless CMS, and real-time AI systems across Java, Spring Boot, Kafka, Python, React, and Angular.",
    highlights: [
      "Deployed NVIDIA NeMo ASR on Google Cloud and connected Python inference, Spring Boot WebSockets, and Angular for low-latency browser transcription.",
      "Built scalable event-driven microservices and real-time data pipelines with Java, Spring Boot, and Kafka.",
      "Delivered fast, SEO-friendly React and Gatsby frontends integrated with headless CMS and GraphQL APIs.",
    ],
  },
  {
    company: "Alex Solutions",
    role: "Senior Software Engineer",
    period: "Feb 2023 - Oct 2024",
    location: "Remote",
    website: "https://www.alexsolutions.com.au",
    sortOrder: 20,
    summary:
      "Built and enhanced enterprise metadata discovery, cataloguing, and lineage capabilities across more than 40 data technologies.",
    highlights: [
      "Implemented Azure Synapse and ADF serverless SQL parsing and pipeline metadata extraction for end-to-end lineage.",
      "Built cloud-agnostic Databricks scanners for Azure and AWS and expanded Snowflake streams, tags, and relationship cataloguing.",
      "Optimized H2 queries and Groovy/Python processing to reduce memory use and improve scanner execution by 10–20%.",
      "Remediated SQL-injection risks across 25+ scanners and migrated Jenkins delivery pipelines to GitLab CI/CD.",
    ],
  },
  {
    company: "Confiz",
    role: "Software Engineer (III)",
    period: "Oct 2019 - Feb 2023",
    location: "Lahore, Pakistan",
    website: "https://www.confiz.com",
    sortOrder: 30,
    summary:
      "Engineered Walmart’s backend-heavy Unified Data Platform and cloud-migration tooling while leading delivery, quality, and team development initiatives.",
    highlights: [
      "Built fault-tolerant, Notebook, and Airflow APIs for enterprise ETL orchestration and resolved critical production issues within strict SLAs.",
      "Integrated SonarQube security gates and expanded automated test coverage from 10% to 80%.",
      "Designed and shipped a Kafka-based error processing platform MVP in eight weeks, then deployed it for additional clients.",
      "Led an eight-person team and created onboarding practices that reduced senior-resource training overhead by 90%.",
    ],
  },
  {
    company: "Cloud Card Inc.",
    role: "Software Engineer",
    period: "Feb 2019 - Oct 2019",
    location: "Lahore, Pakistan",
    website: "https://www.cloudcardinc.com",
    sortOrder: 40,
    summary:
      "Built PCI-compliant, multi-tenant banking infrastructure supporting the complete prepaid-card and digital-payment lifecycle.",
    highlights: [
      "Delivered six-plus Spring microservices for card activation, KYC, payments, fees, notifications, and customer preferences.",
      "Used AWS SQS and EC2 for resilient asynchronous processing and production delivery.",
      "Wrapped third-party SOAP payment capabilities with REST APIs, reducing client integration effort by 50%.",
    ],
  },
  {
    company: "Trangolabs",
    role: "Software Developer (Java)",
    period: "Jan 2017 - Feb 2019",
    location: "Lahore, Pakistan",
    website: "https://www.trangolabs.com",
    sortOrder: 50,
    summary:
      "Customized and deployed a high-scale CPQ engine for a major German manufacturer while leading and growing a Java delivery team.",
    highlights: [
      "Reduced complex quotation processing from days to hours through tailored CPQ workflows.",
      "Led three developers, interviewed 20+ candidates, and hired and trained five team members.",
      "Built an in-memory Pub-Sub model and multilevel quotation grouping interface for concurrent quote management.",
    ],
  },
].map((entry) => ({ ...entry, status: "published" }));

const optionRows = (values) => values.map((value) => ({ label: value, value }));

export const globals = {
  "site-settings": {
    name: "Muhammad Usman",
    shortLabel: "Engineering journal and selected work",
    professionalTitle: "Senior Full-Stack Engineer and Systems Architect",
    defaultSeoTitle: "Muhammad Usman",
    defaultSeoDescription:
      "Senior full-stack and systems engineering across Java, Python, React, data platforms, cloud infrastructure, and practical AI automation.",
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
      { label: "Writings", url: "/blog/" },
      { label: "Testimonials", url: "/testimonials/" },
      { label: "Contact Me", url: "/contact/" },
      {
        label: "Book a Call",
        url: "https://calendar.app.google/baTVjxZDoBMnjdip9",
        isPrimary: true,
      },
    ],
    footerDescription:
      "Senior full-stack engineer building scalable products, data platforms, cloud systems, and practical AI automation.",
    bookCall: {
      title:
        "Need senior engineering support for a complex product or platform?",
      description:
        "Book a focused Google Calendar call to discuss the problem, delivery constraints, and a practical next step.",
      buttonLabel: "Book a Call",
    },
  },
  "home-page": {
    seoTitle: "Senior Full-Stack Engineer and Systems Architect",
    seoDescription:
      "Nine-plus years delivering scalable full-stack products, data platforms, cloud infrastructure, fintech systems, and AI automation.",
    eyebrow: "Senior Full-Stack Engineer · Systems Architect · Data & AI",
    headline:
      "Engineering scalable products, data platforms, and intelligent automation for ambitious teams.",
    supportingText:
      "9+ years building high-throughput systems across Java, Python, React, cloud infrastructure, big data, fintech, and real-time AI for global enterprises and growing products.",
    trustChips: [
      "9+ Years Experience",
      "Walmart & Global Teams",
      "Java + Python + React",
      "Data + AI Platforms",
    ].map((text) => ({ text })),
    primaryCtaLabel: "Book a Call",
    secondaryCtaLabel: "View Projects",
    postHeroLine:
      "Latest writing, selected work, and practical ways to start a conversation are below.",
    writingsTitle: "Latest writings",
    writingsArchiveLabel: "All writings",
    writingsLimit: 2,
    projectsTitle: "Selected engineering work",
    projectsArchiveLabel: "Explore all case studies",
    featuredProjectSlugs: [
      "unified-data-platform",
      "data-landscape-scanner",
      "capa-multi-vendor-warehouse",
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
      "Nine-plus years of full-stack and systems engineering across Java, Python, React, data platforms, cloud infrastructure, fintech, and AI automation.",
    eyebrow: "About",
    title:
      "A systems-minded engineer turning complex product and platform problems into dependable software.",
    summary: [
      "I’m a Senior Full-Stack Engineer and Systems Architect with more than nine years of experience engineering high-throughput, data-heavy systems and intelligent automation pipelines.",
      "My work spans multi-tenant microservices, real-time synchronization, enterprise ETL, metadata lineage, fintech, cloud migration, mobile products, and AI-enabled workflows for organizations including Walmart and teams across Australia, Europe, the United States, France, and Saudi Arabia.",
      "I work comfortably across Java and Spring Boot, Python and FastAPI, React and Next.js, event-driven platforms, cloud infrastructure, and the delivery practices needed to move complex systems safely into production.",
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
    strengths: [
      {
        title: "Backend and system design",
        description:
          "Java, Spring Boot, Kotlin, Python, microservices, multi-tenant architecture, and event-driven systems.",
      },
      {
        title: "Data platforms and streaming",
        description:
          "Kafka, Spark, Apache Beam, Airflow, Snowflake, Databricks, Azure data services, lineage, and observability.",
      },
      {
        title: "AI and intelligent automation",
        description:
          "Production-minded LLM, RAG, speech recognition, AI observability, and workflow automation.",
      },
      {
        title: "Frontend and product delivery",
        description:
          "React, Next.js, Angular, responsive interfaces, and end-to-end delivery that connects product goals to reliable systems.",
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
      "Share feedback, discuss engineering services, request consultancy, or send Muhammad Usman a general message.",
    eyebrow: "Contact",
    title: "Contact Me",
    description:
      "Whether you have feedback, a project in mind, or need focused consultancy, choose what brings you here and I’ll guide you through the right next steps.",
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
      "Short consultation",
      "Fixed-scope project",
      "Ongoing engineering support",
      "Audit / review / assessment",
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
    writingsTitle: "Writings",
    writingsDescription:
      "Practical notes on building reliable software, data platforms, and useful AI systems.",
    writingsSeoDescription:
      "Software engineering notes on backend systems, data platforms, cloud delivery, and practical AI work.",
    filterTitle: "Browse by topic",
    filterDescription:
      "Choose a topic to narrow the archive while keeping the writing easy to scan.",
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
    notFoundTitle: "404: Not Found",
    notFoundMessage: "You just hit a route that doesn’t exist.",
    thankYouTitle: "Thank you",
    thankYouMessage:
      "Your message has been received. I’ll get back to you soon.",
    homeButtonLabel: "Back to home",
  },
};

const rawPosts = [
  {
    title:
      "Building Reliable Data Platforms Without Hiding Operational Reality",
    slug: "building-reliable-data-platforms",
    excerpt:
      "A practical look at making data platforms easier to use without hiding the signals engineers need to operate them safely.",
    seoTitle: "Building Reliable Data Platforms",
    seoDescription:
      "Practical principles for reliable data platforms, observable pipelines, and maintainable operations.",
    readingTimeMinutes: 5,
    featured: true,
    tagSlugs: ["data-platforms", "engineering"],
    sections: [
      {
        title: "Abstraction should reduce effort, not visibility",
        body: [
          "A useful platform removes repetitive infrastructure work while preserving the operational signals teams need when something fails.",
          "The goal is not to make complexity disappear. It is to place complexity behind clear contracts, dependable defaults, and observable execution paths.",
        ],
      },
      {
        title: "Reliability is a product feature",
        body: [
          "Retries, lineage, quality gates, ownership metadata, and actionable failure messages should be designed as part of the product experience rather than added after incidents.",
        ],
      },
    ],
  },
  {
    title: "A Practical Standard for AI Features",
    slug: "practical-standard-for-ai-features",
    excerpt:
      "AI features should solve a measurable workflow problem, expose uncertainty, and leave users with a clear recovery path.",
    seoTitle: "A Practical Standard for AI Features",
    seoDescription:
      "A concise framework for evaluating and delivering useful AI-enabled product features.",
    readingTimeMinutes: 4,
    featured: true,
    tagSlugs: ["ai", "engineering"],
    sections: [
      {
        title: "Start with the workflow",
        body: [
          "A model is an implementation detail. Begin with the decision, task, or bottleneck that needs to improve and define what a better outcome looks like.",
        ],
      },
      {
        title: "Design for uncertainty",
        body: [
          "Useful AI interfaces make confidence, provenance, review, and correction part of the normal flow. A graceful fallback matters as much as the successful result.",
        ],
      },
    ],
  },
  {
    title: "Designing Retryable Event Pipelines Without Hiding Failure",
    slug: "designing-retryable-event-pipelines",
    excerpt:
      "What a Kafka recovery workflow needs so operators can understand, replay, and audit failed events without guessing.",
    seoTitle: "Designing Retryable Event Pipelines",
    seoDescription:
      "Practical design notes for observable Kafka retries, controlled replay, and failure recovery.",
    readingTimeMinutes: 5,
    featured: false,
    tagSlugs: ["data-platforms", "engineering", "real-time"],
    sections: [
      {
        title: "A retry is an operational decision",
        body: [
          "Automatically sending a failed event through the same path can repeat the same damage. A useful recovery flow keeps the original payload, failure context, retry history, and ownership visible before another attempt is made.",
        ],
      },
      {
        title: "Separate diagnosis from replay",
        body: [
          "Filtering failures by domain, status, and cause helps teams find patterns before acting. Manual replay and scheduled retry can share the same execution path while retaining different audit context.",
          "Idempotent handlers and explicit terminal states keep a recovery tool from becoming another source of duplicate processing.",
        ],
      },
    ],
  },
  {
    title: "What Metadata Scanners Teach You About Integration Boundaries",
    slug: "metadata-scanners-integration-boundaries",
    excerpt:
      "Lessons from building connectors across data warehouses, pipelines, catalogues, and cloud platforms with very different metadata models.",
    seoTitle: "Metadata Scanners and Integration Boundaries",
    seoDescription:
      "Engineering lessons from normalizing metadata and lineage across heterogeneous data platforms.",
    readingTimeMinutes: 6,
    featured: false,
    tagSlugs: ["data-platforms", "backend", "engineering"],
    sections: [
      {
        title: "Normalize carefully",
        body: [
          "A common metadata model makes discovery useful, but flattening every source into the same shape can discard the details that explain lineage. The boundary should preserve source identifiers and evidence while exposing a stable internal contract.",
        ],
      },
      {
        title: "Treat connectors as products",
        body: [
          "Authentication, pagination, rate limits, partial permissions, and changing vendor APIs are part of the connector experience. Clear diagnostics and representative fixtures make these integrations maintainable long after the first successful scan.",
        ],
      },
    ],
  },
  {
    title: "WebSockets Across Angular, Spring Boot, and Python",
    slug: "websockets-angular-spring-python",
    excerpt:
      "A practical architecture for moving browser audio through a Java gateway to Python inference and returning partial transcripts in real time.",
    seoTitle: "WebSockets Across Angular, Spring Boot, and Python",
    seoDescription:
      "Designing a browser-to-inference WebSocket pipeline for real-time speech transcription.",
    readingTimeMinutes: 5,
    featured: false,
    tagSlugs: ["ai", "java", "real-time"],
    sections: [
      {
        title: "Give each connection a clear job",
        body: [
          "The browser captures and sends audio, Spring Boot owns the authenticated product session, and Python owns model inference. Keeping those responsibilities explicit makes disconnects and cleanup easier to reason about.",
        ],
      },
      {
        title: "Backpressure is part of the interface",
        body: [
          "Audio can arrive faster than inference can process it. Bounded buffers, small chunks, cancellation, and visible connection state prevent latency from growing silently while users believe the transcript is still live.",
        ],
      },
    ],
  },
  {
    title: "Hardening Data Connectors Without Stalling Delivery",
    slug: "hardening-data-connectors",
    excerpt:
      "A repeatable way to remove injection risks and unsafe query construction across a large connector estate.",
    seoTitle: "Hardening Data Connectors",
    seoDescription:
      "A practical approach to secure query construction across many data integrations.",
    readingTimeMinutes: 4,
    featured: false,
    tagSlugs: ["security", "data-platforms", "engineering"],
    sections: [
      {
        title: "Find the pattern, not only the finding",
        body: [
          "When the same unsafe query construction appears across connectors, repairing files one by one leaves the design flaw intact. Shared query utilities, parameter binding, and a small set of reviewed exceptions turn remediation into a maintainable standard.",
        ],
      },
      {
        title: "Prove behaviour as well as safety",
        body: [
          "Security changes still need connector fixtures that cover real identifiers, permissions, and vendor-specific syntax. That evidence lets a team harden a broad surface without treating every change as an untestable rewrite.",
        ],
      },
    ],
  },
  {
    title: "Quality Gates That Help Teams Ship",
    slug: "quality-gates-that-help-teams-ship",
    excerpt:
      "How test coverage, static analysis, and CI checks become useful engineering feedback instead of release-day ceremony.",
    seoTitle: "Quality Gates That Help Teams Ship",
    seoDescription:
      "Practical guidance for making automated tests and static analysis useful in delivery workflows.",
    readingTimeMinutes: 4,
    featured: false,
    tagSlugs: ["engineering", "security"],
    sections: [
      {
        title: "Put feedback near the change",
        body: [
          "A quality gate is most useful when it explains a small, actionable problem while the code is still fresh. Fast unit checks and focused static analysis belong early; slower integration evidence can follow before merge.",
        ],
      },
      {
        title: "Coverage is a map, not a target",
        body: [
          "Coverage can reveal unexamined paths, but the useful question is whether important behaviour and failure modes are protected. Teams get more value by reviewing the missing scenarios than by celebrating a percentage alone.",
        ],
      },
    ],
  },
  {
    title: "Data Landscape Scanner",
    slug: "data-landscape-scanner",
    excerpt:
      "A cloud-agnostic metadata discovery and lineage framework supporting more than 40 enterprise data technologies.",
    seoTitle: "Data Landscape Scanner | Project Case Study",
    seoDescription:
      "Case study covering metadata discovery, connector security, lineage, and scanner optimization.",
    readingTimeMinutes: 4,
    featured: true,
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
      "Walmart’s centralized enterprise ETL ecosystem for low-code ingestion, Spark and Beam processing, Airflow orchestration, governance, and monitoring.",
    seoTitle: "Unified Data Platform | Project Case Study",
    seoDescription:
      "Case study covering backend platform capabilities, Airflow integration, quality controls, and automated testing.",
    readingTimeMinutes: 4,
    featured: true,
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
      "A Kafka and Azure platform for monitoring, diagnosing, and replaying millions of cloud-migration records with granular transparency.",
    seoTitle: "Error Reprocessing Tool | Project Case Study",
    seoDescription:
      "Case study covering migration observability, structured recovery workflows, and operational reliability.",
    readingTimeMinutes: 3,
    featured: true,
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
      "A product and engineering turnaround for an AI-driven peer-to-peer marketplace in France.",
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
      "A customized Configure, Price, Quote platform for a major German pump manufacturer and its CRM sales workflow.",
    seoTitle: "Enterprise CPQ Engine | Project Case Study",
    seoDescription:
      "Full-stack Java CPQ customization, concurrent quotation processing, team leadership, and faster enterprise sales workflows.",
    readingTimeMinutes: 5,
    featured: true,
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
      "A SAMA-licensed, Sharia-compliant digital lending platform scaled to more than 25,000 customers in Saudi Arabia.",
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
      "A low-latency speech-to-text platform connecting browser audio to NVIDIA NeMo through Java and Python WebSockets.",
    seoTitle: "Real-Time NVIDIA NeMo ASR Pipeline | Case Study",
    seoDescription:
      "Real-time audio streaming with Angular, Spring Boot WebSockets, Python, Google Cloud, and NVIDIA NeMo.",
    readingTimeMinutes: 4,
    featured: true,
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
      "A PCI-compliant platform supporting prepaid cards, payments, fees, KYC, notifications, and customer preferences.",
    seoTitle: "Multi-Tenant Banking-as-a-Service Platform | Case Study",
    seoDescription:
      "Six-plus Spring microservices, AWS infrastructure, payment processing, KYC, fee management, and SOAP-to-REST integration.",
    readingTimeMinutes: 5,
    featured: true,
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

const projectEnhancements = {
  "data-landscape-scanner": {
    projectRole: "Senior Software Engineer",
    referenceCaseStudy: "rover.md",
    projectGalleryDirectory: "rover",
    projectGalleryCoverMatch: "Screenshot 2026-07-16",
  },
  "unified-data-platform": {
    projectRole: "Backend Engineer and Team Lead",
    referenceCaseStudy: "udp.md",
    projectGalleryFiles: ["UDP.jpg"],
  },
  "error-reprocessing-tool": {
    projectRole: "Technical Lead",
    referenceCaseStudy: "ert.md",
  },
  "capa-multi-vendor-warehouse": {
    projectRole: "Lead Full-Stack Engineer",
    referenceCaseStudy: "capa.md",
    projectGalleryDirectory: "Capa",
    projectGalleryCoverMatch: "12.11.16",
  },
  "streetapp-ai-marketplace": {
    projectRole: "Senior Product Engineer",
    referenceCaseStudy: "streetapp.md",
    projectGalleryDirectory: "StreetApp",
    projectGalleryCoverMatch: "11.54.21",
  },
  "enterprise-cpq-engine": {
    projectRole: "Full-Stack Java Engineer and Team Lead",
    referenceCaseStudy: "cpq.md",
    projectGalleryDirectory: "CPQ",
    projectGalleryCoverMatch: "11.46.27",
  },
  "seulah-digital-microfinance": {
    projectRole: "Senior Backend Engineer",
    referenceCaseStudy: "seulah.md",
    projectGalleryDirectory: "Seulah",
  },
  "real-time-nemo-asr": {
    projectRole: "Full-Stack and AI Integration Engineer",
    referenceCaseStudy: "nemo-asr.md",
    projectGalleryFiles: ["ASR.png"],
  },
  "banking-as-a-service-platform": {
    projectRole: "Backend Engineer",
    referenceCaseStudy: "embedding-finance.md",
  },
};

export const posts = rawPosts.map((post) => ({
  ...post,
  ...(projectEnhancements[post.slug] || {}),
}));
