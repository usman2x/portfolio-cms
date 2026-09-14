import type { Endpoint } from 'payload'

import { requestUiDeploy } from '@/hooks/uiDeploy'

export const rebuildUIEndpoint: Endpoint = {
  path: '/rebuild-ui',
  method: 'post',
  handler: async (req) => {
    const user = req.user as { isActive?: boolean; role?: string } | null

    if (!user || user.role !== 'admin' || user.isActive === false) {
      return Response.json({ message: 'Administrator access is required.' }, { status: 403 })
    }

    const result = await requestUiDeploy('manual.rebuild', 'manual')
    if (!result.ok) {
      return Response.json({ message: result.message }, { status: 503 })
    }

    return Response.json(
      { message: 'UI rebuild requested. Content will appear after the build completes.' },
      { status: 202 },
    )
  },
}
