import { z } from 'zod'
import { useDb, tables } from '../../utils/db'
import { requireUserId } from '../../utils/auth'

const bodySchema = z.object({
  type: z.enum(['train', 'plane']),
  fromCity: z.string().min(2),
  toCity: z.string().min(2),
  company: z.string().min(1),
  travelAt: z.string().min(1),
  price: z.number().min(0),
  originalPrice: z.number().min(0).optional(),
  description: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const sellerId = await requireUserId(event)
  const body = await readValidatedBody(event, bodySchema.parse)
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
