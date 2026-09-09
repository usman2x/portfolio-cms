import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cms"."enum_testimonials_relationship" AS ENUM('manager', 'colleague', 'client', 'other');
  CREATE TYPE "cms"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TABLE "cms"."testimonials" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"company" varchar,
  	"relationship" "cms"."enum_testimonials_relationship" NOT NULL,
  	"quote" varchar NOT NULL,
  	"recommendation_date" timestamp(3) with time zone,
  	"source_label" varchar DEFAULT 'LinkedIn recommendation',
  	"source_url" varchar,
  	"featured" boolean DEFAULT false,
  	"sort_order" numeric DEFAULT 100,
  	"status" "cms"."enum_testimonials_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD COLUMN "testimonials_id" uuid;
  CREATE INDEX "testimonials_sort_order_idx" ON "cms"."testimonials" USING btree ("sort_order");
  CREATE INDEX "testimonials_status_idx" ON "cms"."testimonials" USING btree ("status");
  CREATE INDEX "testimonials_updated_at_idx" ON "cms"."testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "cms"."testimonials" USING btree ("created_at");
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "cms"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("testimonials_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."testimonials" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cms"."testimonials" CASCADE;
  ALTER TABLE "cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_testimonials_fk";
  
  DROP INDEX "cms"."payload_locked_documents_rels_testimonials_id_idx";
  ALTER TABLE "cms"."payload_locked_documents_rels" DROP COLUMN "testimonials_id";
  DROP TYPE "cms"."enum_testimonials_relationship";
  DROP TYPE "cms"."enum_testimonials_status";`)
}
