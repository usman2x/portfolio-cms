import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cms"."enum_posts_kind" AS ENUM('article', 'project');
  CREATE TYPE "cms"."enum__posts_v_version_kind" AS ENUM('article', 'project');
  ALTER TABLE "cms"."posts" ADD COLUMN "kind" "cms"."enum_posts_kind" DEFAULT 'article';
  ALTER TABLE "cms"."_posts_v" ADD COLUMN "version_kind" "cms"."enum__posts_v_version_kind" DEFAULT 'article';`)

  // Case studies were marked with the case-study tag; carry that into kind for posts and their versions.
  await db.execute(sql`
   UPDATE "cms"."posts" SET "kind" = 'project'
   WHERE "id" IN (
     SELECT r."parent_id" FROM "cms"."posts_rels" r
     JOIN "cms"."tags" t ON t."id" = r."tags_id"
     WHERE r."path" = 'tags' AND t."slug" = 'case-study'
   );
  UPDATE "cms"."_posts_v" SET "version_kind" = 'project'
   WHERE "id" IN (
     SELECT r."parent_id" FROM "cms"."_posts_v_rels" r
     JOIN "cms"."tags" t ON t."id" = r."tags_id"
     WHERE r."path" = 'version.tags' AND t."slug" = 'case-study'
   );`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."posts" DROP COLUMN "kind";
  ALTER TABLE "cms"."_posts_v" DROP COLUMN "version_kind";
  DROP TYPE "cms"."enum_posts_kind";
  DROP TYPE "cms"."enum__posts_v_version_kind";`)
}
