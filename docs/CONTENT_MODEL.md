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

### Posts (`posts`) — "Articles" and "Projects" in the admin

Articles and project case studies share one collection. `kind` (`article`/`project`) splits them:
the admin nav shows separate **Articles** and **Projects** links (`components/ContentNav`, which
hides the collection's own link), the list has matching tabs and "New article/project" buttons
(`components/PostKindTabs`), and `?kind=` on the create URL preselects the kind. `kind` replaced
the `case-study` tag (migration `20261007_063707_post_kind` backfilled it); the UI still falls back
to the tag when `kind` is missing. Versions with drafts; `status` (draft/published).

- Sidebar: `kind`, `status`, `publishedAt` (set on first publish), `slug` (auto from title, locked
  after publish), `author` (defaults to the signed-in user), `tags`.
- Content tab: `title`, `excerpt`, `publicationType` (articles only: `native` or `external`),
  `externalUrl`, `externalPlatform` (medium, linkedin, other; detected from the URL when empty),
  rich-text `content` (not for external articles), `coverImage`.
  Projects only: `projectRole`, `projectOutcome` (one measurable result for the homepage card),
  `projectGallery` (ordered media). Projects are always `native`.
- SEO tab (all optional; the UI falls back to title, excerpt and cover image): `seoTitle`,
  `seoDescription`, `ogImage`, `canonicalUrl`, `noindex`.
- Hidden, kept for stored values: `externalCtaLabel` (the UI labels links from the platform),
  `readingTimeMinutes` (the UI estimates it), `featured` (unused; homepage projects come from the
  Home Page global, whose picker only offers projects).
- Publishing requires title, slug, excerpt, publish date, and either content or (external) URL and
  platform. Failures are returned as field validation errors, so the admin points at the field.
- Hooks: defaults, slug and platform detection on validate; publish requirements on change; media
  used by a published post is marked public; publishing triggers the UI rebuild webhook.

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

`name`, `slug` (auto), `description`. A tag in use by a post cannot be deleted. The list view has an
"Add several tags" box backed by `POST /api/tags/bulk` (`{ names }`, comma or newline separated,
admin only; existing slugs are skipped).

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
| `POST /api/quote-requests/submit` | public, origin-restricted | Contact wizard; validates intent-specific fields and rate limit; a filled honeypot (`hp_trap_7f3k`) stores the request as `spam` instead of `new`; logs each outcome as `[contact] …` (no personal data) |
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
- Articles (`kind = article`) are not seed baseline. Local development articles
  live in `scripts/seed-articles.local.mjs` and load only through `npm run seed:dev`, which is
  local-only with no override; production articles are written in Payload Admin.

Deferred cleanup (unused fields, legacy names, seed pruning): `../portfolio-ui/docs/TODO.md`.
