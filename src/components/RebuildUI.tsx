'use client'

import { useState } from 'react'

type RequestState = 'idle' | 'loading' | 'success' | 'error'

export default function RebuildUI() {
  const [state, setState] = useState<RequestState>('idle')
  const [message, setMessage] = useState(
    'Use this after content changes when you want to rebuild the public website manually.',
  )

  const rebuild = async () => {
    setState('loading')
    setMessage('Requesting a UI rebuild…')

    try {
      const response = await fetch('/api/rebuild-ui', {
        method: 'POST',
        credentials: 'include',
        headers: { accept: 'application/json' },
      })
      const payload = (await response.json().catch(() => null)) as { message?: string } | null
      if (!response.ok) {
        throw new Error(payload?.message || `Request failed with status ${response.status}.`)
      }

      setState('success')
      setMessage(payload?.message || 'UI rebuild requested successfully.')
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'The UI rebuild could not be requested.')
    }
  }

  return (
    <section className="rebuild-ui-card" aria-labelledby="rebuild-ui-title">
      <div>
        <h2 id="rebuild-ui-title">Public website</h2>
        <p className={`rebuild-ui-message rebuild-ui-message--${state}`} aria-live="polite">
          {message}
        </p>
      </div>
      <button type="button" className="btn btn--style-primary" onClick={rebuild} disabled={state === 'loading'}>
        {state === 'loading' ? 'Requesting rebuild…' : 'Rebuild UI'}
      </button>
    </section>
  )
}
