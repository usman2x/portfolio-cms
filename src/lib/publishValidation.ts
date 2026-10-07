import { ValidationError } from 'payload'

type PartialPost = {
  content?: unknown
  externalPlatform?: 'medium' | 'linkedin' | 'other' | null
  externalUrl?: string | null
  excerpt?: string
  kind?: 'article' | 'project'
  publishedAt?: string | null
  publicationType?: 'native' | 'external'
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

// Thrown as a ValidationError so the admin highlights each field instead of the generic
// "Something went wrong" that Payload shows for plain errors in production.
export const throwFieldErrors = (errors: Array<{ message: string; path: string }>): never => {
  throw new ValidationError({ collection: 'posts', errors })
}

export const assertPublishRequirements = (
  data: PartialPost,
  originalDoc?: PartialPost | null,
): void => {
  const nextStatus = getNextPostValue(data, originalDoc, 'status')
  if (nextStatus !== 'published') {
    return
  }

  const errors: Array<{ message: string; path: string }> = []
  const require = (path: keyof PartialPost, message: string, blank: boolean) => {
    if (blank) errors.push({ message, path })
  }

  const kind = getNextPostValue(data, originalDoc, 'kind') || 'article'
  const publicationType =
    kind === 'project' ? 'native' : getNextPostValue(data, originalDoc, 'publicationType') || 'native'

  require('title', 'Add a title before publishing.', isBlank(getNextPostValue(data, originalDoc, 'title')))
  require('slug', 'Add a slug before publishing.', isBlank(getNextPostValue(data, originalDoc, 'slug')))
  require('excerpt', 'Add an excerpt before publishing.', isBlank(getNextPostValue(data, originalDoc, 'excerpt')))
  if (publicationType === 'external') {
    require(
      'externalUrl',
      'Add the original article URL before publishing.',
      isBlank(getNextPostValue(data, originalDoc, 'externalUrl')),
    )
    require(
      'externalPlatform',
      'Choose where the article is published (Medium, LinkedIn or Other).',
      isBlank(getNextPostValue(data, originalDoc, 'externalPlatform')),
    )
  } else {
    require('content', 'Add content before publishing.', !getNextPostValue(data, originalDoc, 'content'))
  }
  require('publishedAt', 'Set a publish date.', !getNextPostValue(data, originalDoc, 'publishedAt'))

  if (errors.length > 0) throwFieldErrors(errors)
}
