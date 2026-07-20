import { z } from 'zod'
import { useDb, tables } from '../../utils/db'
import { requireUserId } from '../../utils/auth'

const bodySchema = z.object({
  category: z.enum(['velo', 'electrique', 'scooter', 'voiture', 'attelage']),
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0),
  condition: z.string().min(1),
  location: z.string().min(1),
  image: z.string().url().optional().or(z.literal('')),
})

export default defineEventHandler(async (event) => {
  const sellerId = await requireUserId(event)
  const body = await readValidatedBody(event, bodySchema.parse)
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
