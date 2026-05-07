import type { Access, PayloadRequest } from 'payload'

type MinimalReq = {
  req: PayloadRequest
}

export const isAdmin = ({ req }: MinimalReq): boolean => {
  const user = req.user as { role?: string; isActive?: boolean } | undefined
  return Boolean(user && user.role === 'admin' && user.isActive !== false)
}

export const isAdminOrBootstrap: Access = async ({ req }) => {
  if (isAdmin({ req })) {
    return true
  }

  const existingAdmins = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    where: {
      role: {
        equals: 'admin',
      },
    },
  })

  return existingAdmins.totalDocs === 0
}

export const isAdminOrPublished: Access = ({ req }) => {
  if (isAdmin({ req })) {
    return true
  }

  return {
    status: {
      equals: 'published',
    },
  }
}

export const publicRead: Access = () => true
