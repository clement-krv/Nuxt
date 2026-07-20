import { z } from 'zod'
import { useDb, tables } from '../../utils/db'
import { requireUserId } from '../../utils/auth'
import { validateBody } from '../../utils/validate'

const bodySchema = z.object({
  type: z.enum(['train', 'plane'], { errorMap: () => ({ message: 'Le type doit être « train » ou « avion »' }) }),
  fromCity: z.string({ required_error: 'La ville de départ est requise' }).trim().min(2, 'La ville de départ doit contenir au moins 2 caractères'),
  toCity: z.string({ required_error: 'La ville d\'arrivée est requise' }).trim().min(2, 'La ville d\'arrivée doit contenir au moins 2 caractères'),
  company: z.string({ required_error: 'La compagnie est requise' }).trim().min(1, 'La compagnie est requise'),
  travelAt: z
    .string({ required_error: 'La date du voyage est requise' })
    .min(1, 'La date du voyage est requise')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'La date du voyage est invalide'),
  price: z.coerce.number({ invalid_type_error: 'Le prix de vente doit être un nombre' }).min(0, 'Le prix ne peut pas être négatif'),
  originalPrice: z.preprocess(
    (v) => (v === '' || v === null ? undefined : v),
    z.coerce.number({ invalid_type_error: 'Le prix d\'origine doit être un nombre' }).min(0, 'Le prix d\'origine ne peut pas être négatif').optional(),
  ),
  description: z.string().trim().optional(),
})

export default defineEventHandler(async (event) => {
  const sellerId = await requireUserId(event)
  const body = await validateBody(event, bodySchema)
  const db = useDb()

  const [ticket] = await db
    .insert(tables.tickets)
    .values({
      sellerId,
      type: body.type,
      fromCity: body.fromCity,
      toCity: body.toCity,
      company: body.company,
      travelAt: new Date(body.travelAt),
      price: body.price,
      originalPrice: body.originalPrice,
      description: body.description,
    })
    .returning()

  return { id: ticket!.id }
})
