import { eq } from 'drizzle-orm'
import { useDb, tables } from '../../../utils/db'
import { requireUserId } from '../../../utils/auth'
import { fail } from '../../../utils/validate'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()

  const [ticket] = await db.select().from(tables.tickets).where(eq(tables.tickets.id, id)).limit(1)
  if (!ticket) throw fail(404, 'Billet introuvable.')
  if (ticket.status === 'sold') throw fail(409, 'Ce billet est déjà vendu.')
  if (ticket.sellerId === userId) throw fail(400, 'Vous ne pouvez pas acheter votre propre billet.')

  const [updated] = await db
    .update(tables.tickets)
    .set({ status: 'sold', buyerId: userId })
    .where(eq(tables.tickets.id, id))
    .returning()

  return updated
})
