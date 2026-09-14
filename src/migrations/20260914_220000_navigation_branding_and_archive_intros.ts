import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "cms"."site_settings" ADD COLUMN "logo_id" uuid;
    ALTER TABLE "cms"."site_settings" ADD COLUMN "logo_path" varchar DEFAULT '/images/usman.png';
    ALTER TABLE "cms"."site_settings" ADD COLUMN "logo_alt" varchar DEFAULT 'Muhammad Usman';
    ALTER TABLE "cms"."archive_settings" ADD COLUMN "writings_description" varchar DEFAULT 'Practical notes on building reliable software, data platforms, and useful AI systems.';
    ALTER TABLE "cms"."archive_settings" ADD COLUMN "projects_description" varchar DEFAULT 'A focused selection of systems and products shaped around real delivery constraints and measurable outcomes.';

    UPDATE "cms"."site_settings"
    SET "logo_path" = COALESCE("logo_path", '/images/usman.png'),
        "logo_alt" = COALESCE("logo_alt", 'Muhammad Usman');
    UPDATE "cms"."archive_settings"
    SET "writings_description" = COALESCE("writings_description", 'Practical notes on building reliable software, data platforms, and useful AI systems.'),
        "projects_description" = COALESCE("projects_description", 'A focused selection of systems and products shaped around real delivery constraints and measurable outcomes.');

    ALTER TABLE "cms"."site_settings" ALTER COLUMN "logo_alt" SET NOT NULL;
    ALTER TABLE "cms"."archive_settings" ALTER COLUMN "writings_description" SET NOT NULL;
    ALTER TABLE "cms"."archive_settings" ALTER COLUMN "projects_description" SET NOT NULL;
    ALTER TABLE "cms"."site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "cms"."media"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "site_settings_logo_idx" ON "cms"."site_settings" USING btree ("logo_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "cms"."site_settings" DROP CONSTRAINT "site_settings_logo_id_media_id_fk";
    DROP INDEX "cms"."site_settings_logo_idx";
    ALTER TABLE "cms"."site_settings" DROP COLUMN "logo_id";
    ALTER TABLE "cms"."site_settings" DROP COLUMN "logo_path";
    ALTER TABLE "cms"."site_settings" DROP COLUMN "logo_alt";
    ALTER TABLE "cms"."archive_settings" DROP COLUMN "writings_description";
    ALTER TABLE "cms"."archive_settings" DROP COLUMN "projects_description";
  `)
}
