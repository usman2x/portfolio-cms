'use client'

import { Link, useConfig } from '@payloadcms/ui'
import { useSearchParams } from 'next/navigation'

import { kindFromSearchParams, postKindCreatePath, postKindListPath, postKinds } from '@/lib/postKinds'

export default function PostKindTabs() {
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const activeKind = kindFromSearchParams(useSearchParams())
  const active = postKinds.find((item) => item.kind === activeKind)

  return (
    <div className="post-kind-tabs">
      <nav aria-label="Content type" className="post-kind-tabs__list">
        {postKinds.map(({ kind, label }) => (
          <Link
            aria-current={kind === activeKind ? 'page' : undefined}
            className={`post-kind-tabs__tab${kind === activeKind ? ' post-kind-tabs__tab--active' : ''}`}
            href={postKindListPath(adminRoute, kind)}
            key={kind}
            prefetch={false}
          >
            {label}
          </Link>
        ))}
      </nav>
      {active && (
        <Link className="btn btn--style-primary btn--size-small" href={postKindCreatePath(adminRoute, active.kind)} prefetch={false}>
          New {active.singular}
        </Link>
      )}
    </div>
  )
}
