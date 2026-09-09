import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cms"."posts_project_metrics" CASCADE;
  DROP TABLE "cms"."_posts_v_version_project_metrics" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "cms"."posts_project_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "cms"."_posts_v_version_project_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "cms"."posts_project_metrics" ADD CONSTRAINT "posts_project_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cms"."_posts_v_version_project_metrics" ADD CONSTRAINT "_posts_v_version_project_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "cms"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_project_metrics_order_idx" ON "cms"."posts_project_metrics" USING btree ("_order");
  CREATE INDEX "posts_project_metrics_parent_id_idx" ON "cms"."posts_project_metrics" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_project_metrics_order_idx" ON "cms"."_posts_v_version_project_metrics" USING btree ("_order");
  CREATE INDEX "_posts_v_version_project_metrics_parent_id_idx" ON "cms"."_posts_v_version_project_metrics" USING btree ("_parent_id");`)
}
