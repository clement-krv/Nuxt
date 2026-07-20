import { desc } from 'drizzle-orm'
import { useDb, tables } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const db = useDb()
  const { category } = getQuery(event)

  const threads = await db.query.forumThreads.findMany({
    orderBy: [desc(tables.forumThreads.createdAt)],
    with: {
      author: { columns: { id: true, name: true, avatar: true } },
      category: { columns: { id: true, name: true, slug: true } },
      posts: { columns: { id: true, createdAt: true } },
    },
  })

  const filtered = category
    ? threads.filter((t) => t.category?.slug === category)
    : threads

  return filtered.map((t) => ({
    id: t.id,
    title: t.title,
    createdAt: t.createdAt,
    author: t.author,
    category: t.category,
    replies: Math.max(0, t.posts.length - 1),
    lastActivity: t.posts.reduce<Date | string>((acc, p) => (p.createdAt > acc ? p.createdAt : acc), t.createdAt),
  }))
})
