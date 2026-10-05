# portfolio-cms

Payload CMS for the portfolio site: all page copy, articles, case studies, services,
testimonials, work experience, media and contact submissions. The statically exported UI
(`../portfolio-ui`) reads it over REST at build time, and published changes trigger a UI rebuild.

## Stack

- Payload CMS 3 on Next.js 16
- PostgreSQL (`@payloadcms/db-postgres`), media binaries in `cms.media_blobs`
- TypeScript

## Model

- Collections: `posts` (articles and `case-study` projects, drafts and versions), `services`,
  `testimonials`, `work-experience`, `tags`, `media`, `quote-requests` (contact submissions),
  `users` (admin auth)
- Globals: `site-settings`, `home-page`, `about-page`, `testimonials-page`, `quote-page`
  (Contact page), `archive-settings`, `project-template`, `system-pages`

Fields, access rules, hooks and endpoints: [docs/CONTENT_MODEL.md](docs/CONTENT_MODEL.md).

## Access Summary

- Writes are admin-only (active `admin` users); the first administrator can self-register.
- Public reads: published posts, services, testimonials and work experience; all tags and globals;
  media with `isPublic = true`. Users and contact requests are never public.

## Key Behaviors

- Slugs are generated from titles and locked after publish; `publishedAt` is set on first publish
- Published posts require their SEO fields
- Media used by published posts, tags in use, authors referenced by posts and the last admin
  cannot be deleted
- Published content changes call `UI_DEPLOY_WEBHOOK_URL` to rebuild the static UI

## Local Setup

Use Node.js `20.9.0` or newer and npm `9` or newer. Then:

```bash
npm ci
cp .env.example .env
npm run migrate
npm run db:check
npm run dev
```

If Node Version Manager is installed, run `nvm use` before these commands.

Set secure values in `.env` before running migrations. Use Node/Postgres URL format with credentials,
for example `postgresql://postgres:postgres@localhost:5432/postgres` (not `jdbc:`).

See [docs/LOCAL_DEVELOPMENT.md](docs/LOCAL_DEVELOPMENT.md) for fresh setup, the full-stack startup
order, schema development, verification, and troubleshooting.

For a local API-backed sample dataset, run the CMS on port `3001` and execute:

```bash
npm run seed:dev
```

The seed script logs in through `/api/users/login`, creates the first administrator through `/api/users/first-register` when necessary, and upserts the baseline through the REST routes: records are matched by slug, name, company or title and overwritten with the seed values, globals receive every field the seed defines, and nothing is deleted. It refuses non-local targets unless `ALLOW_REMOTE_SEED=true` is explicitly set.

After seeding, open `http://localhost:3001/admin` and sign in with the seed credentials from `.env`.

Connection check:

- `npm run db:check`

Environment variables:

- `UI_PUBLIC_URL`: primary portfolio origin allowed to submit quote requests
- `QUOTE_ALLOWED_ORIGINS`: comma-separated additional allowed origins

## Testimonials

Testimonials are managed under **Content → Testimonials** in Payload Admin. Published records are publicly readable; drafts remain admin-only. Use `featured` to include a recommendation on the homepage and `sortOrder` to control its position. The local REST seed creates or updates the reference recommendations by name.

- `DATABASE_URL`
  - PostgreSQL connection string used by Payload.
- `DB_SCHEMA`
  - PostgreSQL schema name for CMS tables.
- `PAYLOAD_SECRET`
  - Payload app secret for auth and internal security. Use a long random value.
- `NEXT_PUBLIC_SERVER_URL`
  - Public base URL of the CMS app.
- `UI_DEPLOY_WEBHOOK_URL`
  - Optional UI deployment webhook triggered after public content changes.
- `UI_DEPLOY_WEBHOOK_TOKEN`
  - Optional bearer token. Required when `UI_DEPLOY_WEBHOOK_URL` is the GitHub repository-dispatch API.
- `LOG_DIR`
  - Directory where rotated logs are written.
- `LOG_FILENAME`
  - Filename pattern for rotated logs.
- `LOG_DATE_PATTERN`
  - Date format used in rotated log filenames.
- `LOG_MAX_SIZE`
  - Maximum size of one log file before rotation.
- `LOG_MAX_FILES`
  - Retention window for rotated logs.
- `LOG_ZIPPED_ARCHIVE`
  - Whether old rotated logs are compressed.
- `LOG_SYMLINK_NAME`
  - Stable symlink name pointing to the current log file.

Rotating logs:

- `npm run dev` now runs with file rotation by default
- `npm run start` now runs with file rotation by default
- plain mode (no wrapper): `npm run dev:plain`, `npm run start:plain`
- logs are written to `logs/` by default
- rotation is daily (`LOG_DATE_PATTERN=YYYY-MM-DD`) and size-based (`LOG_MAX_SIZE=20m`)
- active file symlink: `logs/current.log`

## Migration Workflow

- For normal local setup:
  - `npm run migrate`
- After creating the first administrator in a new environment, run `npm run seed:core` to idempotently install or update permanent site content: project case studies, their tags and media, testimonials, work experience, and site globals.
- The core seed also uploads every available project image to Media, stores the original plus generated thumbnail variants in PostgreSQL, and attaches the ordered gallery to its project.
- Use `npm run seed:core -- --refresh-media` only when existing seeded files need their generated variants rebuilt.
- Run `npm run seed:dev` to load the same permanent site content plus test articles. Do not run the development seed in production.
- Database migrations remain schema-only; editorial baseline content is managed by explicit seed commands.
- `npm run migrate:init` is only for generating a new migration during schema development.
- Use `npm run migrate:create <name>` after collection/config changes.
- Commit payload config changes and migration files together.
- Run `npm run migrate` before building and restarting the OCI CMS service.

## Deployment

### Production Target

- OCI VM deployment for the Payload application
- external PostgreSQL database for content and media blobs
- systemd process management behind Caddy

### Local Verification

```bash
npm run db:check
npm run migrate
npm run build
```

Use `npm run dev` for local development after the checks pass.

### Production Deployment

Deploy from the UI repository on the OCI VM. Its deployment script updates both repositories,
checks the database, runs migrations, builds and restarts the CMS, clean-builds the UI, and verifies
the local Caddy endpoints:

```bash
cd /srv/portfolio/portfolio-ui
npm run deploy:oci
```

See `docs/OCI_DEPLOYMENT.md` in both repositories for provisioning and troubleshooting. Production
deployment runs directly on the VM rather than through a provider-hosted pipeline.

The optional runtime `UI_DEPLOY_WEBHOOK_URL` points to the OCI loopback rebuild listener at
`http://127.0.0.1:9010/deploy`; `UI_DEPLOY_WEBHOOK_TOKEN` authenticates that local request.

### Deployment Rules

- every schema change must ship with a migration
- migrations must run before the new app version is treated as live
- commit schema/config changes and migration files together
- keep the UI repo `PAYLOAD_API_URL` pointed at the active CMS base URL

### Publish Behavior

- publishing a post makes it available on the CMS public API immediately
- the Next.js UI reflects that content on its next successful rebuild or deployment
- the chosen frontend model is static generation plus rebuild on publish
- if `UI_DEPLOY_WEBHOOK_URL` is configured, the CMS automatically triggers the UI deployment webhook for published-post changes
- the current UI deployment flow performs a normal static Next.js rebuild rather than an affected-page-only rebuild
- authenticated administrators can also request the same rebuild manually from the **Public website** card on the CMS dashboard
- runtime blog rendering through SSR or a hybrid framework is a future option, not the current delivery model

### Test a CMS-triggered UI rebuild

1. Confirm `portfolio-ui-deploy-webhook` is active on the production VM:
   `sudo systemctl status portfolio-ui-deploy-webhook`.
2. Confirm the listener is healthy: `curl http://127.0.0.1:9010/health`.
3. Confirm `UI_DEPLOY_WEBHOOK_URL` and `UI_DEPLOY_WEBHOOK_TOKEN` are present in the CMS `.env`, then restart `portfolio-cms` if either value changed.
4. Open Payload Admin and change a small value in **Site Settings**, such as the short label, then save it. Global settings use the same automatic rebuild hook as published posts.
5. Follow the listener logs with `sudo journalctl -u portfolio-ui-deploy-webhook -f`. A successful test logs the rebuild start and exit code `0`.
6. Refresh the public site after the build completes and verify the changed value.
7. To test the manual path, use **Rebuild UI** on the Payload dashboard and verify the same listener logs. The button queues the rebuild and immediately reports whether the listener accepted the request.

## Public REST Endpoints

- `GET /api/posts`, `/api/services`, `/api/testimonials`, `/api/work-experience` (published only)
- `GET /api/tags`
- `GET /api/globals/<slug>`
- `GET /api/media/:id` and `GET /api/media/file/:filename` (public media; binaries from `cms.media_blobs`)
- `POST /api/quote-requests/submit` (contact wizard; origin-restricted, validated, rate-limited)
- `POST /api/rebuild-ui` (admins only; manual UI rebuild)

The API path is handled by Payload's generated REST routes under Next.js App Router.
