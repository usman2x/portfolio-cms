import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// The /blog/ topic filter panel is shown again; replace "writing" in its seeded copy.
// Only the unedited default is changed, so editor customisations are preserved.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "cms"."archive_settings"
   SET "filter_description" = 'Choose a topic to narrow the archive while keeping the articles easy to scan.'
   WHERE "filter_description" = 'Choose a topic to narrow the archive while keeping the writing easy to scan.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "cms"."archive_settings"
   SET "filter_description" = 'Choose a topic to narrow the archive while keeping the writing easy to scan.'
   WHERE "filter_description" = 'Choose a topic to narrow the archive while keeping the articles easy to scan.';`)
}
