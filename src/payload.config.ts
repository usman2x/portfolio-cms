import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  customType,
  integer,
  pgSchema,
  text,
  timestamp,
  uuid,
} from '@payloadcms/db-postgres/drizzle/pg-core'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from '@/collections/Media'
import { Posts } from '@/collections/Posts'
import { Tags } from '@/collections/Tags'
import { Users } from '@/collections/Users'
import { migrations } from '@/migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const schemaName = process.env.DB_SCHEMA || 'cms'
const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return 'bytea'
  },
})

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'app/(payload)/admin/importMap.js'),
    },
  },
  collections: [Users, Tags, Media, Posts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  db: postgresAdapter({
    idType: 'uuid',
    migrationDir: path.resolve(dirname, 'migrations'),
    schemaName,
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    prodMigrations: migrations,
    beforeSchemaInit: [
      ({ schema }) => {
        const customSchema = pgSchema(schemaName)
        const mediaBlobs = customSchema.table('media_blobs', {
          id: uuid('id').primaryKey().defaultRandom(),
          mediaID: uuid('media_id').notNull(),
          variant: text('variant').notNull(),
          mimeType: text('mime_type').notNull(),
          byteSize: integer('byte_size').notNull(),
          data: bytea('data').notNull(),
          createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
          updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
        })

        return {
          ...schema,
          tables: {
            ...schema.tables,
            mediaBlobs,
          },
        }
      },
    ],
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
