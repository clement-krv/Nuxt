import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { useDb, tables } from '../../../../utils/db'
import { requireUserId } from '../../../../utils/auth'

const bodySchema = z.object({ seats: z.number().int().min(1).max(8) })

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const tripId = Number(getRouterParam(event, 'id'))
  const { seats } = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const trip = await db.query.carpoolTrips.findFirst({
    where: eq(tables.carpoolTrips.id, tripId),
    with: { bookings: { columns: { userId: true, seats: true, status: true } } },
  })
  if (!trip) throw createError({ statusCode: 404, statusMessage: 'Trajet introuvable.' })

  if (trip.driverId === userId) {
    throw createError({ statusCode: 400, statusMessage: 'Vous ne pouvez pas réserver votre propre trajet.' })
  }

  const alreadyBooked = trip.bookings.some((b) => b.userId === userId && b.status === 'confirmed')
  if (alreadyBooked) {
    throw createError({ statusCode: 409, statusMessage: 'Vous avez déjà réservé ce trajet.' })
  }

  const booked = trip.bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((s, b) => s + b.seats, 0)
  if (booked + seats > trip.seatsTotal) {
    throw createError({ statusCode: 400, statusMessage: 'Pas assez de places disponibles.' })
  }

  const [booking] = await db
    .insert(tables.carpoolBookings)
    .values({ tripId, userId, seats })
    .returning()

  return booking
})
