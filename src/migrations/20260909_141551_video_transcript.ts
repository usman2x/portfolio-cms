import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."about_page" ADD COLUMN "video_transcript" varchar;
  ALTER TABLE "cms"."about_page" ADD COLUMN "video_transcript_label" varchar DEFAULT 'Read video transcript';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."about_page" DROP COLUMN "video_transcript";
  ALTER TABLE "cms"."about_page" DROP COLUMN "video_transcript_label";`)
}
