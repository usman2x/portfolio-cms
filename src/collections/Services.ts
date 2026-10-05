import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { triggerCollectionUiDeploy } from '@/hooks/uiDeploy'

// Ways a client can engage (project delivery, consultancy, architecture review, technical
// co-founder, ...). Published rows with showOnHome appear in the homepage "Ways to work
// together" section in sortOrder; each card links to the contact wizard.
export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'contactIntent', 'showOnHome', 'sortOrder', 'status'],
    description: 'Engagement types shown on the homepage. Add one row per way to work together.',
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
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 60,
      admin: { description: 'Short name, e.g. "Consultancy" or "Technical co-founder".' },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: { description: 'One or two sentences on the card: who it is for and what they get.' },
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Highlights',
      maxRows: 4,
      admin: { description: 'Optional short points, e.g. "Architecture review", "Hiring plan". Up to four.' },
      fields: [{ name: 'text', type: 'text', required: true, maxLength: 80 }],
    },
    {
      name: 'contactIntent',
      type: 'text',
      required: true,
      defaultValue: 'Project or services',
      admin: {
        description:
          'Contact wizard intent this card preselects. Must match a Contact page "Help types" value, e.g. "Project or services" or "Consultancy".',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      required: true,
      defaultValue: 'Start a conversation',
      maxLength: 40,
      admin: { description: 'Link text on the card, e.g. "Start a project enquiry".' },
    },
    { name: 'showOnHome', type: 'checkbox', defaultValue: true, index: true },
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
