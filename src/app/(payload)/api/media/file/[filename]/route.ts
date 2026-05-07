import config from '@payload-config'
import { sql } from '@payloadcms/db-postgres'
import { getPayload } from 'payload'

type MediaLookupRow = {
  filename?: string | null
  id?: string
  sizes_card_filename?: string | null
  sizes_og_filename?: string | null
}

type BlobRow = {
  byte_size?: number
  data?: Buffer | Uint8Array
  mime_type?: string
}

const rowsFromQuery = <T>(result: unknown): T[] => {
  if (Array.isArray(result)) {
    return result as T[]
  }

  if (result && typeof result === 'object' && 'rows' in result) {
    const rows = (result as { rows?: unknown }).rows
    if (Array.isArray(rows)) {
      return rows as T[]
    }
  }

  return []
}

const getExecutor = (
  payload: Awaited<ReturnType<typeof getPayload>>,
): ((query: unknown) => Promise<unknown>) | undefined => {
  const db = payload.db as {
    drizzle?: { execute?: (query: unknown) => Promise<unknown> }
    execute?: (query: unknown) => Promise<unknown>
  }

  if (db.drizzle?.execute) {
    return db.drizzle.execute.bind(db.drizzle)
  }

  if (db.execute) {
    return db.execute.bind(db)
  }

  return undefined
}

const readBlob = async (
  execute: (query: unknown) => Promise<unknown>,
  mediaID: string,
  variant: string,
): Promise<BlobRow | null> => {
  const result = await execute(
    sql`SELECT data, mime_type, byte_size FROM cms.media_blobs WHERE media_id = ${mediaID} AND variant = ${variant} LIMIT 1`,
  )

  const [row] = rowsFromQuery<BlobRow>(result)
  return row ?? null
}

const variantFromFilename = (row: MediaLookupRow, filename: string): string => {
  if (row.filename === filename) return 'original'
  if (row.sizes_card_filename === filename) return 'card'
  if (row.sizes_og_filename === filename) return 'og'
  return 'original'
}

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
): Promise<Response> => {
  const { filename: rawFilename } = await params
  const filename = decodeURIComponent(rawFilename)
  const payload = await getPayload({ config })
  const execute = getExecutor(payload)

  if (!execute) {
    return Response.json({ message: 'Database executor unavailable' }, { status: 500 })
  }

  const mediaResult = await execute(
    sql`SELECT id, filename, sizes_card_filename, sizes_og_filename FROM cms.media WHERE filename = ${filename} OR sizes_card_filename = ${filename} OR sizes_og_filename = ${filename} LIMIT 1`,
  )

  const [mediaRow] = rowsFromQuery<MediaLookupRow>(mediaResult)
  if (!mediaRow?.id) {
    return Response.json({ message: 'Media not found' }, { status: 404 })
  }

  try {
    await payload.findByID({
      collection: 'media',
      id: mediaRow.id,
      depth: 0,
      overrideAccess: false,
    })
  } catch {
    return Response.json({ message: 'Media not accessible' }, { status: 404 })
  }

  const guessedVariant = variantFromFilename(mediaRow, filename)
  let blob = await readBlob(execute, mediaRow.id, guessedVariant)
  if (!blob && guessedVariant !== 'original') {
    blob = await readBlob(execute, mediaRow.id, 'original')
  }

  if (!blob?.data || !blob?.mime_type) {
    return Response.json({ message: 'Binary media not found' }, { status: 404 })
  }

  const sourceBytes = blob.data instanceof Uint8Array ? blob.data : new Uint8Array(blob.data)
  const bytes = Uint8Array.from(sourceBytes)

  return new Response(bytes, {
    headers: {
      'Cache-Control': 'public, max-age=60',
      'Content-Length': String(blob.byte_size ?? bytes.byteLength),
      'Content-Type': blob.mime_type,
    },
    status: 200,
  })
}
