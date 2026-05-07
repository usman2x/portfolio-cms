import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import {
  attachUploadedBy,
  captureIncomingMediaBlobs,
  persistMediaBlobs,
  preventDeletingMediaUsedByPublishedPosts,
  removeMediaBlobsOnDelete,
} from '@/hooks/media'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: ({ req }) => {
      if (isAdmin({ req })) {
        return true
      }

      return {
        isPublic: {
          equals: true,
        },
      }
    },
    update: isAdmin,
  },
  upload: {
    disableLocalStorage: true,
    imageSizes: [
      {
        name: 'card',
        width: 1200,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
      },
    ],
    mimeTypes: ['image/*'],
  },
  hooks: {
    beforeChange: [attachUploadedBy],
    beforeDelete: [preventDeletingMediaUsedByPublishedPosts],
    beforeOperation: [captureIncomingMediaBlobs],
    afterChange: [persistMediaBlobs],
    afterDelete: [removeMediaBlobsOnDelete],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'usageType',
      type: 'select',
      required: true,
      defaultValue: 'generic',
      options: [
        {
          label: 'Cover',
          value: 'cover',
        },
        {
          label: 'Inline',
          value: 'inline',
        },
        {
          label: 'Open Graph',
          value: 'og',
        },
        {
          label: 'Generic',
          value: 'generic',
        },
      ],
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
