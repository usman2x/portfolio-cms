import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE "cms"."home_page_proof_companies" (
      "_order" integer NOT NULL,
      "_parent_id" uuid NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );

    CREATE TABLE "cms"."home_page_proof_stats" (
      "_order" integer NOT NULL,
      "_parent_id" uuid NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "value" varchar NOT NULL,
      "label" varchar NOT NULL
    );

    ALTER TABLE "cms"."home_page" ADD COLUMN "proof_title" varchar;
    ALTER TABLE "cms"."home_page_proof_companies" ADD CONSTRAINT "home_page_proof_companies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."home_page"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "cms"."home_page_proof_stats" ADD CONSTRAINT "home_page_proof_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."home_page"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "home_page_proof_companies_order_idx" ON "cms"."home_page_proof_companies" USING btree ("_order");
    CREATE INDEX "home_page_proof_companies_parent_id_idx" ON "cms"."home_page_proof_companies" USING btree ("_parent_id");
    CREATE INDEX "home_page_proof_stats_order_idx" ON "cms"."home_page_proof_stats" USING btree ("_order");
    CREATE INDEX "home_page_proof_stats_parent_id_idx" ON "cms"."home_page_proof_stats" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "cms"."home_page_proof_companies" CASCADE;
    DROP TABLE "cms"."home_page_proof_stats" CASCADE;
    ALTER TABLE "cms"."home_page" DROP COLUMN "proof_title";
  `)
}
