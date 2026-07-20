import { eq } from 'drizzle-orm'
import { useDb, tables } from '../../../utils/db'
import { requireUserId } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()

  const [ticket] = await db.select().from(tables.tickets).where(eq(tables.tickets.id, id)).limit(1)
  if (!ticket) throw createError({ statusCode: 404, statusMessage: 'Billet introuvable.' })
  if (ticket.status === 'sold') throw createError({ statusCode: 409, statusMessage: 'Ce billet est déjà vendu.' })
  if (ticket.sellerId === userId) throw createError({ statusCode: 400, statusMessage: 'Vous ne pouvez pas acheter votre propre billet.' })

  const [updated] = await db
    .update(tables.tickets)
    .set({ status: 'sold', buyerId: userId })
    .where(eq(tables.tickets.id, id))
    .returning()

  return updated
})
