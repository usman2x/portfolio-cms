'use client'

import { Button } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Result = { created?: string[]; message?: string; skipped?: string[] }

const describe = ({ created = [], skipped = [] }: Result) =>
  [
    created.length > 0 && `Created ${created.length}: ${created.join(', ')}.`,
    skipped.length > 0 && `Already existed: ${skipped.join(', ')}.`,
  ]
    .filter(Boolean)
    .join(' ')

export default function BulkTags() {
  const router = useRouter()
  const [names, setNames] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null)

  const submit = async () => {
    setBusy(true)
    setMessage(null)
    try {
      const response = await fetch('/api/tags/bulk', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ names }),
      })
      const result = ((await response.json().catch(() => null)) ?? {}) as Result
      if (!response.ok) throw new Error(result.message || `Request failed with status ${response.status}.`)
      setMessage({ error: false, text: describe(result) })
      if (result.created?.length) {
        setNames('')
        router.refresh()
      }
    } catch (error) {
      setMessage({ error: true, text: error instanceof Error ? error.message : 'Could not create tags.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="bulk-tags">
      <h3>Add several tags</h3>
      <p className="bulk-tags__message">One per line or separated by commas. Existing tags are skipped.</p>
      <textarea
        aria-label="Tag names"
        onChange={(event) => setNames(event.target.value)}
        placeholder={'AI, Cloud\nBackend'}
        value={names}
      />
      <div className="bulk-tags__actions">
        <Button buttonStyle="primary" disabled={busy || !names.trim()} onClick={submit} size="small">
          {busy ? 'Adding…' : 'Add tags'}
        </Button>
        {message && (
          <p className={`bulk-tags__message${message.error ? ' bulk-tags__message--error' : ''}`} role="status">
            {message.text}
          </p>
        )}
      </div>
    </section>
  )
}
