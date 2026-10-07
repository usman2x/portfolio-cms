export type PostKind = 'article' | 'project'

export const postKinds: Array<{ kind: PostKind; label: string; singular: string }> = [
  { kind: 'article', label: 'Articles', singular: 'article' },
  { kind: 'project', label: 'Projects', singular: 'project' },
]

export const postKindListPath = (adminRoute: string, kind: PostKind) =>
  `${adminRoute}/collections/posts?where[kind][equals]=${kind}`

export const postKindCreatePath = (adminRoute: string, kind: PostKind) =>
  `${adminRoute}/collections/posts/create?kind=${kind}`

// Reads the kind filter the Articles/Projects links put in the list URL.
export const kindFromSearchParams = (searchParams: URLSearchParams): PostKind | null => {
  const value = searchParams.get('where[kind][equals]')
  return value === 'article' || value === 'project' ? value : null
}
