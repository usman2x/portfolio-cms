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
