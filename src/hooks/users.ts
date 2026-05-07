import type { CollectionBeforeChangeHook, CollectionBeforeDeleteHook, CollectionBeforeLoginHook } from 'payload'

export const enforceActiveAdminLogin: CollectionBeforeLoginHook = ({ user }) => {
  const typedUser = user as { isActive?: boolean }

  if (typedUser.isActive === false) {
    throw new Error('This admin account has been deactivated.')
  }

  return user
}

export const normalizeAdminRole: CollectionBeforeChangeHook = ({ data }) => {
  const mutable = { ...(data ?? {}) } as { role?: string }
  mutable.role = 'admin'
  return mutable
}

export const preventDeletingLastAdmin: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (!id) return

  const admins = await req.payload.find({
    collection: 'users',
    depth: 0,
    limit: 2,
    where: {
      role: {
        equals: 'admin',
      },
    },
  })

  if (admins.totalDocs <= 1) {
    throw new Error('Cannot delete the last admin user.')
  }
}
