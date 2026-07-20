import { z } from 'zod'
import { useDb, tables } from '../../../utils/db'
import { requireUserId } from '../../../utils/auth'
import { validateBody } from '../../../utils/validate'

const bodySchema = z.object({
  content: z.string({ required_error: 'Le commentaire est requis' }).trim().min(1, 'Le commentaire ne peut pas être vide'),
})

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const articleId = Number(getRouterParam(event, 'id'))
  const { content } = await validateBody(event, bodySchema)
  const db = useDb()

  const [comment] = await db
    .insert(tables.diyComments)
    .values({ articleId, userId, content })
    .returning()

  return comment
})
