# Local Development

This repository is the Payload CMS and PostgreSQL backend for the portfolio. For the complete two-repository startup sequence, including the frontend, see `../portfolio-ui/docs/LOCAL_DEVELOPMENT.md` when both repositories are checked out as siblings.

## Prerequisites

- Node.js `20.9.0` or newer; Node 20 LTS is recommended
- npm `9` or newer
- PostgreSQL with an existing database that the local user can create schemas and tables in

Both repositories include an `.nvmrc`. If Node Version Manager is installed, run `nvm use`. Otherwise, verify `node --version` reports a supported version.

## First-time setup

```bash
npm ci
cp .env.example .env
```

Update `.env` with a working local `DATABASE_URL`, a private `PAYLOAD_SECRET`, and local seed administrator credentials. Do not commit `.env`.

Create the schema and verify the connection:

```bash
npm run migrate
npm run db:check
```

Start Payload on port `3001`:

```bash
npm run dev
```

In a second terminal, load local content and create the first administrator when needed:

```bash
npm run seed:dev
```

The first development seed uploads and processes project media, so it can take a minute or more.

Open `http://localhost:3001/admin` and sign in with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.

## Seed choices

- `npm run seed:core`: permanent site content only
- `npm run seed:dev`: permanent content plus development writings
- `npm run seed:core -- --refresh-media`: rebuild stored media variants for existing seeded files

Seeds update records by stable identifiers and are safe to repeat locally. Remote targets are rejected unless `ALLOW_REMOTE_SEED=true` is deliberately set. Never use that override casually.

## Schema workflow

For a collection, global, or field change:

```bash
npm run generate:types
npm run migrate:create -- descriptive-change-name
npm run migrate
npm run db:check
npm run build
```

Development-mode schema push is disabled (`push: false` in `src/payload.config.ts`), so `npm run dev` never alters the database; stop the dev server, create and apply a migration, then restart it. Migrations that follow hand-written ones without a `.json` snapshot may repeat earlier statements, so trim them to the intended change.

Review generated migrations before applying them. Commit the Payload configuration, generated types, and migration files together. Use `migrate:init` only to establish an entirely new migration baseline.

If Payload reports that development-mode schema pushes have diverged from migrations or warns about possible data loss, answer **no**. Back up and reconcile that database, or switch `DATABASE_URL` to a fresh local database. Never accept a destructive prompt as part of routine startup.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start port `3001` with rotating file logs |
| `npm run dev:plain` | Start without the logging wrapper |
| `npm run db:check` | Verify database connectivity and the configured schema |
| `npm run migrate:status` | Show migration state |
| `npm run generate:types` | Regenerate Payload TypeScript types |
| `npm run build` | Create a production build |

Logs are written under `logs/`; `logs/current.log` points to the active file by default.

## Troubleshooting

- Connection refused: start PostgreSQL and verify the host and port in `DATABASE_URL`.
- Authentication failed: verify the PostgreSQL role and password in `DATABASE_URL`.
- Schema not found: run `npm run migrate`, then repeat `npm run db:check`.
- Seed cannot authenticate: use credentials for the existing administrator or start with a clean local database.
- UI shows stale content: the public site is statically generated; rebuild or restart `portfolio-ui` after CMS content changes.
- Data-loss warning during migration or startup: answer **no**. The database has drifted from committed migrations; back it up and reconcile it or use a fresh local database.
- Turbopack fails because a CSS worker cannot bind a port: this can occur in restricted containers and AI sandboxes. Run `npx next build --webpack` to confirm the environmental cause, but keep `npm run build` as the normal production check and report its failure.

## AI assistant entry point

Read `AGENTS.md`, then use `.agents/skills/develop-portfolio-cms/SKILL.md` for CMS work. Cross-repository API changes must also be checked against `../portfolio-ui/src/lib/cms.js` and the consuming UI.
