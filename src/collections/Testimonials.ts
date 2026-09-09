import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { triggerCollectionUiDeploy } from '@/hooks/uiDeploy'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'relationship', 'featured', 'sortOrder', 'status'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: ({ req }) => {
      if (isAdmin({ req })) return true
      return { status: { equals: 'published' } }
    },
    update: isAdmin,
  },
  hooks: { afterChange: [triggerCollectionUiDeploy] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    { name: 'company', type: 'text' },
    {
      name: 'relationship',
      type: 'select',
      required: true,
      options: [
        { label: 'Managed Muhammad', value: 'manager' },
        { label: 'Worked on the same team', value: 'colleague' },
        { label: 'Client', value: 'client' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: { description: 'Use the source wording exactly. Short excerpts work best on the site.' },
    },
    { name: 'recommendationDate', type: 'date' },
    { name: 'sourceLabel', type: 'text', defaultValue: 'LinkedIn recommendation' },
    {
      name: 'sourceUrl',
      type: 'text',
      validate: (value: string | string[] | null | undefined) => {
        const normalized = Array.isArray(value) ? value[0] : value
        if (!normalized) return true
        try {
          const parsed = new URL(normalized)
          return parsed.protocol === 'https:' ? true : 'Source URL must use HTTPS.'
        } catch {
          return 'Source URL must be valid.'
        }
      },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'sortOrder', type: 'number', defaultValue: 100, min: 0, index: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}
