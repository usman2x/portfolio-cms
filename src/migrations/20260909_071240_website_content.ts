import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cms"."enum_work_experience_status" AS ENUM('draft', 'published');
  CREATE TABLE "cms"."work_experience_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."work_experience" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"company" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"period" varchar NOT NULL,
  	"location" varchar,
  	"website" varchar,
  	"summary" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 100 NOT NULL,
  	"status" "cms"."enum_work_experience_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."site_settings_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"is_primary" boolean DEFAULT false
  );
  
  CREATE TABLE "cms"."site_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"short_label" varchar NOT NULL,
  	"professional_title" varchar NOT NULL,
  	"default_seo_title" varchar NOT NULL,
  	"default_seo_description" varchar NOT NULL,
  	"portrait_id" uuid,
  	"portrait_path" varchar,
  	"portrait_alt" varchar NOT NULL,
  	"resume_link" varchar,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"meeting_link" varchar NOT NULL,
  	"footer_description" varchar NOT NULL,
  	"book_call_title" varchar NOT NULL,
  	"book_call_description" varchar NOT NULL,
  	"book_call_button_label" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."home_page_trust_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."home_page" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"headline" varchar NOT NULL,
  	"supporting_text" varchar NOT NULL,
  	"primary_cta_label" varchar NOT NULL,
  	"secondary_cta_label" varchar NOT NULL,
  	"post_hero_line" varchar NOT NULL,
  	"writings_title" varchar NOT NULL,
  	"writings_archive_label" varchar NOT NULL,
  	"writings_limit" numeric DEFAULT 3,
  	"projects_title" varchar NOT NULL,
  	"projects_archive_label" varchar NOT NULL,
  	"testimonials_eyebrow" varchar NOT NULL,
  	"testimonials_title" varchar NOT NULL,
  	"testimonials_description" varchar NOT NULL,
  	"testimonial_limit" numeric DEFAULT 4,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" uuid
  );
  
  CREATE TABLE "cms"."about_page_summary" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."about_page_strengths" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."about_page" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"experience_title" varchar NOT NULL,
  	"strengths_title" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."quote_page_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."quote_page_help_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."quote_page_work_types" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."quote_page_timelines" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."quote_page_budgets" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."quote_page_contact_methods" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "cms"."quote_page" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"eyebrow" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"response_note" varchar NOT NULL,
  	"privacy_note" varchar NOT NULL,
  	"next_steps_title" varchar NOT NULL,
  	"alternatives_title" varchar NOT NULL,
  	"call_label" varchar NOT NULL,
  	"email_link_label" varchar NOT NULL,
  	"form_eyebrow" varchar NOT NULL,
  	"form_title" varchar NOT NULL,
  	"required_fields_label" varchar NOT NULL,
  	"scope_legend" varchar NOT NULL,
  	"select_placeholder" varchar NOT NULL,
  	"help_type_label" varchar NOT NULL,
  	"work_type_label" varchar NOT NULL,
  	"timeline_label" varchar NOT NULL,
  	"budget_label" varchar NOT NULL,
  	"context_label" varchar NOT NULL,
  	"context_placeholder" varchar NOT NULL,
  	"context_legend" varchar NOT NULL,
  	"context_help" varchar NOT NULL,
  	"contact_legend" varchar NOT NULL,
  	"name_label" varchar NOT NULL,
  	"name_placeholder" varchar NOT NULL,
  	"email_label" varchar NOT NULL,
  	"email_placeholder" varchar NOT NULL,
  	"company_label" varchar NOT NULL,
  	"company_placeholder" varchar NOT NULL,
  	"preferred_contact_label" varchar NOT NULL,
  	"submit_label" varchar NOT NULL,
  	"submitting_label" varchar NOT NULL,
  	"success_message" varchar NOT NULL,
  	"error_message" varchar NOT NULL,
  	"success_eyebrow" varchar NOT NULL,
  	"success_title" varchar NOT NULL,
  	"send_another_label" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."archive_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"writings_title" varchar NOT NULL,
  	"writings_seo_description" varchar NOT NULL,
  	"filter_title" varchar NOT NULL,
  	"filter_description" varchar NOT NULL,
  	"posts_per_page" numeric DEFAULT 6,
  	"writing_cta_label" varchar NOT NULL,
  	"read_article_label" varchar NOT NULL,
  	"projects_title" varchar NOT NULL,
  	"projects_seo_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."project_template" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"back_label" varchar NOT NULL,
  	"stack_label" varchar NOT NULL,
  	"link_label" varchar NOT NULL,
  	"default_link_label" varchar NOT NULL,
  	"link_description" varchar NOT NULL,
  	"story_title" varchar NOT NULL,
  	"previous_label" varchar NOT NULL,
  	"next_label" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cms"."system_pages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"not_found_title" varchar NOT NULL,
  	"not_found_message" varchar NOT NULL,
  	"thank_you_title" varchar NOT NULL,
  	"thank_you_message" varchar NOT NULL,
  	"home_button_label" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "cms"."quote_requests" ALTER COLUMN "help_type" SET DATA TYPE varchar;
  ALTER TABLE "cms"."quote_requests" ALTER COLUMN "work_type" SET DATA TYPE varchar;
  ALTER TABLE "cms"."quote_requests" ALTER COLUMN "timeline" SET DATA TYPE varchar;
  ALTER TABLE "cms"."quote_requests" ALTER COLUMN "budget" SET DATA TYPE varchar;
  ALTER TABLE "cms"."quote_requests" ALTER COLUMN "preferred_contact" SET DATA TYPE varchar;
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD COLUMN "work_experience_id" uuid;
  ALTER TABLE "cms"."work_experience_highlights" ADD CONSTRAINT "work_experience_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."work_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings_navigation" ADD CONSTRAINT "site_settings_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."site_settings" ADD CONSTRAINT "site_settings_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cms"."home_page_trust_chips" ADD CONSTRAINT "home_page_trust_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "cms"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."home_page_rels" ADD CONSTRAINT "home_page_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "cms"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."about_page_summary" ADD CONSTRAINT "about_page_summary_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."about_page_strengths" ADD CONSTRAINT "about_page_strengths_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."quote_page_process" ADD CONSTRAINT "quote_page_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."quote_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."quote_page_help_types" ADD CONSTRAINT "quote_page_help_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."quote_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."quote_page_work_types" ADD CONSTRAINT "quote_page_work_types_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."quote_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."quote_page_timelines" ADD CONSTRAINT "quote_page_timelines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."quote_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."quote_page_budgets" ADD CONSTRAINT "quote_page_budgets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."quote_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."quote_page_contact_methods" ADD CONSTRAINT "quote_page_contact_methods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."quote_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "work_experience_highlights_order_idx" ON "cms"."work_experience_highlights" USING btree ("_order");
  CREATE INDEX "work_experience_highlights_parent_id_idx" ON "cms"."work_experience_highlights" USING btree ("_parent_id");
  CREATE INDEX "work_experience_sort_order_idx" ON "cms"."work_experience" USING btree ("sort_order");
  CREATE INDEX "work_experience_status_idx" ON "cms"."work_experience" USING btree ("status");
  CREATE INDEX "work_experience_updated_at_idx" ON "cms"."work_experience" USING btree ("updated_at");
  CREATE INDEX "work_experience_created_at_idx" ON "cms"."work_experience" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "cms"."site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "cms"."site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_navigation_order_idx" ON "cms"."site_settings_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_navigation_parent_id_idx" ON "cms"."site_settings_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_portrait_idx" ON "cms"."site_settings" USING btree ("portrait_id");
  CREATE INDEX "home_page_trust_chips_order_idx" ON "cms"."home_page_trust_chips" USING btree ("_order");
  CREATE INDEX "home_page_trust_chips_parent_id_idx" ON "cms"."home_page_trust_chips" USING btree ("_parent_id");
  CREATE INDEX "home_page_rels_order_idx" ON "cms"."home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "cms"."home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "cms"."home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_posts_id_idx" ON "cms"."home_page_rels" USING btree ("posts_id");
  CREATE INDEX "about_page_summary_order_idx" ON "cms"."about_page_summary" USING btree ("_order");
  CREATE INDEX "about_page_summary_parent_id_idx" ON "cms"."about_page_summary" USING btree ("_parent_id");
  CREATE INDEX "about_page_strengths_order_idx" ON "cms"."about_page_strengths" USING btree ("_order");
  CREATE INDEX "about_page_strengths_parent_id_idx" ON "cms"."about_page_strengths" USING btree ("_parent_id");
  CREATE INDEX "quote_page_process_order_idx" ON "cms"."quote_page_process" USING btree ("_order");
  CREATE INDEX "quote_page_process_parent_id_idx" ON "cms"."quote_page_process" USING btree ("_parent_id");
  CREATE INDEX "quote_page_help_types_order_idx" ON "cms"."quote_page_help_types" USING btree ("_order");
  CREATE INDEX "quote_page_help_types_parent_id_idx" ON "cms"."quote_page_help_types" USING btree ("_parent_id");
  CREATE INDEX "quote_page_work_types_order_idx" ON "cms"."quote_page_work_types" USING btree ("_order");
  CREATE INDEX "quote_page_work_types_parent_id_idx" ON "cms"."quote_page_work_types" USING btree ("_parent_id");
  CREATE INDEX "quote_page_timelines_order_idx" ON "cms"."quote_page_timelines" USING btree ("_order");
  CREATE INDEX "quote_page_timelines_parent_id_idx" ON "cms"."quote_page_timelines" USING btree ("_parent_id");
  CREATE INDEX "quote_page_budgets_order_idx" ON "cms"."quote_page_budgets" USING btree ("_order");
  CREATE INDEX "quote_page_budgets_parent_id_idx" ON "cms"."quote_page_budgets" USING btree ("_parent_id");
  CREATE INDEX "quote_page_contact_methods_order_idx" ON "cms"."quote_page_contact_methods" USING btree ("_order");
  CREATE INDEX "quote_page_contact_methods_parent_id_idx" ON "cms"."quote_page_contact_methods" USING btree ("_parent_id");
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_work_experience_fk" FOREIGN KEY ("work_experience_id") REFERENCES "cms"."work_experience"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_work_experience_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("work_experience_id");
  DROP TYPE "cms"."enum_quote_requests_help_type";
  DROP TYPE "cms"."enum_quote_requests_work_type";
  DROP TYPE "cms"."enum_quote_requests_timeline";
  DROP TYPE "cms"."enum_quote_requests_budget";
  DROP TYPE "cms"."enum_quote_requests_preferred_contact";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cms"."enum_quote_requests_help_type" AS ENUM('Build a new product or feature', 'Improve or modernize an existing system', 'Data platform / ETL / analytics work', 'AI integration or workflow automation', 'Architecture review or technical consulting', 'Something else');
  CREATE TYPE "cms"."enum_quote_requests_work_type" AS ENUM('Short consultation', 'Fixed-scope project', 'Ongoing engineering support', 'Audit / review / assessment');
  CREATE TYPE "cms"."enum_quote_requests_timeline" AS ENUM('ASAP', 'Within 2 weeks', 'Within 1 month', 'Within 1 to 3 months', 'Flexible / exploring');
  CREATE TYPE "cms"."enum_quote_requests_budget" AS ENUM('Under $2k', '$2k to $5k', '$5k to $10k', '$10k+', 'Prefer to discuss first');
  CREATE TYPE "cms"."enum_quote_requests_preferred_contact" AS ENUM('Email', 'WhatsApp', 'Schedule a call');
  ALTER TABLE "cms"."work_experience_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."work_experience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."site_settings_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."site_settings_navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."home_page_trust_chips" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."home_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."home_page_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."about_page_summary" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."about_page_strengths" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."about_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."quote_page_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."quote_page_help_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."quote_page_work_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."quote_page_timelines" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."quote_page_budgets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."quote_page_contact_methods" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."quote_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."archive_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."project_template" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cms"."system_pages" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cms"."work_experience_highlights" CASCADE;
  DROP TABLE "cms"."work_experience" CASCADE;
  DROP TABLE "cms"."site_settings_social_links" CASCADE;
  DROP TABLE "cms"."site_settings_navigation" CASCADE;
  DROP TABLE "cms"."site_settings" CASCADE;
  DROP TABLE "cms"."home_page_trust_chips" CASCADE;
  DROP TABLE "cms"."home_page" CASCADE;
  DROP TABLE "cms"."home_page_rels" CASCADE;
  DROP TABLE "cms"."about_page_summary" CASCADE;
  DROP TABLE "cms"."about_page_strengths" CASCADE;
  DROP TABLE "cms"."about_page" CASCADE;
  DROP TABLE "cms"."quote_page_process" CASCADE;
  DROP TABLE "cms"."quote_page_help_types" CASCADE;
  DROP TABLE "cms"."quote_page_work_types" CASCADE;
  DROP TABLE "cms"."quote_page_timelines" CASCADE;
  DROP TABLE "cms"."quote_page_budgets" CASCADE;
  DROP TABLE "cms"."quote_page_contact_methods" CASCADE;
  DROP TABLE "cms"."quote_page" CASCADE;
  DROP TABLE "cms"."archive_settings" CASCADE;
  DROP TABLE "cms"."project_template" CASCADE;
  DROP TABLE "cms"."system_pages" CASCADE;
  ALTER TABLE "cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_work_experience_fk";
  
  DROP INDEX "cms"."payload_locked_documents_rels_work_experience_id_idx";
  ALTER TABLE "cms"."quote_requests" ALTER COLUMN "help_type" SET DATA TYPE "cms"."enum_quote_requests_help_type" USING "help_type"::"cms"."enum_quote_requests_help_type";
  ALTER TABLE "cms"."quote_requests" ALTER COLUMN "work_type" SET DATA TYPE "cms"."enum_quote_requests_work_type" USING "work_type"::"cms"."enum_quote_requests_work_type";
  ALTER TABLE "cms"."quote_requests" ALTER COLUMN "timeline" SET DATA TYPE "cms"."enum_quote_requests_timeline" USING "timeline"::"cms"."enum_quote_requests_timeline";
  ALTER TABLE "cms"."quote_requests" ALTER COLUMN "budget" SET DATA TYPE "cms"."enum_quote_requests_budget" USING "budget"::"cms"."enum_quote_requests_budget";
  ALTER TABLE "cms"."quote_requests" ALTER COLUMN "preferred_contact" SET DATA TYPE "cms"."enum_quote_requests_preferred_contact" USING "preferred_contact"::"cms"."enum_quote_requests_preferred_contact";
  ALTER TABLE "cms"."payload_locked_documents_rels" DROP COLUMN "work_experience_id";
  DROP TYPE "cms"."enum_work_experience_status";`)
}
