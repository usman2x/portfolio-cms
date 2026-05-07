import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionBeforeValidateHook,
} from 'payload'

import { slugify } from '@/lib/slugify'
import { assertPublishRequirements, getNextPostValue } from '@/lib/publishValidation'

type PostLike = {
  author?: string
  coverImage?: string | { id?: string }
  id?: string
  ogImage?: string | { id?: string }
  publishedAt?: string | null
  slug?: string
  status?: 'draft' | 'published'
  title?: string
}

const relationToID = (value: string | { id?: string } | undefined): string | undefined => {
  if (!value) return undefined
  if (typeof value === 'string') return value
  return value.id
}

export const setPostDefaults: CollectionBeforeValidateHook = async ({
  data,
  operation,
  req,
}) => {
  const mutable = { ...(data ?? {}) } as PostLike

  if (operation === 'create' && !mutable.author && req.user?.id) {
    mutable.author = String(req.user.id)
  }

  if (!mutable.slug && mutable.title) {
    mutable.slug = slugify(mutable.title)
  }

  return mutable
}

export const enforcePublishRequirements: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
}) => {
  const mutable = { ...(data ?? {}) } as PostLike
  const original = (originalDoc ?? null) as PostLike | null

  const nextStatus = getNextPostValue(mutable, original, 'status')
  const prevStatus = original?.status

  if (nextStatus === 'published' && prevStatus !== 'published' && !mutable.publishedAt) {
    mutable.publishedAt = new Date().toISOString()
  }

  if (prevStatus === 'published' && 'slug' in mutable && mutable.slug !== original?.slug) {
    throw new Error('Slug cannot be changed after a post is published.')
  }

  assertPublishRequirements(mutable, original)

  return mutable
}

export const preventDeletingAuthorInUse: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (!id) return

  const posts = await req.payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1,
    where: {
      author: {
        equals: id,
      },
    },
  })

  if (posts.totalDocs > 0) {
    throw new Error('Cannot delete user while posts still reference this author.')
  }
}

export const markPublishedMediaAsPublic: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const current = doc as PostLike
  const previous = (previousDoc ?? null) as PostLike | null

  if (current.status !== 'published') {
    return doc
  }

  const mediaIDs = [relationToID(current.coverImage), relationToID(current.ogImage)].filter(
    Boolean,
  ) as string[]

  const previousMediaIDs = new Set(
    [relationToID(previous?.coverImage), relationToID(previous?.ogImage)].filter(
      Boolean,
    ) as string[],
  )

  const changed = mediaIDs.filter((id) => !previousMediaIDs.has(id))

  for (const mediaID of changed) {
    await req.payload.update({
      id: mediaID,
      collection: 'media',
      data: {
        isPublic: true,
      },
      overrideAccess: true,
    })
  }

  return doc
}
