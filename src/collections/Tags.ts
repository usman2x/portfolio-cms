import type { CollectionConfig } from 'payload'

import { isAdmin, publicRead } from '@/access/isAdmin'
import { bulkCreateTagsEndpoint } from '@/endpoints/bulkCreateTags'
import { preventDeletingTagInUse, setTagSlug } from '@/hooks/tags'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    components: {
      beforeListTable: ['/components/BulkTags'],
    },
  },
  endpoints: [bulkCreateTagsEndpoint],
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: publicRead,
    update: isAdmin,
  },
  hooks: {
    beforeDelete: [preventDeletingTagInUse],
    beforeValidate: [setTagSlug],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Generated from the name when left empty.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
