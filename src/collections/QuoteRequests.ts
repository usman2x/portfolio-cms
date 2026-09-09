import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'

export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'company', type: 'text' },
    { name: 'helpType', type: 'text', required: true },
    { name: 'workType', type: 'text', required: true },
    { name: 'timeline', type: 'text', required: true },
    { name: 'budget', type: 'text', required: true },
    { name: 'context', type: 'textarea', required: true },
    {
      name: 'preferredContact',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
        { label: 'Spam', value: 'spam' },
      ],
    },
    { name: 'sourceUrl', type: 'text' },
    { name: 'userAgent', type: 'text', admin: { readOnly: true } },
  ],
}
