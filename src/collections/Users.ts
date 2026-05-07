import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminOrBootstrap } from '@/access/isAdmin'
import {
  enforceActiveAdminLogin,
  normalizeAdminRole,
  preventDeletingLastAdmin,
} from '@/hooks/users'
import { preventDeletingAuthorInUse } from '@/hooks/posts'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  access: {
    admin: isAdmin,
    create: isAdminOrBootstrap,
    delete: isAdmin,
    read: isAdmin,
    unlock: isAdmin,
    update: isAdmin,
  },
  hooks: {
    beforeChange: [normalizeAdminRole],
    beforeDelete: [preventDeletingLastAdmin, preventDeletingAuthorInUse],
    beforeLogin: [enforceActiveAdminLogin],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
  ],
}
