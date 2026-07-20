import { eq } from 'drizzle-orm'
import { useDb, tables } from '../../../utils/db'
import { requireUserId } from '../../../utils/auth'
import { fail } from '../../../utils/validate'

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()

  const [vehicle] = await db.select().from(tables.vehicles).where(eq(tables.vehicles.id, id)).limit(1)
  if (!vehicle) throw fail(404, 'Annonce introuvable.')
  if (vehicle.status === 'sold') throw fail(409, 'Ce véhicule est déjà vendu.')
  if (vehicle.sellerId === userId) throw fail(400, 'Vous ne pouvez pas acheter votre propre annonce.')

  const [updated] = await db
    .update(tables.vehicles)
    .set({ status: 'sold' })
    .where(eq(tables.vehicles.id, id))
    .returning()

  return updated
})
