import type { H3Event } from 'h3'

/** Returns the authenticated user's id, or throws 401. */
export async function requireUserId(event: H3Event): Promise<number> {
  const { user } = await requireUserSession(event)
  return (user as { id: number }).id
}
