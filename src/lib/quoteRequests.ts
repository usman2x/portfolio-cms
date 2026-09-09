export type QuoteRequestInput = {
  budget: string
  company?: string
  context: string
  email: string
  helpType: string
  name: string
  preferredContact: string
  sourceUrl?: string
  timeline: string
  workType: string
}

export type QuoteRequestOptions = Record<
  'budget' | 'helpType' | 'preferredContact' | 'timeline' | 'workType',
  string[]
>

const clean = (value: unknown, max: number): string =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

export const parseQuoteRequest = (
  body: Record<string, unknown>,
  quoteOptions: QuoteRequestOptions,
): QuoteRequestInput => {
  const input = {
    name: clean(body.name, 120),
    email: clean(body.email, 254).toLowerCase(),
    company: clean(body.company, 160),
    helpType: clean(body.help_type, 120),
    workType: clean(body.work_type, 120),
    timeline: clean(body.timeline, 80),
    budget: clean(body.budget, 80),
    context: clean(body.context, 5000),
    preferredContact: clean(body.preferred_contact, 80),
    sourceUrl: clean(body.source_url, 500),
  }

  if (!input.name || !input.context || !/^\S+@\S+\.\S+$/.test(input.email)) {
    throw new Error('Please provide a valid name, email address, and project description.')
  }

  for (const [key, options] of Object.entries(quoteOptions)) {
    if (!options.includes(input[key as keyof QuoteRequestInput] as never)) {
      throw new Error('One or more selected options are invalid.')
    }
  }

  return input
}
