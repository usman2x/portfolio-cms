'use client'

import { Link, NavGroup, useConfig } from '@payloadcms/ui'
import { usePathname, useSearchParams } from 'next/navigation'

import { kindFromSearchParams, postKindListPath, postKinds } from '@/lib/postKinds'

// Articles and projects share the posts collection; this replaces its single nav link
// (hidden in custom.scss) with one filtered link per kind.
export default function ContentNav() {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeKind = pathname === `${adminRoute}/collections/posts` ? kindFromSearchParams(searchParams) : null

  return (
    <NavGroup label="Content">
      {postKinds.map(({ kind, label }) => (
        <Link className="nav__link" href={postKindListPath(adminRoute, kind)} id={`nav-posts-${kind}`} key={kind} prefetch={false}>
          {activeKind === kind && <div className="nav__link-indicator" />}
          <span className="nav__link-label">{label}</span>
        </Link>
      ))}
    </NavGroup>
  )
}
