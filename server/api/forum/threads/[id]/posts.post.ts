import { z } from 'zod'
import { useDb, tables } from '../../../../utils/db'
import { requireUserId } from '../../../../utils/auth'

const bodySchema = z.object({
  content: z.string().min(1, 'Message vide'),
})

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const threadId = Number(getRouterParam(event, 'id'))
  const { content } = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [post] = await db
    .insert(tables.forumPosts)
    .values({ threadId, userId, content })
    .returning()

  return post
})
