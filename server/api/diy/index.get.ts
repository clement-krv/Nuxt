import { desc } from 'drizzle-orm'
import { useDb, tables } from '../../utils/db'

export default defineEventHandler(async () => {
  const db = useDb()
  const list = await db.query.diyArticles.findMany({
    orderBy: [desc(tables.diyArticles.createdAt)],
    with: {
      author: { columns: { id: true, name: true, avatar: true } },
      comments: { columns: { id: true } },
    },
  })
  return list.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    difficulty: a.difficulty,
    cover: a.cover,
    createdAt: a.createdAt,
    author: a.author,
    commentCount: a.comments.length,
  }))
})
