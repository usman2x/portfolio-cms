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
