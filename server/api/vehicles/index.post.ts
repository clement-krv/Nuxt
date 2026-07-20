import { z } from 'zod'
import { useDb, tables } from '../../utils/db'
import { requireUserId } from '../../utils/auth'
import { validateBody } from '../../utils/validate'

const bodySchema = z.object({
  category: z.enum(['velo', 'electrique', 'scooter', 'voiture', 'attelage'], {
    errorMap: () => ({ message: 'Veuillez choisir une catégorie valide' }),
  }),
  title: z.string({ required_error: 'Le titre est requis' }).trim().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string({ required_error: 'La description est requise' }).trim().min(10, 'La description doit contenir au moins 10 caractères'),
  price: z.coerce.number({ invalid_type_error: 'Le prix doit être un nombre' }).min(0, 'Le prix ne peut pas être négatif'),
  condition: z.string({ required_error: 'L\'état est requis' }).trim().min(1, 'L\'état est requis'),
  location: z.string({ required_error: 'La localisation est requise' }).trim().min(1, 'La localisation est requise'),
  image: z
    .string()
    .trim()
    .url('L\'image doit être une URL valide (https://…)')
    .optional()
    .or(z.literal('')),
})

export default defineEventHandler(async (event) => {
  const sellerId = await requireUserId(event)
  const body = await validateBody(event, bodySchema)
  const db = useDb()

  const [vehicle] = await db
    .insert(tables.vehicles)
    .values({
      sellerId,
      category: body.category,
      title: body.title,
      description: body.description,
      price: body.price,
      condition: body.condition,
      location: body.location,
      image: body.image || null,
    })
    .returning()

  return { id: vehicle!.id }
})
