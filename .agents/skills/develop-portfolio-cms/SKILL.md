---
name: develop-portfolio-cms
description: Implement, review, or troubleshoot Payload CMS and PostgreSQL changes for the portfolio, including collections, globals, fields, hooks, access control, REST behavior, migrations, media blobs, seed data, and frontend content contracts. Use for backend or content-model work in portfolio-cms and for cross-repository changes that alter data consumed by portfolio-ui.
---

# Develop Portfolio CMS

Evolve the CMS without weakening access controls, losing editorial data, or silently breaking the statically generated frontend.

## Establish context

1. Read `AGENTS.md`, `README.md`, and the relevant source files.
2. Read the relevant Next.js 16 documentation under `node_modules/next/dist/docs/` before using framework APIs or conventions.
3. Inspect `src/payload.config.ts`, the affected collection or global, related hooks and access functions, `src/migrations/`, and `scripts/seed-api.mjs`.
4. For UI-facing data changes, inspect `../portfolio-ui/src/lib/cms.js` and the consuming page or component.
5. Preserve unrelated working-tree changes and never use a real production database for local verification.

## Protect the content contract

- Decide whether a field belongs in a collection, global, relationship, upload, or local UI configuration before implementing it.
- Define field validation, requiredness, defaults, admin help text, and behavior for existing rows.
- Keep public reads intentionally narrow. Preserve admin-only writes and authentication rules unless the requirement explicitly changes them.
- Public post queries must remain limited to published content; public media access must remain limited to public media.
- Treat slug stability, publish timestamps, referenced media, referenced tags, and referenced authors as domain invariants.
- Store API-shape adaptation in the UI CMS adapter rather than scattering Payload response assumptions across components.
- Never place secrets in public fields, logs, seed fixtures, or `NEXT_PUBLIC_*` values.

## Change schemas and data

1. Modify the Payload configuration, collection, global, hook, or endpoint.
2. Run `npm run generate:types` when the Payload schema changes.
3. Create a named migration with `npm run migrate:create -- <descriptive-name>`.
4. Review generated migration code and SQL semantics. Ensure existing data receives a safe value before enforcing new constraints.
5. Update `scripts/seed-data.mjs`, `scripts/seed-api.mjs`, and core-content assets when the field is part of the permanent site baseline.
6. Keep seed operations idempotent by stable identifiers such as slugs.
7. Update API and content-model documentation when the public contract changes.
8. Commit configuration and migration files together.

Do not use `migrate:init` for an ordinary schema change. Do not edit an already-applied migration to represent a new change; create another migration.

## Verify locally

1. Point `.env` at a disposable local PostgreSQL database.
2. Run `npm run migrate` and then `npm run db:check`.
3. Start the CMS with `npm run dev`.
4. In another terminal, run `npm run seed:core` or `npm run seed:dev` as appropriate.
5. Verify admin editing and the affected public REST response. Check draft, published, anonymous, authenticated, empty, and invalid states relevant to the change.
6. Run `npm run build`.
7. For public contract changes, build or exercise `portfolio-ui` against this CMS and inspect the affected UI.
8. Report the database used, migration and seed results, API behavior checked, and any validation not run.

If migration or development startup reports schema drift or possible data loss, decline the prompt. Back up and reconcile the database or repeat verification against a fresh disposable database. Never accept a destructive schema push merely to make a check pass.

If `npm run build` fails only because a restricted execution environment prevents Turbopack's CSS worker from binding a local port, run `npx next build --webpack` as a diagnostic fallback. Still report that the normal production command was blocked.

## Handle UI rebuild behavior

- Published content changes are visible to the public API immediately but reach the static UI only after a successful UI rebuild.
- Preserve webhook authentication and loopback deployment assumptions.
- Test rebuild-trigger changes independently from content persistence so failures are diagnosable.
- Do not make production deployment calls or remote seed operations unless the user explicitly requests and authorizes them.
