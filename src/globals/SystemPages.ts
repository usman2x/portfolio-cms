import type { GlobalConfig } from 'payload'
import { publicGlobalAccess, publicGlobalHooks } from './shared'

export const SystemPages: GlobalConfig = {
  slug: 'system-pages',
  label: 'System Pages',
  access: publicGlobalAccess,
  hooks: publicGlobalHooks,
  fields: [
    { name: 'notFoundTitle', type: 'text', required: true },
    { name: 'notFoundMessage', type: 'textarea', required: true },
    { name: 'thankYouTitle', type: 'text', required: true },
    { name: 'thankYouMessage', type: 'textarea', required: true },
    { name: 'homeButtonLabel', type: 'text', required: true },
  ],
}
