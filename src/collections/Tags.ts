import type { CollectionConfig } from 'payload'

import { isAdmin, publicRead } from '@/access/isAdmin'
import { preventDeletingTagInUse, setTagSlug } from '@/hooks/tags'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
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
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
