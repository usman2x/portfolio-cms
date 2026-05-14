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

Connection check:
- `npm run db:check`

Environment variables:

- `DATABASE_URL`
  - PostgreSQL connection string used by Payload.
- `DB_SCHEMA`
  - PostgreSQL schema name for CMS tables.
- `PAYLOAD_SECRET`
  - Payload app secret for auth and internal security. Use a long random value.
- `NEXT_PUBLIC_SERVER_URL`
  - Public base URL of the CMS app.
- `UI_DEPLOY_WEBHOOK_URL`
  - Optional UI deployment webhook triggered after published post changes.
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
- `npm run migrate:init` is only for generating a new migration during schema development.
- Use `npm run migrate:create <name>` after collection/config changes.
- Commit payload config changes and migration files together.
- Run `npm run migrate` before deploy/build in CI.

## Deployment

### Production Target

- Railway app deployment for the Payload application
- PostgreSQL database for content and media blobs

### Local Verification

```bash
npm run db:check
npm run migrate
npm run build
```

Use `npm run dev` for local development after the checks pass.

### Automatic Deployment From `main`

- Workflow: `.github/workflows/deploy.yml`
- Trigger: push to `main` and manual `workflow_dispatch`
- Job order:
  - `npm ci`
  - `npm run db:check`
  - `npm run migrate`
  - `npm run build`
  - trigger Railway via deploy hook

Required GitHub repository secrets:

- `DATABASE_URL`
- `PAYLOAD_SECRET`
- `RAILWAY_DEPLOY_HOOK_URL`

Optional GitHub repository secret:

- `UI_DEPLOY_WEBHOOK_URL`
  - used only for a deployment warning in CI
  - the actual CMS publish automation depends on this value being present in the running CMS environment

Optional runtime environment values:

- `UI_DEPLOY_WEBHOOK_URL`
  - set this to a deployment-provider webhook or relay endpoint for the UI repo
  - examples: Vercel Deploy Hook, Netlify Build Hook, GitHub Actions dispatch relay, or a custom deployment webhook endpoint
  - the CMS will `POST` to it when a published post is created, updated, unpublished, or otherwise changes public visibility
  - backward-compatible alias still accepted in code: `UI_DEPLOY_HOOK_URL`

Webhook distinction:

- `RAILWAY_DEPLOY_HOOK_URL`
  - used by GitHub Actions to deploy the CMS application on Railway after CI succeeds
- `UI_DEPLOY_WEBHOOK_URL`
  - used by the running CMS app to trigger a frontend rebuild after published content changes

### Deployment Rules

- every schema change must ship with a migration
- migrations must run before the new app version is treated as live
- commit schema/config changes and migration files together
- keep the UI repo `PAYLOAD_API_URL` pointed at the active CMS base URL

### Publish Behavior

- publishing a post makes it available on the CMS public API immediately
- the Gatsby UI reflects that content on its next successful rebuild or deployment
- the chosen frontend model is static generation plus rebuild on publish
- if `UI_DEPLOY_WEBHOOK_URL` is configured, the CMS automatically triggers the UI deployment webhook for published-post changes
- the current UI deployment flow performs a normal site deployment, which means a full Gatsby rebuild rather than an affected-page-only rebuild
- runtime blog rendering through SSR or a hybrid framework is a future option, not the current delivery model

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
