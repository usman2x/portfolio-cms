# Repository Guidance

## Start Here

- Read `README.md` and `docs/LOCAL_DEVELOPMENT.md` before running the project for the first time.
- Use `.agents/skills/develop-portfolio-cms/SKILL.md` for Payload collections, globals, fields, hooks, endpoints, access control, migrations, seeds, PostgreSQL, media, or public API work.
- For data consumed by the website, inspect `../portfolio-ui/src/lib/cms.js` and the consuming page or component. Update both repositories when the public contract changes.
- Use only a disposable local database for development and verification unless the user explicitly authorizes another environment.

## Content and access rules

- Preserve admin-only writes and narrow public-read rules unless a requirement explicitly changes them.
- Public posts must be published; public media must have `isPublic = true`.
- Preserve protections around published slugs, referenced media, referenced tags, and referenced authors.
- Treat `scripts/seed-data.mjs` and the files under `scripts/core-content/` as the permanent content baseline.
- Keep seeds idempotent and refuse remote seeding unless the user explicitly requests it.
- Never expose credentials or private content through public fields, logs, fixtures, or `NEXT_PUBLIC_*` variables.

## Schema workflow

- Generate Payload types after schema changes.
- Create a new, descriptively named migration for every schema change; do not rewrite an applied migration.
- Review migrations for existing-data safety before applying them.
- Decline any migration or development-start prompt that warns about possible data loss unless the user has explicitly authorized a reviewed change against a disposable database.
- Commit Payload configuration, generated types, migrations, and affected seed data together.
- Run migrations before builds and before treating a deployment as live.
- Use `migrate:init` only for a new migration baseline, not an ordinary change.

## Verification

- Run `npm run migrate`, `npm run db:check`, and `npm run build` for schema or configuration changes.
- Exercise relevant anonymous and authenticated API paths, including draft, published, empty, and invalid states.
- For public contract changes, verify `portfolio-ui` against the migrated and seeded local CMS.
- Report checks that were run and any verification that was not possible.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
