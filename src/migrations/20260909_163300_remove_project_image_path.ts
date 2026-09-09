import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."posts" DROP COLUMN "project_image_path";
  ALTER TABLE "cms"."_posts_v" DROP COLUMN "version_project_image_path";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."posts" ADD COLUMN "project_image_path" varchar;
  ALTER TABLE "cms"."_posts_v" ADD COLUMN "version_project_image_path" varchar;`)
}
