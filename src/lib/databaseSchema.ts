import { sql } from '@payloadcms/db-postgres'

export const databaseTable = (table: string): ReturnType<typeof sql.raw> => {
  const schema = process.env.DB_SCHEMA || 'cms'
  const identifier = /^[A-Za-z_][A-Za-z0-9_]*$/
  if (!identifier.test(schema) || !identifier.test(table)) {
    throw new Error('DB_SCHEMA contains an invalid PostgreSQL identifier.')
  }

  return sql.raw(`"${schema}"."${table}"`)
}
