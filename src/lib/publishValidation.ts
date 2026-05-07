type PartialPost = {
  content?: unknown
  excerpt?: string
  publishedAt?: string | null
  seoDescription?: string
  seoTitle?: string
  slug?: string
  status?: 'draft' | 'published'
  title?: string
}

const isBlank = (value: unknown): boolean =>
  typeof value !== 'string' || value.trim().length === 0

export const getNextPostValue = <K extends keyof PartialPost>(
  data: PartialPost,
  originalDoc: PartialPost | null | undefined,
  key: K,
): PartialPost[K] => {
  if (key in data) {
    return data[key]
  }

  return originalDoc?.[key]
}

export const assertPublishRequirements = (
  data: PartialPost,
  originalDoc?: PartialPost | null,
): void => {
  const nextStatus = getNextPostValue(data, originalDoc, 'status')
  if (nextStatus !== 'published') {
    return
  }

  const missing: string[] = []
  const title = getNextPostValue(data, originalDoc, 'title')
  const slug = getNextPostValue(data, originalDoc, 'slug')
  const excerpt = getNextPostValue(data, originalDoc, 'excerpt')
  const content = getNextPostValue(data, originalDoc, 'content')
  const seoTitle = getNextPostValue(data, originalDoc, 'seoTitle')
  const seoDescription = getNextPostValue(data, originalDoc, 'seoDescription')
  const publishedAt = getNextPostValue(data, originalDoc, 'publishedAt')

  if (isBlank(title)) missing.push('title')
  if (isBlank(slug)) missing.push('slug')
  if (isBlank(excerpt)) missing.push('excerpt')
  if (!content) missing.push('content')
  if (isBlank(seoTitle)) missing.push('seoTitle')
  if (isBlank(seoDescription)) missing.push('seoDescription')
  if (!publishedAt) missing.push('publishedAt')

  if (missing.length > 0) {
    throw new Error(`Cannot publish post. Missing required fields: ${missing.join(', ')}`)
  }
}
