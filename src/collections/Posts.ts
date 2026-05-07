import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrPublished } from '@/access/isAdmin'
import {
  enforcePublishRequirements,
  markPublishedMediaAsPublic,
  setPostDefaults,
} from '@/hooks/posts'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
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
    afterChange: [markPublishedMediaAsPublic],
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
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
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
  ],
}
