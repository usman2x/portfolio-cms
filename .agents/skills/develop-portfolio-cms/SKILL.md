---
name: develop-portfolio-cms
description: Implement, review, or troubleshoot Payload CMS and PostgreSQL changes for the portfolio, including collections, globals, fields, hooks, access control, REST behavior, migrations, media blobs, seed data, and frontend content contracts. Use for backend or content-model work in portfolio-cms and for cross-repository changes that alter data consumed by portfolio-ui.
---

# Develop Portfolio CMS

Evolve the CMS without weakening access controls, losing editorial data, or silently breaking the statically generated frontend.

## Establish context

1. Read `AGENTS.md`, `README.md`, `docs/CONTENT_MODEL.md` (schema, access, hooks, endpoints), and the relevant source files. For fields the UI renders, also read `../portfolio-ui/docs/content/CONTENT_CONFIGURATION.md`.
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
- Make new fields optional (or give them defaults) and have the UI hide the related section when they are empty, so a release can be deployed before its content exists and an unmigrated CMS still builds the UI.

## Change schemas and data

1. Modify the Payload configuration, collection, global, hook, or endpoint.
2. Run `npm run generate:types` when the Payload schema changes.
3. Create a named migration with `npm run migrate:create -- <descriptive-name>`.
4. Review generated migration code and SQL semantics. It should only add things for an ordinary field change; ensure existing data receives a safe value before enforcing new constraints. Stop and ask if anything drops, renames or narrows a column.
   - For a data-only change, `migrate:create` asks "No schema changes detected… create a blank migration?"; answer yes (`yes | npm run migrate:create -- <name>`) and hand-write the SQL.
   - Data migrations that change copy must only update rows still holding the previous default (`UPDATE … WHERE field = '<old default>'`) so editor customisations survive, and must have a matching `down`.
   - Back up the local database (`pg_dump -Fc`) before applying migrations.
5. Update `scripts/seed-data.mjs`, `scripts/seed-api.mjs`, and core-content assets when the field is part of the permanent site baseline. Articles are not baseline: put development articles in `scripts/seed-articles.local.mjs` (loaded only by local-only `seed:dev`), never in `seed-data.mjs`.
6. Keep seed operations idempotent by stable identifiers (slug, name, company, title). The seed overwrites every field it defines on matched records and globals and never deletes, so:
   - renaming a matching key needs an alias (see `previousCompanyNames` for work experience) or the seed creates a duplicate;
   - relationships are resolved in `seed-api.mjs` from a stable key (see `featuredTestimonialName` on `about-page`);
   - removing a key from the seed does not clear the stored value.
7. Update API and content-model documentation when the public contract changes.
8. Commit configuration and migration files together.

Do not use `migrate:init` for an ordinary schema change. Do not edit an already-applied migration to represent a new change; create another migration.

## Verify locally

1. Point `.env` at a disposable local PostgreSQL database.
2. Run `npm run migrate` and then `npm run db:check`.
3. Start the CMS with `npm run dev`.
4. In another terminal, run `npm run seed:core` or `npm run seed:dev` as appropriate. Before re-seeding a database that may have admin edits, compare each table's latest `updated_at` with the previous seed run; if anything changed since, ask before seeding, because the seed would overwrite those edits.
5. Verify admin editing and the affected public REST response. Check draft, published, anonymous, authenticated, empty, and invalid states relevant to the change.
6. Run `npm run build`.
7. For public contract changes, build or exercise `portfolio-ui` against this CMS and inspect the affected UI. Restart the UI dev server after a CMS outage or migration: `portfolio-ui/src/lib/content.js` memoizes the posts request for the life of the process.
8. Report the database used, migration and seed results, API behavior checked, and any validation not run.

If migration or development startup reports schema drift or possible data loss, decline the prompt. Back up and reconcile the database or repeat verification against a fresh disposable database. Never accept a destructive schema push merely to make a check pass.

If `npm run build` fails only because a restricted execution environment prevents Turbopack's CSS worker from binding a local port, run `npx next build --webpack` as a diagnostic fallback. Still report that the normal production command was blocked.

## Handle UI rebuild behavior

- Published content changes are visible to the public API immediately but reach the static UI only after a successful UI rebuild.
- Preserve webhook authentication and loopback deployment assumptions.
- Test rebuild-trigger changes independently from content persistence so failures are diagnosable.
- Do not make production deployment calls or remote seed operations unless the user explicitly requests and authorizes them.

## Release and deploy

- Work on `develop`; production deploys `main` through `npm run deploy:oci` in `portfolio-ui` on the OCI VM, which runs `npm run migrate` before restarting the CMS and never seeds. See "Release flow" in `../portfolio-ui/docs/OCI_DEPLOYMENT.md`.
- Never run `seed:core` against production after content has been edited there; enter release content in Payload Admin instead.
- Update `docs/CONTENT_MODEL.md` and the deployment runbooks' "Remaining production steps" when a release leaves content to fill in.
