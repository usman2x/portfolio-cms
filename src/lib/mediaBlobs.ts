import { sql } from '@payloadcms/db-postgres'
import type { PayloadRequest } from 'payload'

type UploadLike = {
  data?: Buffer
  mimetype?: string
  size?: number
}

type BlobRecord = {
  byteSize: number
  data: Buffer
  mimeType: string
  variant: string
}

const getExecutor = (req: PayloadRequest): { execute: (query: unknown) => Promise<unknown> } => {
  const db = req.payload.db as {
    drizzle?: { execute: (query: unknown) => Promise<unknown> }
    execute?: (query: unknown) => Promise<unknown>
  }

  if (db.drizzle?.execute) {
    return { execute: db.drizzle.execute.bind(db.drizzle) }
  }

  if (db.execute) {
    return { execute: db.execute.bind(db) }
  }

  throw new Error('Postgres executor not available on Payload db adapter.')
}

const insertBlob = async (
  req: PayloadRequest,
  mediaId: string,
  blob: BlobRecord,
): Promise<void> => {
  const db = getExecutor(req)

  await db.execute(
    sql`INSERT INTO cms.media_blobs (media_id, variant, mime_type, byte_size, data) VALUES (${mediaId}, ${blob.variant}, ${blob.mimeType}, ${blob.byteSize}, ${blob.data})`,
  )
}

export const replaceMediaBlobs = async (
  req: PayloadRequest,
  mediaId: string,
  blobs: BlobRecord[],
): Promise<void> => {
  const db = getExecutor(req)
  await db.execute(sql`DELETE FROM cms.media_blobs WHERE media_id = ${mediaId}`)

  for (const blob of blobs) {
    await insertBlob(req, mediaId, blob)
  }
}

export const deleteMediaBlobs = async (req: PayloadRequest, mediaId: string): Promise<void> => {
  const db = getExecutor(req)
  await db.execute(sql`DELETE FROM cms.media_blobs WHERE media_id = ${mediaId}`)
}

export const buildBlobsFromRequest = (
  file: UploadLike | undefined,
  uploadSizes: Record<string, Buffer> | undefined,
): BlobRecord[] => {
  if (!file?.data || !file?.mimetype || !file?.size) {
    return []
  }

  const blobs: BlobRecord[] = [
    {
      variant: 'original',
      mimeType: file.mimetype,
      byteSize: file.size,
      data: file.data,
    },
  ]

  for (const [variant, data] of Object.entries(uploadSizes ?? {})) {
    blobs.push({
      variant,
      mimeType: file.mimetype,
      byteSize: data.byteLength,
      data,
    })
  }

  return blobs
}
