import type { GlobalConfig } from 'payload'
import { publicGlobalAccess, publicGlobalHooks, seoFields, stringList } from './shared'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  access: publicGlobalAccess,
  hooks: publicGlobalHooks,
  fields: [
    ...seoFields(),
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'title', type: 'textarea', required: true },
    stringList('summary', 'Summary paragraphs'),
    {
      type: 'group',
      name: 'video',
      label: 'Introduction video',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'url', type: 'text' },
        { name: 'transcript', type: 'textarea' },
        { name: 'transcriptLabel', type: 'text', defaultValue: 'Read video transcript' },
      ],
    },
    { name: 'experienceTitle', type: 'text', required: true },
    {
      name: 'strengths', type: 'array', fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    { name: 'strengthsTitle', type: 'text', required: true },
  ],
}
