import type { GlobalConfig } from 'payload'
import { publicGlobalAccess, publicGlobalHooks, seoFields, stringList } from './shared'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  access: publicGlobalAccess,
  hooks: publicGlobalHooks,
  fields: [
    ...seoFields(),
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'headline', type: 'textarea', required: true },
    { name: 'supportingText', type: 'textarea', required: true },
    stringList('trustChips', 'Trust chips'),
    { name: 'primaryCtaLabel', type: 'text', required: true },
    { name: 'secondaryCtaLabel', type: 'text', required: true },
    { name: 'postHeroLine', type: 'textarea', required: true },
    {
      name: 'proofTitle',
      type: 'text',
      admin: { description: 'Short label above the company list, e.g. "Trusted by teams at".' },
    },
    {
      name: 'proofCompanies',
      type: 'array',
      label: 'Proof companies',
      admin: { description: 'Company or client names shown under the homepage introduction.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'proofStats',
      type: 'array',
      label: 'Proof stats',
      maxRows: 4,
      admin: { description: 'Up to four headline numbers backed by case studies or experience.' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    { name: 'writingsTitle', type: 'text', required: true },
    { name: 'writingsArchiveLabel', type: 'text', required: true },
    { name: 'writingsLimit', type: 'number', min: 1, max: 6, defaultValue: 2 },
    { name: 'projectsTitle', type: 'text', required: true },
    { name: 'projectsArchiveLabel', type: 'text', required: true },
    { name: 'featuredProjects', type: 'relationship', relationTo: 'posts', hasMany: true },
    { name: 'testimonialsEyebrow', type: 'text', required: true },
    { name: 'testimonialsTitle', type: 'text', required: true },
    { name: 'testimonialsDescription', type: 'textarea', required: true },
    { name: 'testimonialsArchiveLabel', type: 'text' },
    { name: 'testimonialLimit', type: 'number', min: 1, max: 2, defaultValue: 1 },
  ],
}
