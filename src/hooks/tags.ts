import type {
  CollectionBeforeDeleteHook,
  CollectionBeforeValidateHook,
} from 'payload'
import { APIError } from 'payload'

import { slugify } from '@/lib/slugify'

type TagLike = {
  name?: string
  slug?: string
}

export const setTagSlug: CollectionBeforeValidateHook = ({ data }) => {
  const mutable = { ...(data ?? {}) } as TagLike

  if (!mutable.slug && mutable.name) {
    mutable.slug = slugify(mutable.name)
  }

  return mutable
}

export const preventDeletingTagInUse: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (!id) return

  const posts = await req.payload.find({
    collection: 'posts',
    depth: 0,
    limit: 1,
    where: {
      tags: {
        in: [id],
      },
    },
  })

  if (posts.totalDocs > 0) {
    throw new APIError('This tag is still used by articles or projects, so it cannot be deleted.', 400, undefined, true)
  }
}
