import { z } from 'zod'
import { useDb, tables } from '../../../../utils/db'
import { requireUserId } from '../../../../utils/auth'
import { validateBody } from '../../../../utils/validate'

const bodySchema = z.object({
  content: z.string({ required_error: 'Le message est requis' }).trim().min(1, 'Le message ne peut pas être vide'),
})

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const threadId = Number(getRouterParam(event, 'id'))
  const { content } = await validateBody(event, bodySchema)
  const db = useDb()

  const [post] = await db
    .insert(tables.forumPosts)
    .values({ threadId, userId, content })
    .returning()

  return post
})
