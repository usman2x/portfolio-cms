# Content Model

Payload 3 on Next.js 16 with PostgreSQL (`@payloadcms/db-postgres`, schema `cms`). This repository
owns the schema, access rules, admin, media storage and the public REST API that the statically
exported portfolio UI (`../portfolio-ui`) reads at build time. How the UI renders each field:
`../portfolio-ui/docs/content/CONTENT_CONFIGURATION.md`.

Source of truth: `src/collections/`, `src/globals/`, `src/hooks/`, `src/access/isAdmin.ts`,
`src/payload.config.ts`. Generated types: `src/payload-types.ts`.

## Access model

- Writes everywhere are admin-only: a `users` record with `role = admin` and `isActive` not false.
  Inactive admins cannot log in. The first administrator can register when no admin exists.
- Public reads are narrow:

| Content | Public read |
| --- | --- |
| Posts | `status = published` (drafts and versions are admin-only) |
| Services, Testimonials, Work Experience | `status = published` |
| Tags | all |
| Media | `isPublic = true` |
| Globals | all |
| Users, Contact Requests | none |

## Collections

### Posts (`posts`)

Articles and project case studies. Versions with drafts; `status` (draft/published).

- Core: `title`, `slug` (auto from title, locked after publish), `excerpt`, rich-text `content`
  (Lexical), `author`, `tags`, `coverImage`, `ogImage`, `publishedAt` (set on first publish),
  `readingTimeMinutes`, `featured`.
- Publication: `publicationType` (`native` or `external`), `externalPlatform` (medium, linkedin,
  other), `externalUrl`, `externalCtaLabel`. External entries need no content and get no UI route.
- SEO: `seoTitle`, `seoDescription`, `canonicalUrl`, `noindex`. Required when publishing.
- Projects (posts tagged `case-study`): `projectRole`, `projectOutcome` (one measurable result for
  the homepage card), `projectGallery` (ordered media).
- Hooks: defaults and slug on validate; publish requirements on change; media used by a published
  post is marked public; publishing triggers the UI rebuild webhook.

### Services (`services`)

Homepage "Ways to work together". `title`, `summary`, `highlights[]`, `contactIntent` (must match
a Contact Page `helpTypes` value; default "Project or services"), `ctaLabel`, `showOnHome`,
`sortOrder`, `status`. Changes trigger the UI rebuild.

### Testimonials (`testimonials`)

`name`, `role`, `company`, `relationship` (manager = "Managed Muhammad", colleague, client, other),
`quote`, `recommendationDate`, `sourceLabel`, `sourceUrl`, `featured` (homepage), `sortOrder`,
`status`. Changes trigger the UI rebuild.

### Work Experience (`work-experience`)

`company`, `role`, `period` (free text; "Present" marks the current role), `location`, `website`,
`summary`, `highlights[]` (the UI shows the first two), `sortOrder`, `status`. Changes trigger the
UI rebuild.

### Tags (`tags`)

`name`, `slug` (auto), `description`. A tag in use by a post cannot be deleted.

### Media (`media`)

Upload collection with `thumbnail` (480w), `card` (1200w) and `og` (1200×630) sizes; `alt`,
`caption`, `uploadedBy`, `usageType`, `isPublic`. Originals and generated sizes are stored as
binaries in the `cms.media_blobs` table and served from `/api/media/file/<filename>`. Media used by
a published post cannot be deleted.

### Contact Requests (`quote-requests`)

Private contact-wizard submissions: `name`, `email`, `phone`, `company`, `helpType`, `workType`,
`timeline`, `budget`, `context`, `wantsReply`, `preferredContact`, `status`, `sourceUrl`,
`userAgent`. Created only through the submit endpoint; admin-only to read.

### Users (`users`)

Auth collection: `name`, `role`, `isActive`. The last admin and authors referenced by posts cannot
be deleted. The auth cookie is `portfolio-token`.

## Globals

All globals are publicly readable, admin-writable, and trigger the UI rebuild on save.

| Global | Purpose |
| --- | --- |
| `site-settings` | Identity, logo, portrait, contact details, meeting and resume links, social links, navigation, footer copy, book-call block, default SEO |
| `home-page` | Hero, CTA note, proof, selected work, services heading, testimonial and articles sections |
| `about-page` | Intro, summary, video, strengths, experience title, `featuredTestimonial` (relationship to testimonials, set to null if that testimonial is deleted) |
| `testimonials-page` | Testimonials page SEO and intro |
| `quote-page` | Contact page copy, `helpTypes`, `workTypes`, `timelines`, `budgets`, `contactMethods`, form labels and messages |
| `archive-settings` | Articles and projects archive titles, descriptions, SEO, filter copy, `postsPerPage`, labels |
| `project-template` | Shared case-study labels |
| `system-pages` | 404 and thank-you copy |

## Endpoints

| Endpoint | Access | Purpose |
| --- | --- | --- |
| `GET /api/<collection>`, `GET /api/globals/<slug>` | per access model | Payload REST |
| `GET /api/media/file/<filename>` | public media only | Binary media from `media_blobs` |
| `POST /api/quote-requests/submit` | public, origin-restricted | Contact wizard; validates intent-specific fields, honeypot, rate limit |
| `POST /api/rebuild-ui` | admin | Manual UI rebuild (dashboard **Rebuild UI** button) |

## UI rebuild webhook

After a published change (posts, services, testimonials, work experience, globals) the CMS posts to
`UI_DEPLOY_WEBHOOK_URL` with `UI_DEPLOY_WEBHOOK_TOKEN` as a bearer token. In production that is the
loopback rebuild listener on the VM (`http://127.0.0.1:9010/deploy`). Unset, no rebuild is
requested.

## Migrations and seed

- Every schema change ships with a generated migration under `src/migrations/` (see
  `docs/LOCAL_DEVELOPMENT.md`, "Schema workflow"). Development schema push is disabled.
- `scripts/seed-data.mjs` is the content baseline; `npm run seed:core` upserts it by slug, name,
  company or title and overwrites every field it defines, and never deletes. Renamed records can be
  matched by `previousCompanyNames`; the About featured testimonial is set by name
  (`featuredTestimonialName`). Remote seeding is refused unless `ALLOW_REMOTE_SEED=true`.

Deferred cleanup (unused fields, legacy names, seed pruning): `../portfolio-ui/docs/TODO.md`.
