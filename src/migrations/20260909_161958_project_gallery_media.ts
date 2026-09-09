import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."media" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "cms"."media" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "cms"."media" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "cms"."media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "cms"."media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "cms"."media" ADD COLUMN "sizes_thumbnail_filename" varchar;
  ALTER TABLE "cms"."posts_rels" ADD COLUMN "media_id" uuid;
  ALTER TABLE "cms"."_posts_v_rels" ADD COLUMN "media_id" uuid;
  ALTER TABLE "cms"."posts_rels" ADD CONSTRAINT "posts_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "cms"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "cms"."media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "posts_rels_media_id_idx" ON "cms"."posts_rels" USING btree ("media_id");
  CREATE INDEX "_posts_v_rels_media_id_idx" ON "cms"."_posts_v_rels" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."posts_rels" DROP CONSTRAINT "posts_rels_media_fk";
  
  ALTER TABLE "cms"."_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_media_fk";
  
  DROP INDEX "cms"."media_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX "cms"."posts_rels_media_id_idx";
  DROP INDEX "cms"."_posts_v_rels_media_id_idx";
  ALTER TABLE "cms"."media" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "cms"."media" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "cms"."media" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "cms"."media" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "cms"."media" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "cms"."media" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "cms"."posts_rels" DROP COLUMN "media_id";
  ALTER TABLE "cms"."_posts_v_rels" DROP COLUMN "media_id";`)
}
