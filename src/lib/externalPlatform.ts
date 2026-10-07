export type ExternalPlatform = 'medium' | 'linkedin' | 'other'

const matchesHost = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`)

export const detectExternalPlatform = (url: string): ExternalPlatform => {
  try {
    const host = new URL(url).hostname.toLowerCase()
    if (matchesHost(host, 'medium.com')) return 'medium'
    if (matchesHost(host, 'linkedin.com') || matchesHost(host, 'lnkd.in')) return 'linkedin'
  } catch {
    // Invalid URLs are reported by the externalUrl field validator.
  }
  return 'other'
}
