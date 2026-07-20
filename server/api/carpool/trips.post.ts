import { z } from 'zod'
import { useDb, tables } from '../../utils/db'
import { requireUserId } from '../../utils/auth'

const bodySchema = z.object({
  fromCity: z.string().min(2),
  toCity: z.string().min(2),
  departureAt: z.string().min(1),
  seatsTotal: z.number().int().min(1).max(8),
  pricePerSeat: z.number().min(0),
  vehicleType: z.string().min(1),
  description: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const driverId = await requireUserId(event)
  const body = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [trip] = await db
    .insert(tables.carpoolTrips)
    .values({
      driverId,
      fromCity: body.fromCity,
      toCity: body.toCity,
      departureAt: new Date(body.departureAt),
      seatsTotal: body.seatsTotal,
      pricePerSeat: body.pricePerSeat,
      vehicleType: body.vehicleType,
      description: body.description,
    })
    .returning()

  return { id: trip!.id }
})
