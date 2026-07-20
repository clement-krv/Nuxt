import { eq, asc } from 'drizzle-orm'
import { useDb, tables } from '../../utils/db'
import { fail } from '../../utils/validate'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()

  const article = await db.query.diyArticles.findFirst({
    where: eq(tables.diyArticles.id, id),
    with: {
      author: { columns: { id: true, name: true, avatar: true } },
      comments: {
        orderBy: [asc(tables.diyComments.createdAt)],
        with: { author: { columns: { id: true, name: true, avatar: true } } },
      },
    },
  })

  if (!article) throw fail(404, 'Article introuvable.')
  return article
})
