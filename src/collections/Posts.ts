import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrPublished } from '@/access/isAdmin'
import {
  enforcePublishRequirements,
  markPublishedMediaAsPublic,
  setPostDefaults,
  triggerPublishedPostUiDeploy,
} from '@/hooks/posts'

type PostSiblingData = { kind?: string; publicationType?: string }

const isProject = (_: unknown, siblingData: PostSiblingData) => siblingData?.kind === 'project'
const isExternalArticle = (_: unknown, siblingData: PostSiblingData) =>
  siblingData?.kind !== 'project' && siblingData?.publicationType === 'external'

// One table holds articles and project case studies; `kind` splits them into the
// "Articles" and "Projects" admin menus (see components/ContentNav).
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Article or project',
    plural: 'Articles & projects',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'publicationType', 'status', 'publishedAt'],
    components: {
      beforeListTable: ['/components/PostKindTabs'],
    },
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
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'article',
      options: [
        { label: 'Article', value: 'article' },
        { label: 'Project', value: 'project' },
      ],
      admin: {
        position: 'sidebar',
        components: {
          Field: '/components/PostKindField',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Set automatically on first publish.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Generated from the title when left empty. Locked after publishing.',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Shown on cards and lists, and used as the SEO description unless one is set.',
              },
            },
            {
              name: 'publicationType',
              type: 'select',
              required: true,
              defaultValue: 'native',
              options: [
                { label: 'Written here', value: 'native' },
                { label: 'Published elsewhere (Medium, LinkedIn…)', value: 'external' },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.kind !== 'project',
                description: 'External articles appear in article lists but open on the original platform and do not create a local detail page.',
              },
            },
            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                condition: isExternalArticle,
                description: 'The original article URL.',
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
              name: 'externalPlatform',
              type: 'select',
              options: [
                { label: 'Medium', value: 'medium' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Other', value: 'other' },
              ],
              admin: {
                condition: isExternalArticle,
                description: 'Sets the "Read on …" link. Detected from the URL when left empty.',
              },
            },
            {
              // Superseded by externalPlatform; kept so stored values survive.
              name: 'externalCtaLabel',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor(),
              admin: {
                condition: (_, siblingData) => siblingData?.publicationType !== 'external' || siblingData?.kind === 'project',
              },
            },
            {
              name: 'coverImage',
              type: 'relationship',
              relationTo: 'media',
              admin: {
                description: 'Projects fall back to the first gallery image.',
              },
            },
            {
              name: 'projectRole',
              type: 'text',
              admin: {
                condition: isProject,
                description: 'Your role, shown on project previews and the case study.',
              },
            },
            {
              name: 'projectOutcome',
              type: 'text',
              maxLength: 120,
              admin: {
                condition: isProject,
                description: 'One-line result for homepage project cards, e.g. "Test coverage raised from 10% to 80%".',
              },
            },
            {
              name: 'projectGallery',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              admin: {
                condition: isProject,
                description: 'Ordered project gallery.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          description: 'All optional. Empty fields fall back to the title, excerpt and cover image.',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              admin: {
                description: 'Defaults to the title.',
              },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              admin: {
                description: 'Defaults to the excerpt.',
              },
            },
            {
              name: 'ogImage',
              type: 'relationship',
              relationTo: 'media',
              admin: {
                description: 'Social share image. Defaults to the cover image.',
              },
            },
            {
              name: 'canonicalUrl',
              type: 'text',
              admin: {
                description: 'Only when this content first appeared on another site.',
              },
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
              label: 'Hide from search engines',
            },
          ],
        },
      ],
    },
    {
      // The UI estimates reading time from the content; kept for stored overrides.
      name: 'readingTimeMinutes',
      type: 'number',
      min: 1,
      admin: {
        hidden: true,
      },
    },
    {
      // Not used by the site (homepage projects come from the Home Page global).
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
      },
    },
  ],
}
