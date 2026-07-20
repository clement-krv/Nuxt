import { eq } from 'drizzle-orm'
import { useDb, tables } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()

  const vehicle = await db.query.vehicles.findFirst({
    where: eq(tables.vehicles.id, id),
    with: { seller: { columns: { id: true, name: true, avatar: true } } },
  })

  if (!vehicle) throw createError({ statusCode: 404, statusMessage: 'Annonce introuvable.' })
  return vehicle
})
