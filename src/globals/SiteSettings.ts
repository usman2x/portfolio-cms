import type { GlobalConfig } from 'payload'
import { publicGlobalAccess, publicGlobalHooks } from './shared'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: publicGlobalAccess,
  hooks: publicGlobalHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'shortLabel', type: 'text', required: true },
    { name: 'professionalTitle', type: 'text', required: true },
    { name: 'defaultSeoTitle', type: 'text', required: true },
    { name: 'defaultSeoDescription', type: 'textarea', required: true },
    { name: 'logo', type: 'relationship', relationTo: 'media' },
    { name: 'logoPath', type: 'text', defaultValue: '/images/usman.png', admin: { description: 'Fallback public path used when no logo media item is selected.' } },
    { name: 'logoAlt', type: 'text', required: true, defaultValue: 'Muhammad Usman' },
    { name: 'portrait', type: 'relationship', relationTo: 'media' },
    { name: 'portraitPath', type: 'text', admin: { description: 'Fallback path, such as /images/usman.jpg.' } },
    { name: 'portraitAlt', type: 'text', required: true },
    { name: 'resumeLink', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'meetingLink', type: 'text', required: true },
    {
      name: 'socialLinks', type: 'array', fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
    {
      name: 'navigation', type: 'array', fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'isPrimary', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'footerDescription', type: 'textarea', required: true },
    {
      name: 'bookCall', type: 'group', fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'buttonLabel', type: 'text', required: true },
      ],
    },
  ],
}
