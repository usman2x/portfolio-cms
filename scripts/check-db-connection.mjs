import { Client } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL
const DB_SCHEMA = process.env.DB_SCHEMA || 'cms'

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to .env and retry.')
  process.exit(1)
}

const client = new Client({
  connectionString: DATABASE_URL,
})

try {
  await client.connect()

  const pingResult = await client.query('select current_database() as db, now() as server_time')
  const schemaResult = await client.query(
    'select schema_name from information_schema.schemata where schema_name = $1 limit 1',
    [DB_SCHEMA],
  )

  const dbName = pingResult.rows[0]?.db
  const serverTime = pingResult.rows[0]?.server_time
  const hasSchema = schemaResult.rows.length > 0

  console.log('Database connection: OK')
  console.log(`Database: ${dbName}`)
  console.log(`Schema (${DB_SCHEMA}): ${hasSchema ? 'found' : 'not found'}`)
  console.log(`Server time: ${serverTime}`)

  if (!hasSchema) {
    console.error(
      `Schema "${DB_SCHEMA}" does not exist yet. Run migrations with "npm run migrate".`,
    )
    process.exit(2)
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : undefined
  console.error('Database connection: FAILED')
  if (code) {
    console.error(`Code: ${code}`)
  }
  console.error(message || 'No error message was returned by the database client.')
  process.exit(1)
} finally {
  await client.end().catch(() => undefined)
}
