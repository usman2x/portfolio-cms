import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

const webhookUrl = () => (
  process.env.UI_DEPLOY_WEBHOOK_URL ||
  process.env.UI_DEPLOY_HOOK_URL ||
  process.env.PORTFOLIO_UI_DEPLOY_HOOK_URL ||
  ''
).trim()

export const notifyUiDeploy = async (event: string, operation: string) => {
  const url = webhookUrl()
  if (!url) return

  const githubDispatch = /^https:\/\/api\.github\.com\/repos\/[^/]+\/[^/]+\/dispatches\/?$/.test(url)
  const token = (process.env.UI_DEPLOY_WEBHOOK_TOKEN || '').trim()
  const payload = githubDispatch
    ? { event_type: 'cms-content-published', client_payload: { event, operation } }
    : { event, operation, occurredAt: new Date().toISOString() }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-cms-event': event,
        ...(githubDispatch ? { accept: 'application/vnd.github+json', 'user-agent': 'portfolio-cms' } : {}),
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
    console.info(`[cms] Triggered UI deploy webhook for ${event}.`)
  } catch (error) {
    console.error(`[cms] UI deploy webhook failed for ${event}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const triggerCollectionUiDeploy: CollectionAfterChangeHook = async ({ doc, operation }) => {
  await notifyUiDeploy('content.changed', operation)
  return doc
}

export const triggerGlobalUiDeploy: GlobalAfterChangeHook = async ({ doc }) => {
  await notifyUiDeploy('global.changed', 'update')
  return doc
}
