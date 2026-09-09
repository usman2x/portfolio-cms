import type { Field } from 'payload'
import { triggerGlobalUiDeploy } from '@/hooks/uiDeploy'

export const publicGlobalHooks = { afterChange: [triggerGlobalUiDeploy] }

export const publicGlobalAccess = {
  read: () => true,
  update: ({ req }: { req: { user?: unknown } }) => {
    const user = req.user as { role?: string; isActive?: boolean } | undefined
    return Boolean(user && user.role === 'admin' && user.isActive !== false)
  },
}

export const seoFields = (): Field[] => [
  { name: 'seoTitle', type: 'text', required: true },
  { name: 'seoDescription', type: 'textarea', required: true },
]

export const stringList = (name: string, label: string): Field => ({
  name,
  type: 'array',
  label,
  fields: [{ name: 'text', type: 'text', required: true }],
})
