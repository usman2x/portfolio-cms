// Development articles for local databases only. seed-api.mjs loads this file only in --dev mode,
// which refuses any non-local target; production articles are written in Payload Admin.
export const articles = [
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
];
