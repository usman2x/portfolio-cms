import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionBeforeDeleteHook,
  CollectionBeforeValidateHook,
} from 'payload'
import { APIError } from 'payload'

import { slugify } from '@/lib/slugify'
import { detectExternalPlatform } from '@/lib/externalPlatform'
import { assertPublishRequirements, getNextPostValue, throwFieldErrors } from '@/lib/publishValidation'
import { notifyUiDeploy } from '@/hooks/uiDeploy'

type PostLike = {
  author?: string
  content?: unknown
  coverImage?: string | { id?: string }
  externalPlatform?: 'medium' | 'linkedin' | 'other' | null
  externalUrl?: string | null
  id?: string
  kind?: 'article' | 'project'
  ogImage?: string | { id?: string }
  projectGallery?: Array<string | { id?: string }>
  publicationType?: 'native' | 'external'
  publishedAt?: string | null
  slug?: string
  status?: 'draft' | 'published'
  title?: string
}

const isPublishedPost = (post: PostLike | null | undefined): boolean => post?.status === 'published'

const shouldTriggerUiDeploy = (
  current: PostLike | null | undefined,
  previous: PostLike | null | undefined,
): boolean => isPublishedPost(current) || isPublishedPost(previous)

const relationToID = (value: string | { id?: string } | undefined): string | undefined => {
  if (!value) return undefined
  if (typeof value === 'string') return value
  return value.id
}

const relationIDs = (values: Array<string | { id?: string }> | undefined): string[] =>
  (values ?? []).map(relationToID).filter(Boolean) as string[]

export const collectUploadIDs = (value: unknown, result = new Set<string>()): Set<string> => {
  if (!value || typeof value !== 'object') return result
  const node = value as { children?: unknown[]; type?: string; value?: string | { id?: string } }
  if (node.type === 'upload') {
    const id = relationToID(node.value)
    if (id) result.add(id)
  }
  if (Array.isArray(node.children)) node.children.forEach((child) => collectUploadIDs(child, result))
  if ('root' in node) collectUploadIDs((node as { root?: unknown }).root, result)
  return result
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

  // Projects are always case studies hosted here.
  if (mutable.kind === 'project') {
    mutable.publicationType = 'native'
  }

  if (mutable.publicationType === 'external' && mutable.externalUrl && !mutable.externalPlatform) {
    mutable.externalPlatform = detectExternalPlatform(mutable.externalUrl)
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
    throwFieldErrors([{ message: 'The slug cannot change once published; it is part of the public URL.', path: 'slug' }])
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
    throw new APIError('This user is the author of articles or projects; reassign them before deleting.', 400, undefined, true)
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

  const mediaIDs = Array.from(
    collectUploadIDs(current.content, new Set(
      [relationToID(current.coverImage), relationToID(current.ogImage), ...relationIDs(current.projectGallery)].filter(Boolean) as string[],
    )),
  )

  const previousMediaIDs = new Set(
    collectUploadIDs(previous?.content, new Set(
      [relationToID(previous?.coverImage), relationToID(previous?.ogImage), ...relationIDs(previous?.projectGallery)].filter(Boolean) as string[],
    )),
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

export const triggerPublishedPostUiDeploy: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
}) => {
  const current = doc as PostLike
  const previous = (previousDoc ?? null) as PostLike | null
  if (shouldTriggerUiDeploy(current, previous)) await notifyUiDeploy('post.changed', operation)

  return doc
}
