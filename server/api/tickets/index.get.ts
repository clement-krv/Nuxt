import { desc } from 'drizzle-orm'
import { useDb, tables } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const db = useDb()
  const { type } = getQuery(event)

  const list = await db.query.tickets.findMany({
    orderBy: [desc(tables.tickets.createdAt)],
    with: { seller: { columns: { id: true, name: true, avatar: true } } },
  })

  return list.filter((t) => (type ? t.type === type : true))
})
