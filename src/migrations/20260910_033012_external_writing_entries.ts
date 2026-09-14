import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cms"."enum_posts_publication_type" AS ENUM('native', 'external');
  CREATE TYPE "cms"."enum_posts_external_platform" AS ENUM('medium', 'linkedin', 'other');
  CREATE TYPE "cms"."enum__posts_v_version_publication_type" AS ENUM('native', 'external');
  CREATE TYPE "cms"."enum__posts_v_version_external_platform" AS ENUM('medium', 'linkedin', 'other');
  ALTER TABLE "cms"."posts" ADD COLUMN "publication_type" "cms"."enum_posts_publication_type" DEFAULT 'native';
  ALTER TABLE "cms"."posts" ADD COLUMN "external_platform" "cms"."enum_posts_external_platform";
  ALTER TABLE "cms"."posts" ADD COLUMN "external_url" varchar;
  ALTER TABLE "cms"."posts" ADD COLUMN "external_cta_label" varchar;
  ALTER TABLE "cms"."_posts_v" ADD COLUMN "version_publication_type" "cms"."enum__posts_v_version_publication_type" DEFAULT 'native';
  ALTER TABLE "cms"."_posts_v" ADD COLUMN "version_external_platform" "cms"."enum__posts_v_version_external_platform";
  ALTER TABLE "cms"."_posts_v" ADD COLUMN "version_external_url" varchar;
  ALTER TABLE "cms"."_posts_v" ADD COLUMN "version_external_cta_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."posts" DROP COLUMN "publication_type";
  ALTER TABLE "cms"."posts" DROP COLUMN "external_platform";
  ALTER TABLE "cms"."posts" DROP COLUMN "external_url";
  ALTER TABLE "cms"."posts" DROP COLUMN "external_cta_label";
  ALTER TABLE "cms"."_posts_v" DROP COLUMN "version_publication_type";
  ALTER TABLE "cms"."_posts_v" DROP COLUMN "version_external_platform";
  ALTER TABLE "cms"."_posts_v" DROP COLUMN "version_external_url";
  ALTER TABLE "cms"."_posts_v" DROP COLUMN "version_external_cta_label";
  DROP TYPE "cms"."enum_posts_publication_type";
  DROP TYPE "cms"."enum_posts_external_platform";
  DROP TYPE "cms"."enum__posts_v_version_publication_type";
  DROP TYPE "cms"."enum__posts_v_version_external_platform";`)
}
