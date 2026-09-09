import type { GlobalConfig } from 'payload'
import { publicGlobalAccess, publicGlobalHooks } from './shared'

export const ProjectTemplate: GlobalConfig = {
  slug: 'project-template',
  label: 'Project Template',
  access: publicGlobalAccess,
  hooks: publicGlobalHooks,
  fields: [
    { name: 'backLabel', type: 'text', required: true },
    { name: 'stackLabel', type: 'text', required: true },
    { name: 'linkLabel', type: 'text', required: true },
    { name: 'defaultLinkLabel', type: 'text', required: true },
    { name: 'linkDescription', type: 'textarea', required: true },
    { name: 'storyTitle', type: 'text', required: true },
    { name: 'previousLabel', type: 'text', required: true },
    { name: 'nextLabel', type: 'text', required: true },
  ],
}
