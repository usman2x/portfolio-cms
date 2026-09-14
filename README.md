# portfolio-cms

Payload CMS repository for managing blog content used by the portfolio site.

## Stack

- Payload CMS + Next.js runtime
- PostgreSQL (`@payloadcms/db-postgres`)
- TypeScript

## Implemented Model

- `users` (auth-enabled, admin-only)
- `tags`
- `media` (upload-enabled + metadata)
- `posts` (draft/publish workflow + SEO fields)
- `media_blobs` SQL table for binary storage of original and generated image variants

## Access Summary

- Admin-only CRUD for `users`, `media`, `posts`, and writes on `tags`
- Public read on `tags`
- Public read on `posts` limited to `status = published`
- Public read on `media` limited to `isPublic = true`

## Key Behaviors

- First admin bootstrap allowed if no admin exists yet
- `isActive = false` admins are blocked from login
- Slugs auto-generated from title/name
- Published posts enforce required SEO + publish fields
- Slug mutation is blocked after publish
- `publishedAt` auto-set on first publish
- Media used by published posts cannot be deleted
- Tags in use by posts cannot be deleted
- Authors referenced by posts cannot be deleted

## Local Setup

1. Copy `.env.example` to `.env` and set secure values.
   Use Node/Postgres URL format with credentials, for example: `postgresql://postgres:postgres@localhost:5432/postgres` (not `jdbc:`).
2. Install dependencies with your package manager.
3. Run `npm run dev`.
4. Create initial admin user at `/admin`.

For a local API-backed sample dataset, run the CMS on port `3001` and execute:

```bash
npm run seed:dev
```

The seed script logs in through `/api/users/login`, creates the first administrator through `/api/users/first-register` when necessary, and creates or updates tags and published posts through the public REST routes. It is idempotent by slug and refuses non-local targets unless `ALLOW_REMOTE_SEED=true` is explicitly set.

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
- Run `npm run seed:dev` to load the same permanent site content plus test writings. Do not run the development seed in production.
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

- `GET /api/posts` (returns published posts to public users)
- `GET /api/posts/:id` (returns a post only when publicly readable)
- `GET /api/tags`
- `GET /api/media/:id` (Payload REST document endpoint)
- `GET /api/media/file/:filename` (binary media from Postgres blobs)

Notes:

- `GET /api/media` and `GET /api/media/:id` are served by Payload REST.
- `GET /api/media/file/:filename` is custom and backed by `cms.media_blobs`.

The API path is handled by Payload's generated REST routes under Next.js App Router.
