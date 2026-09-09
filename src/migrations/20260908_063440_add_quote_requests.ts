import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "cms"."enum_quote_requests_help_type" AS ENUM('Build a new product or feature', 'Improve or modernize an existing system', 'Data platform / ETL / analytics work', 'AI integration or workflow automation', 'Architecture review or technical consulting', 'Something else');
  CREATE TYPE "cms"."enum_quote_requests_work_type" AS ENUM('Short consultation', 'Fixed-scope project', 'Ongoing engineering support', 'Audit / review / assessment');
  CREATE TYPE "cms"."enum_quote_requests_timeline" AS ENUM('ASAP', 'Within 2 weeks', 'Within 1 month', 'Within 1 to 3 months', 'Flexible / exploring');
  CREATE TYPE "cms"."enum_quote_requests_budget" AS ENUM('Under $2k', '$2k to $5k', '$5k to $10k', '$10k+', 'Prefer to discuss first');
  CREATE TYPE "cms"."enum_quote_requests_preferred_contact" AS ENUM('Email', 'WhatsApp', 'Schedule a call');
  CREATE TYPE "cms"."enum_quote_requests_status" AS ENUM('new', 'contacted', 'closed', 'spam');
  CREATE TABLE "cms"."quote_requests" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"help_type" "cms"."enum_quote_requests_help_type" NOT NULL,
  	"work_type" "cms"."enum_quote_requests_work_type" NOT NULL,
  	"timeline" "cms"."enum_quote_requests_timeline" NOT NULL,
  	"budget" "cms"."enum_quote_requests_budget" NOT NULL,
  	"context" varchar NOT NULL,
  	"preferred_contact" "cms"."enum_quote_requests_preferred_contact" NOT NULL,
  	"status" "cms"."enum_quote_requests_status" DEFAULT 'new' NOT NULL,
  	"source_url" varchar,
  	"user_agent" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD COLUMN "quote_requests_id" uuid;
  CREATE INDEX "quote_requests_email_idx" ON "cms"."quote_requests" USING btree ("email");
  CREATE INDEX "quote_requests_updated_at_idx" ON "cms"."quote_requests" USING btree ("updated_at");
  CREATE INDEX "quote_requests_created_at_idx" ON "cms"."quote_requests" USING btree ("created_at");
  ALTER TABLE "cms"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quote_requests_fk" FOREIGN KEY ("quote_requests_id") REFERENCES "cms"."quote_requests"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_quote_requests_id_idx" ON "cms"."payload_locked_documents_rels" USING btree ("quote_requests_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."quote_requests" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cms"."quote_requests" CASCADE;
  ALTER TABLE "cms"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_quote_requests_fk";
  
  DROP INDEX "cms"."payload_locked_documents_rels_quote_requests_id_idx";
  ALTER TABLE "cms"."payload_locked_documents_rels" DROP COLUMN "quote_requests_id";
  DROP TYPE "cms"."enum_quote_requests_help_type";
  DROP TYPE "cms"."enum_quote_requests_work_type";
  DROP TYPE "cms"."enum_quote_requests_timeline";
  DROP TYPE "cms"."enum_quote_requests_budget";
  DROP TYPE "cms"."enum_quote_requests_preferred_contact";
  DROP TYPE "cms"."enum_quote_requests_status";`)
}
