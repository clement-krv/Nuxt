import { z } from 'zod'
import { useDb, tables } from '../../utils/db'
import { requireUserId } from '../../utils/auth'

const bodySchema = z.object({
  categoryId: z.number().int(),
  title: z.string().min(4, 'Titre trop court'),
  content: z.string().min(4, 'Message trop court'),
})

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const { categoryId, title, content } = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [thread] = await db
    .insert(tables.forumThreads)
    .values({ categoryId, userId, title })
    .returning()

  await db.insert(tables.forumPosts).values({ threadId: thread!.id, userId, content })

  return { id: thread!.id }
})
