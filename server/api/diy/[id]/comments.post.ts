import { z } from 'zod'
import { useDb, tables } from '../../../utils/db'
import { requireUserId } from '../../../utils/auth'

const bodySchema = z.object({ content: z.string().min(1, 'Commentaire vide') })

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const articleId = Number(getRouterParam(event, 'id'))
  const { content } = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [comment] = await db
    .insert(tables.diyComments)
    .values({ articleId, userId, content })
    .returning()

  return comment
})
