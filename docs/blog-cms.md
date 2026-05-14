# Payload CMS Repo Design

Status: Implemented  
Reviewed on 2026-05-07.

This document is the source of truth for the separate Payload CMS repository.

## 1. Objective

Build a dedicated Payload CMS repository for blog management with:

- admin-only access
- blog post create and update support
- user creation from admin
- tag management
- image upload and update support
- image storage in PostgreSQL
- migration-based schema management
- TypeScript implementation
- SEO-ready content modeling

## 2. Repo Goal

This repo exists to provide:

- editorial workflow
- structured content storage
- public published-content API
- media storage and delivery

It does not own the public blog UI.

## 3. Suggested Repo Shape

```text
blog-cms/
  src/
    access/
    collections/
    hooks/
    lib/
    migrations/
    payload.config.ts
  package.json
  tsconfig.json
  .env.example
  README.md
```

## 4. Technical Stack

- Payload CMS
- Next.js runtime as required by Payload
- PostgreSQL
- TypeScript

## Runtime Clarification

- this repo is `Next.js`-based because Payload runs on Next.js
- this repo is not `NestJS`-based

## 5. Functional Requirements

### Admin

- admin can sign in
- admin can create users
- admin can deactivate users
- admin can create, update, publish, and unpublish posts
- admin can create and manage tags
- admin can upload and replace images
- admin can manage SEO fields per post

### Public API

- public endpoints return published content only
- public can read published posts
- public can read tags
- media required for published content must be retrievable

## 6. Data Model

The initial schema uses:

- `users`
- `tags`
- `media`
- `posts`

## 7. `users` Collection

Purpose:

- admin authentication
- content ownership
- media ownership

User model in V1:

- there is only one CMS user type: `admin`
- there is no guest user collection in V1
- public readers are anonymous consumers of published content, not authenticated CMS users

Required fields:

| Field | Type | Rules |
| --- | --- | --- |
| `name` | `text` | required |
| `email` | `email` | required, unique |
| `role` | `select` | only `admin` in V1 |
| `isActive` | `checkbox` | default `true` |

Behavior:

- auth-enabled collection
- no public signup
- only admins can create more admins

### User Type and Role Determination

- `role` is the source of truth for CMS authorization
- in V1, `role` only allows `admin`
- `isActive` controls whether the admin account is allowed to log in and continue using the CMS
- any future roles such as `editor` or `author` must be added explicitly to the `role` field and then wired into collection access rules

Interpretation rules:

- `role = admin` and `isActive = true` means full CMS access
- `role = admin` and `isActive = false` means account exists but must not authenticate successfully

### Credentials Storage

- credentials should be handled by Payload's built-in auth system on the `users` collection
- the schema should not define or store plain-text passwords
- email is stored as a normal collection field
- password should be stored only as a secure hash managed by Payload auth
- password reset, session, token, and auth-related flows should use Payload's built-in auth endpoints

Design rule:

- treat password storage as an auth concern owned by Payload, not as a custom application field
- do not expose password hashes or auth internals through public API responses

Initial admin bootstrapping:

- the first admin can be created through a seed/setup flow
- after bootstrap, only existing admins can create more admins

## 8. `tags` Collection

Purpose:

- structured taxonomy for archive filtering and related posts

Required fields:

| Field | Type | Rules |
| --- | --- | --- |
| `name` | `text` | required |
| `slug` | `text` | required, unique |
| `description` | `textarea` | optional |

Behavior:

- public read allowed
- admin CRUD allowed
- unique slug index required

## 9. `media` Collection

Purpose:

- cover images
- Open Graph images
- inline article images

Required fields:

| Field | Type | Rules |
| --- | --- | --- |
| `alt` | `text` | required |
| `caption` | `textarea` | optional |
| `uploadedBy` | `relationship` | relation to `users` |
| `usageType` | `select` | `cover`, `inline`, `og`, `generic` |

Payload metadata expected:

- filename
- mime type
- file size
- width
- height

## 10. `posts` Collection

Purpose:

- primary editorial content for the public blog

Required fields:

| Field | Type | Rules |
| --- | --- | --- |
| `title` | `text` | required |
| `slug` | `text` | required, unique |
| `excerpt` | `textarea` | required |
| `content` | `richText` | required |
| `author` | `relationship` | required, relation to `users` |
| `tags` | `relationship` | hasMany relation to `tags` |
| `coverImage` | `relationship` | relation to `media`, recommended |
| `ogImage` | `relationship` | relation to `media`, optional |
| `status` | `select` | `draft`, `published` |
| `publishedAt` | `date` | required for published posts |
| `seoTitle` | `text` | required for published posts |
| `seoDescription` | `textarea` | required for published posts |
| `canonicalUrl` | `text` | optional |
| `noindex` | `checkbox` | default `false` |

Recommended optional fields:

| Field | Type | Rules |
| --- | --- | --- |
| `readingTimeMinutes` | `number` | optional computed field |
| `featured` | `checkbox` | optional |

## 11. Relationship Rules

- one post has one author
- one post can have many tags
- one post can have one cover image
- one post can have one OG image
- one user can upload many media items

Deletion constraints:

- tags in use by posts should not be deleted without reassignment
- media used by published posts should not be deleted
- users referenced by posts should not be deleted until ownership is reassigned

## 12. Access Control

V1 roles:

- `admin`

Non-user public access:

- blog readers are not CMS users
- they consume published content anonymously through public REST endpoints

Access matrix:

| Collection | Public Read | Public Write | Admin Read | Admin Write |
| --- | --- | --- | --- | --- |
| `users` | no | no | yes | yes |
| `tags` | yes | no | yes | yes |
| `media` | restricted | no | yes | yes |
| `posts` | published only | no | yes | yes |

Rules:

- users are admin-only
- posts are publicly readable only when `status = published`
- tags are publicly readable
- media is publicly readable only when it belongs to published content or is marked public

## 13. Publishing Workflow

- posts start as `draft`
- drafts are never exposed publicly
- publishing requires:
  - `title`
  - `slug`
  - `excerpt`
  - `content`
  - `seoTitle`
  - `seoDescription`
  - `publishedAt`

Recommended hooks:

- slug generation on initial create
- publish validation before save
- automatic `publishedAt` set on first publish
- slug change protection after publish

## 14. SEO Requirements

Each published post must support:

- stable slug
- SEO title
- SEO description
- canonical URL
- OG image
- `noindex` flag

Public API rules:

- return published posts only
- exclude drafts from sitemap-producing consumers
- expose enough data for `BlogPosting` structured data in the site repo

## 15. Media Storage Design

The requirement is to store images in PostgreSQL.

Decision:

- store media metadata in PostgreSQL
- store image binaries in PostgreSQL
- store generated variants in PostgreSQL

Suggested companion binary table if needed:

### `media_blobs`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | primary key |
| `media_id` | `uuid` | FK to media record |
| `variant` | `text` | `original`, `card`, `og`, etc. |
| `mime_type` | `text` | required |
| `byte_size` | `integer` | required |
| `data` | `bytea` | binary payload |
| `created_at` | `timestamp` | required |
| `updated_at` | `timestamp` | required |

Constraint:

- acceptable for blog-scale media volume in V1
- can later move to object storage without changing post relationships

## 16. API Contract

Preferred public endpoints for the Gatsby site:

- `GET /api/posts`
- `GET /api/posts/:id`
- `GET /api/tags`
- `GET /api/media/:id` or resolved media URLs in post payloads

Chosen integration method:

- `REST`

Why REST for this integration:

- simpler cross-repo contract for Gatsby build-time fetching
- easy support for filtering, sorting, pagination, and relationship depth
- straightforward public access control for published content only

Published-content requirements:

- filter posts to `status = published`
- return tags with post data
- return media references required for archive and detail pages

## 17. Migrations

Rules:

- every schema change uses migrations
- migration files are committed
- local and staging schema must be managed through migrations only

Workflow:

1. update collection config
2. generate migration
3. review migration
4. commit config and migration together
5. apply locally
6. apply in staging before rollout

## 18. Deployment

### Local

- local PostgreSQL
- local Payload app
- seeded admin user

### Staging

- Railway PostgreSQL
- Railway app deployment for CMS
- migration run before app rollout completes

Required environment values:

- `DATABASE_URL`
- Payload secret
- any media-serving configuration needed for public URLs

Optional publish automation value:

- `UI_DEPLOY_WEBHOOK_URL`
  - deployment-provider-agnostic webhook endpoint used to trigger the UI rebuild after published content changes
  - examples include a Vercel Deploy Hook, Netlify Build Hook, GitHub Actions relay endpoint, or a custom deployment webhook
  - backward-compatible alias may still be accepted during transition: `UI_DEPLOY_HOOK_URL`

GitHub Actions deployment workflow:

- workflow file: `.github/workflows/deploy.yml`
- trigger: push to `main` and manual dispatch
- steps: install dependencies, verify DB access, run migrations, verify build, trigger Railway deploy hook
- required GitHub secrets:
  - `DATABASE_URL`
  - `PAYLOAD_SECRET`
  - `RAILWAY_DEPLOY_HOOK_URL`

## 19. Repo Tasks

### Foundation

- initialize separate Payload repository
- configure TypeScript
- configure PostgreSQL connection
- add environment template

### Schema

- create `users` collection
- create `tags` collection
- create `media` collection
- create `posts` collection
- define relationships and indexes

### Security

- add admin auth
- add access helpers
- add published-only public read rules

### Publishing

- add slug hook
- add publish validation
- add published date automation

### Media

- implement PostgreSQL-backed image storage
- support original and derived variants
- expose media routes usable by the Gatsby site

### Delivery

- add migrations workflow
- deploy to Railway staging
- document API contract for the Gatsby site
