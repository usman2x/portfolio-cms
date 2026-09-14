import type { GlobalConfig } from 'payload'
import { publicGlobalAccess, publicGlobalHooks } from './shared'

export const ArchiveSettings: GlobalConfig = {
  slug: 'archive-settings',
  label: 'Archive Settings',
  access: publicGlobalAccess,
  hooks: publicGlobalHooks,
  fields: [
    { name: 'writingsTitle', type: 'text', required: true },
    { name: 'writingsDescription', type: 'textarea', required: true },
    { name: 'writingsSeoDescription', type: 'textarea', required: true },
    { name: 'filterTitle', type: 'text', required: true },
    { name: 'filterDescription', type: 'textarea', required: true },
    { name: 'postsPerPage', type: 'number', min: 1, max: 50, defaultValue: 6 },
    { name: 'writingCtaLabel', type: 'text', required: true },
    { name: 'readArticleLabel', type: 'text', required: true },
    { name: 'projectsTitle', type: 'text', required: true },
    { name: 'projectsDescription', type: 'textarea', required: true },
    { name: 'projectsSeoDescription', type: 'textarea', required: true },
  ],
}
