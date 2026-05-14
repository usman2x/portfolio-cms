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

const getUiDeployWebhookUrl = (): string => {
  const value =
    process.env.UI_DEPLOY_WEBHOOK_URL ||
    process.env.UI_DEPLOY_HOOK_URL ||
    process.env.PORTFOLIO_UI_DEPLOY_HOOK_URL ||
    ''

  return value.trim()
}

const isPublishedPost = (post: PostLike | null | undefined): boolean => post?.status === 'published'

const shouldTriggerUiDeploy = (
  current: PostLike | null | undefined,
  previous: PostLike | null | undefined,
): boolean => isPublishedPost(current) || isPublishedPost(previous)

const triggerUiDeployWebhook = async ({
  current,
  operation,
  previous,
}: {
  current: PostLike | null | undefined
  operation: 'create' | 'update'
  previous: PostLike | null | undefined
}): Promise<void> => {
  const webhookUrl = getUiDeployWebhookUrl()
  if (!webhookUrl || !shouldTriggerUiDeploy(current, previous)) {
    return
  }

  const payload = {
    event: 'post.changed',
    operation,
    current: {
      id: current?.id ?? null,
      slug: current?.slug ?? null,
      status: current?.status ?? null,
      title: current?.title ?? null,
    },
    previous: {
      id: previous?.id ?? null,
      slug: previous?.slug ?? null,
      status: previous?.status ?? null,
      title: previous?.title ?? null,
    },
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-cms-event': 'post.changed',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(
        `UI deploy webhook responded with ${response.status} ${response.statusText}`,
      )
    }

    console.info(
      `[cms] Triggered UI deploy webhook for ${operation} on post "${current?.slug ?? current?.id ?? 'unknown'}".`,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(
      `[cms] Failed to trigger UI deploy webhook for post "${current?.slug ?? current?.id ?? 'unknown'}": ${message}`,
    )
  }
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

export const triggerPublishedPostUiDeploy: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
}) => {
  await triggerUiDeployWebhook({
    current: doc as PostLike,
    operation,
    previous: (previousDoc ?? null) as PostLike | null,
  })

  return doc
}
