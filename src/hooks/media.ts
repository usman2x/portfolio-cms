import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionBeforeOperationHook,
  Where,
} from 'payload'

import {
  buildBlobsFromRequest,
  deleteMediaBlobs,
  replaceMediaBlobs,
} from '@/lib/mediaBlobs'

type ContextLike = {
  mediaBlobs?: ReturnType<typeof buildBlobsFromRequest>
}

export const attachUploadedBy: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  const mutable = { ...(data ?? {}) } as { uploadedBy?: string }

  if (operation === 'create' && req.user?.id) {
    mutable.uploadedBy = String(req.user.id)
  }

  return mutable
}

export const captureIncomingMediaBlobs: CollectionBeforeOperationHook = ({
  context,
  operation,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update') {
    return
  }

  const uploadFile = req.file as
    | {
        data?: Buffer
        mimetype?: string
        size?: number
      }
    | undefined

  const uploadSizes = req.payloadUploadSizes as Record<string, Buffer> | undefined
  const blobs = buildBlobsFromRequest(uploadFile, uploadSizes)
  const reqContext = (req as { context?: Record<string, unknown> }).context
  const mutableContext = (context ?? reqContext ?? {}) as ContextLike
  mutableContext.mediaBlobs = blobs
  ;(req as { context?: Record<string, unknown> }).context = mutableContext
}

export const persistMediaBlobs: CollectionAfterChangeHook = async ({ context, doc, req }) => {
  const blobs = (context as ContextLike).mediaBlobs ?? []
  const mediaID = String((doc as { id: string }).id)

  if (blobs.length === 0) {
    return doc
  }

  await replaceMediaBlobs(req, mediaID, blobs)
  return doc
}

export const removeMediaBlobsOnDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  if (!doc?.id) {
    return
  }

  await deleteMediaBlobs(req, String(doc.id))
}

export const preventDeletingMediaUsedByPublishedPosts: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  if (!id) return

  const where: Where = {
    and: [
      {
        status: {
          equals: 'published',
        },
      },
      {
        or: [
          {
            coverImage: {
              equals: id,
            },
          },
          {
            ogImage: {
              equals: id,
            },
          },
        ],
      },
    ],
  }

  const posts = await req.payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1,
    where,
  })

  if (posts.totalDocs > 0) {
    throw new Error('Cannot delete media referenced by a published post.')
  }
}
