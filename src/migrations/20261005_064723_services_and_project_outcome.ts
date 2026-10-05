import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cms"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TABLE "cms"."services_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."services" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"contact_intent" varchar DEFAULT 'Project or services' NOT NULL,
  	"cta_label" varchar DEFAULT 'Start a conversation' NOT NULL,
  	"show_on_home" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 100,
  	"status" "cms"."enum_services_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "cms"."posts" ADD COLUMN "project_outcome" varchar;
  ALTER TABLE "cms"."_posts_v" ADD COLUMN "version_project_outcome" varchar;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD COLUMN "services_id" uuid;
  ALTER TABLE "cms"."home_page" ADD COLUMN "primary_cta_note" varchar;
  ALTER TABLE "cms"."home_page" ADD COLUMN "services_title" varchar;
  ALTER TABLE "cms"."home_page" ADD COLUMN "services_description" varchar;
  ALTER TABLE "cms"."home_page" ADD COLUMN "services_limit" numeric DEFAULT 4;
  ALTER TABLE "cms"."services_highlights" ADD CONSTRAINT "services_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_highlights_order_idx" ON "cms"."services_highlights" USING btree ("_order");
  CREATE INDEX "services_highlights_parent_id_idx" ON "cms"."services_highlights" USING btree ("_parent_id");
  CREATE INDEX "services_show_on_home_idx" ON "cms"."services" USING btree ("show_on_home");
  CREATE INDEX "services_sort_order_idx" ON "cms"."services" USING btree ("sort_order");
  CREATE INDEX "services_status_idx" ON "cms"."services" USING btree ("status");
  CREATE INDEX "services_updated_at_idx" ON "cms"."services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "cms"."services" USING btree ("created_at");
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "cms"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("services_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."services_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."services" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cms"."services_highlights" CASCADE;
  DROP TABLE "cms"."services" CASCADE;
  ALTER TABLE "cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  DROP INDEX "cms"."payload_locked_documents_rels_services_id_idx";
  ALTER TABLE "cms"."posts" DROP COLUMN "project_outcome";
  ALTER TABLE "cms"."_posts_v" DROP COLUMN "version_project_outcome";
  ALTER TABLE "cms"."payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "cms"."home_page" DROP COLUMN "primary_cta_note";
  ALTER TABLE "cms"."home_page" DROP COLUMN "services_title";
  ALTER TABLE "cms"."home_page" DROP COLUMN "services_description";
  ALTER TABLE "cms"."home_page" DROP COLUMN "services_limit";
  DROP TYPE "cms"."enum_services_status";`)
}
