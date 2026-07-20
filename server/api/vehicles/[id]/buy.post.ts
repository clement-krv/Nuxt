import { eq } from 'drizzle-orm'
import { useDb, tables } from '../../../utils/db'
import { requireUserId } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()

  const [vehicle] = await db.select().from(tables.vehicles).where(eq(tables.vehicles.id, id)).limit(1)
  if (!vehicle) throw createError({ statusCode: 404, statusMessage: 'Annonce introuvable.' })
  if (vehicle.status === 'sold') throw createError({ statusCode: 409, statusMessage: 'Ce véhicule est déjà vendu.' })
  if (vehicle.sellerId === userId) throw createError({ statusCode: 400, statusMessage: 'Vous ne pouvez pas acheter votre propre annonce.' })

  const [updated] = await db
    .update(tables.vehicles)
    .set({ status: 'sold' })
    .where(eq(tables.vehicles.id, id))
    .returning()

  return updated
})
