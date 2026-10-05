import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Renames user-facing "Writings" copy to "Articles". Each value is only replaced when it
// still matches the previous seeded default, so editor customisations are preserved.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cms"."home_page" ADD COLUMN "writings_description" varchar;

   UPDATE "cms"."home_page"
   SET "writings_description" = COALESCE("writings_description", 'Practical notes on building reliable software, data platforms, and useful AI systems.');
   UPDATE "cms"."home_page" SET "writings_title" = 'Articles' WHERE "writings_title" IN ('Latest writings', 'Writings');
   UPDATE "cms"."home_page" SET "writings_archive_label" = 'All articles' WHERE "writings_archive_label" = 'All writings';
   UPDATE "cms"."home_page"
   SET "post_hero_line" = 'Latest articles, selected work, and practical ways to start a conversation are below.'
   WHERE "post_hero_line" = 'Latest writing, selected work, and practical ways to start a conversation are below.';
   UPDATE "cms"."archive_settings" SET "writings_title" = 'Articles' WHERE "writings_title" = 'Writings';
   UPDATE "cms"."site_settings_navigation" SET "label" = 'Articles' WHERE "label" = 'Writings';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "cms"."site_settings_navigation" SET "label" = 'Writings' WHERE "label" = 'Articles';
   UPDATE "cms"."archive_settings" SET "writings_title" = 'Writings' WHERE "writings_title" = 'Articles';
   UPDATE "cms"."home_page"
   SET "post_hero_line" = 'Latest writing, selected work, and practical ways to start a conversation are below.'
   WHERE "post_hero_line" = 'Latest articles, selected work, and practical ways to start a conversation are below.';
   UPDATE "cms"."home_page" SET "writings_archive_label" = 'All writings' WHERE "writings_archive_label" = 'All articles';
   UPDATE "cms"."home_page" SET "writings_title" = 'Latest writings' WHERE "writings_title" = 'Articles';

   ALTER TABLE "cms"."home_page" DROP COLUMN "writings_description";`)
}
