import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."about_page" ADD COLUMN "featured_testimonial_id" uuid;
  ALTER TABLE "cms"."about_page" ADD CONSTRAINT "about_page_featured_testimonial_id_testimonials_id_fk" FOREIGN KEY ("featured_testimonial_id") REFERENCES "cms"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_page_featured_testimonial_idx" ON "cms"."about_page" USING btree ("featured_testimonial_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."about_page" DROP CONSTRAINT "about_page_featured_testimonial_id_testimonials_id_fk";
  
  DROP INDEX "cms"."about_page_featured_testimonial_idx";
  ALTER TABLE "cms"."about_page" DROP COLUMN "featured_testimonial_id";`)
}
