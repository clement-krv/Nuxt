import { z } from 'zod'
import { useDb, tables } from '../../utils/db'
import { requireUserId } from '../../utils/auth'
import { validateBody } from '../../utils/validate'

const bodySchema = z.object({
  categoryId: z.number({ required_error: 'Veuillez choisir une catégorie', invalid_type_error: 'Veuillez choisir une catégorie' }).int('Catégorie invalide'),
  title: z.string({ required_error: 'Le titre est requis' }).trim().min(4, 'Le titre doit contenir au moins 4 caractères'),
  content: z.string({ required_error: 'Le message est requis' }).trim().min(4, 'Le message doit contenir au moins 4 caractères'),
})

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const { categoryId, title, content } = await validateBody(event, bodySchema)
  const db = useDb()

  const [thread] = await db
    .insert(tables.forumThreads)
    .values({ categoryId, userId, title })
    .returning()

  await db.insert(tables.forumPosts).values({ threadId: thread!.id, userId, content })

  return { id: thread!.id }
})
