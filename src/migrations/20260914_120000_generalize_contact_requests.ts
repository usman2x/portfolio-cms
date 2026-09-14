import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "name" DROP NOT NULL;
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "email" DROP NOT NULL;
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "work_type" DROP NOT NULL;
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "timeline" DROP NOT NULL;
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "budget" DROP NOT NULL;
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "preferred_contact" DROP NOT NULL;
    ALTER TABLE "cms"."quote_requests" ADD COLUMN "wants_reply" boolean DEFAULT false;
    ALTER TABLE "cms"."quote_requests" ADD COLUMN "phone" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "cms"."quote_requests"
    SET "name" = COALESCE("name", 'Anonymous'),
        "email" = COALESCE("email", 'anonymous@example.invalid'),
        "work_type" = COALESCE("work_type", 'Not applicable'),
        "timeline" = COALESCE("timeline", 'Not applicable'),
        "budget" = COALESCE("budget", 'Not applicable'),
        "preferred_contact" = COALESCE("preferred_contact", 'Email');
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "name" SET NOT NULL;
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "email" SET NOT NULL;
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "work_type" SET NOT NULL;
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "timeline" SET NOT NULL;
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "budget" SET NOT NULL;
    ALTER TABLE "cms"."quote_requests" ALTER COLUMN "preferred_contact" SET NOT NULL;
    ALTER TABLE "cms"."quote_requests" DROP COLUMN "wants_reply";
    ALTER TABLE "cms"."quote_requests" DROP COLUMN "phone";
  `);
}
