import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrPublished } from '@/access/isAdmin'
import {
  enforcePublishRequirements,
  markPublishedMediaAsPublic,
  setPostDefaults,
  triggerPublishedPostUiDeploy,
} from '@/hooks/posts'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publicationType', 'status', 'publishedAt', 'updatedAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrPublished,
    update: isAdmin,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [markPublishedMediaAsPublic, triggerPublishedPostUiDeploy],
    beforeChange: [enforcePublishRequirements],
    beforeValidate: [setPostDefaults],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
    },
    {
      name: 'publicationType',
      type: 'select',
      required: true,
      defaultValue: 'native',
      options: [
        { label: 'Native article or case study', value: 'native' },
        { label: 'External article', value: 'external' },
      ],
      admin: {
        description: 'External articles appear in writing lists but open on the original platform and do not create a local detail page.',
      },
    },
    {
      name: 'externalPlatform',
      type: 'select',
      options: [
        { label: 'Medium', value: 'medium' },
        { label: 'LinkedIn', value: 'linkedin' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.publicationType === 'external',
      },
    },
    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.publicationType === 'external',
        description: 'The original Medium, LinkedIn, or other article URL.',
      },
      validate: (value: string | string[] | null | undefined) => {
        const normalized = Array.isArray(value) ? value[0] : value
        if (!normalized) return true
        try {
          const parsed = new URL(normalized)
          return parsed.protocol === 'https:' ? true : 'External URL must use HTTPS.'
        } catch {
          return 'External URL must be a valid URL.'
        }
      },
    },
    {
      name: 'externalCtaLabel',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.publicationType === 'external',
        description: 'Optional override, for example “Read on Medium”.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      admin: {
        condition: (_, siblingData) => siblingData?.publicationType !== 'external',
        description: 'Required for native articles and project case studies. External writing entries link to their original publication instead.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'coverImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'ogImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'seoTitle',
      type: 'text',
      validate: (
        value: string | string[] | null | undefined,
        { siblingData }: { siblingData?: { status?: string } },
      ) => {
        const normalized = Array.isArray(value) ? value[0] : value
        if (siblingData?.status === 'published' && !normalized) {
          return 'SEO title is required for published posts.'
        }

        return true
      },
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      validate: (
        value: string | string[] | null | undefined,
        { siblingData }: { siblingData?: { status?: string } },
      ) => {
        const normalized = Array.isArray(value) ? value[0] : value
        if (siblingData?.status === 'published' && !normalized) {
          return 'SEO description is required for published posts.'
        }

        return true
      },
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      validate: (value: string | string[] | null | undefined) => {
        const normalized = Array.isArray(value) ? value[0] : value
        if (!normalized) return true
        try {
          const parsed = new URL(normalized)
          if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            return true
          }
          return 'Canonical URL must be a valid URL.'
        } catch {
          return 'Canonical URL must be a valid URL.'
        }
      },
    },
    {
      name: 'noindex',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'readingTimeMinutes',
      type: 'number',
      min: 1,
      admin: {
        description: 'Optional computed value.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'projectRole',
      type: 'text',
      admin: {
        description: 'Optional role shown on project previews and case studies.',
      },
    },
    {
      name: 'projectGallery',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Full project gallery. The first image is used as the project cover when no separate cover image is selected.',
      },
    },
  ],
}
