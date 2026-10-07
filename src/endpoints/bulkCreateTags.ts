import type { Endpoint } from 'payload'

import { slugify } from '@/lib/slugify'

const MAX_TAGS = 100

// POST /api/tags/bulk { names: "AI, Cloud\nBackend" } creates the tags that do not exist yet.
export const bulkCreateTagsEndpoint: Endpoint = {
  path: '/bulk',
  method: 'post',
  handler: async (req) => {
    const user = req.user as { isActive?: boolean; role?: string } | null
    if (!user || user.role !== 'admin' || user.isActive === false) {
      return Response.json({ message: 'Administrator access is required.' }, { status: 403 })
    }

    const body = (await req.json?.().catch(() => null)) as { names?: unknown } | null
    const raw = typeof body?.names === 'string' ? body.names : ''
    const bySlug = new Map<string, string>()
    for (const name of raw.split(/[\n,]/).map((value) => value.trim()).filter(Boolean)) {
      const slug = slugify(name)
      if (slug && !bySlug.has(slug)) bySlug.set(slug, name)
    }

    if (bySlug.size === 0) {
      return Response.json({ message: 'Enter at least one tag name.' }, { status: 400 })
    }
    if (bySlug.size > MAX_TAGS) {
      return Response.json({ message: `Add at most ${MAX_TAGS} tags at a time.` }, { status: 400 })
    }

    const existing = await req.payload.find({
      collection: 'tags',
      depth: 0,
      limit: bySlug.size,
      pagination: false,
      req,
      where: { slug: { in: [...bySlug.keys()] } },
    })
    const existingSlugs = new Set(existing.docs.map((tag) => tag.slug))

    const created: string[] = []
    for (const [slug, name] of bySlug) {
      if (existingSlugs.has(slug)) continue
      await req.payload.create({ collection: 'tags', data: { name, slug }, overrideAccess: false, req })
      created.push(name)
    }

    const skipped = [...bySlug.entries()].filter(([slug]) => existingSlugs.has(slug)).map(([, name]) => name)
    return Response.json({ created, skipped }, { status: created.length > 0 ? 201 : 200 })
  },
}
