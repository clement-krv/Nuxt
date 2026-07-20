import { desc } from 'drizzle-orm'
import { useDb, tables } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const db = useDb()
  const { category } = getQuery(event)

  const list = await db.query.vehicles.findMany({
    orderBy: [desc(tables.vehicles.createdAt)],
    with: { seller: { columns: { id: true, name: true, avatar: true } } },
  })

  return list.filter((v) => (category ? v.category === category : true))
})
