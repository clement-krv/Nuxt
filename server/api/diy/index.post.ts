import { z } from 'zod'
import { useDb, tables } from '../../utils/db'
import { requireUserId } from '../../utils/auth'

const bodySchema = z.object({
  title: z.string().min(4),
  excerpt: z.string().min(4),
  content: z.string().min(10),
  category: z.string().min(1),
  difficulty: z.enum(['Facile', 'Moyen', 'Difficile']),
  cover: z.string().url().optional().or(z.literal('')),
})

export default defineEventHandler(async (event) => {
  const authorId = await requireUserId(event)
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [article] = await db
    .insert(tables.diyArticles)
    .values({
      authorId,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      difficulty: body.difficulty,
      cover: body.cover || null,
    })
    .returning()

  return { id: article!.id }
})
