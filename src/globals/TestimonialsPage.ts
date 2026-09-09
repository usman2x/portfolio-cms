import type { GlobalConfig } from 'payload'
import { publicGlobalAccess, publicGlobalHooks, seoFields } from './shared'

export const TestimonialsPage: GlobalConfig = {
  slug: 'testimonials-page',
  label: 'Testimonials Page',
  access: publicGlobalAccess,
  hooks: publicGlobalHooks,
  fields: [
    ...seoFields(),
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'title', type: 'textarea', required: true },
    { name: 'description', type: 'textarea', required: true },
  ],
}
