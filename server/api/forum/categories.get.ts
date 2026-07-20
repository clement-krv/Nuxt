import { useDb } from '../../utils/db'

export default defineEventHandler(async () => {
  const db = useDb()
  const cats = await db.query.forumCategories.findMany({
    with: { threads: { columns: { id: true } } },
  })
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    threadCount: c.threads.length,
  }))
})
