import { z } from 'zod'
import { useDb, tables } from '../../utils/db'
import { requireUserId } from '../../utils/auth'
import { validateBody } from '../../utils/validate'

const bodySchema = z.object({
  title: z.string({ required_error: 'Le titre est requis' }).trim().min(4, 'Le titre doit contenir au moins 4 caractères'),
  excerpt: z.string({ required_error: 'Le résumé est requis' }).trim().min(4, 'Le résumé doit contenir au moins 4 caractères'),
  content: z.string({ required_error: 'Le contenu est requis' }).trim().min(10, 'Le contenu doit contenir au moins 10 caractères'),
  category: z.string({ required_error: 'La catégorie est requise' }).trim().min(1, 'La catégorie est requise'),
  difficulty: z.enum(['Facile', 'Moyen', 'Difficile'], {
    errorMap: () => ({ message: 'La difficulté doit être Facile, Moyen ou Difficile' }),
  }),
  cover: z
    .string()
    .trim()
    .url('L\'image de couverture doit être une URL valide (https://…)')
    .optional()
    .or(z.literal('')),
})

export default defineEventHandler(async (event) => {
  const authorId = await requireUserId(event)
  const body = await validateBody(event, bodySchema)
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
