import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { triggerCollectionUiDeploy } from '@/hooks/uiDeploy'

export const WorkExperience: CollectionConfig = {
  slug: 'work-experience',
  admin: { useAsTitle: 'company', defaultColumns: ['company', 'role', 'period', 'sortOrder', 'status'] },
  access: {
    create: isAdmin, delete: isAdmin, update: isAdmin,
    read: ({ req }) => isAdmin({ req }) ? true : { status: { equals: 'published' } },
  },
  hooks: { afterChange: [triggerCollectionUiDeploy] },
  fields: [
    { name: 'company', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'period', type: 'text', required: true },
    { name: 'location', type: 'text' },
    { name: 'website', type: 'text' },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'highlights', type: 'array', fields: [{ name: 'text', type: 'textarea', required: true }] },
    { name: 'sortOrder', type: 'number', required: true, defaultValue: 100, index: true },
    { name: 'status', type: 'select', required: true, defaultValue: 'draft', index: true, options: [
      { label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' },
    ] },
  ],
}
