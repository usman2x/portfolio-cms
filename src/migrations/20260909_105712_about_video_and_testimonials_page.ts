import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "cms"."testimonials_page" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "cms"."home_page" ALTER COLUMN "testimonial_limit" SET DEFAULT 2;
  ALTER TABLE "cms"."home_page" ADD COLUMN "testimonials_archive_label" varchar;
  ALTER TABLE "cms"."about_page" ADD COLUMN "video_eyebrow" varchar;
  ALTER TABLE "cms"."about_page" ADD COLUMN "video_title" varchar;
  ALTER TABLE "cms"."about_page" ADD COLUMN "video_description" varchar;
  ALTER TABLE "cms"."about_page" ADD COLUMN "video_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."testimonials_page" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cms"."testimonials_page" CASCADE;
  ALTER TABLE "cms"."home_page" ALTER COLUMN "testimonial_limit" SET DEFAULT 4;
  ALTER TABLE "cms"."home_page" DROP COLUMN "testimonials_archive_label";
  ALTER TABLE "cms"."about_page" DROP COLUMN "video_eyebrow";
  ALTER TABLE "cms"."about_page" DROP COLUMN "video_title";
  ALTER TABLE "cms"."about_page" DROP COLUMN "video_description";
  ALTER TABLE "cms"."about_page" DROP COLUMN "video_url";`)
}
