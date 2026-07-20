import { eq, asc } from 'drizzle-orm'
import { useDb, tables } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()

  const thread = await db.query.forumThreads.findFirst({
    where: eq(tables.forumThreads.id, id),
    with: {
      author: { columns: { id: true, name: true, avatar: true } },
      category: { columns: { id: true, name: true, slug: true } },
      posts: {
        orderBy: [asc(tables.forumPosts.createdAt)],
        with: { author: { columns: { id: true, name: true, avatar: true } } },
      },
    },
  })

  if (!thread) {
    throw createError({ statusCode: 404, statusMessage: 'Discussion introuvable.' })
  }
  return thread
})
