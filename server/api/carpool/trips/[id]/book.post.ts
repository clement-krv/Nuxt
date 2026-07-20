import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { useDb, tables } from '../../../../utils/db'
import { requireUserId } from '../../../../utils/auth'
import { validateBody, fail } from '../../../../utils/validate'

const bodySchema = z.object({
  seats: z.coerce
    .number({ invalid_type_error: 'Le nombre de places doit être un nombre' })
    .int('Le nombre de places doit être un entier')
    .min(1, 'Réservez au moins 1 place')
    .max(8, 'Maximum 8 places par réservation'),
})

export default defineEventHandler(async (event) => {
  const userId = await requireUserId(event)
  const tripId = Number(getRouterParam(event, 'id'))
  const { seats } = await validateBody(event, bodySchema)
  const db = useDb()

  const trip = await db.query.carpoolTrips.findFirst({
    where: eq(tables.carpoolTrips.id, tripId),
    with: { bookings: { columns: { userId: true, seats: true, status: true } } },
  })
  if (!trip) throw fail(404, 'Trajet introuvable.')

  if (trip.driverId === userId) {
    throw fail(400, 'Vous ne pouvez pas réserver votre propre trajet.')
  }

  const alreadyBooked = trip.bookings.some((b) => b.userId === userId && b.status === 'confirmed')
  if (alreadyBooked) {
    throw fail(409, 'Vous avez déjà réservé ce trajet.')
  }

  const booked = trip.bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((s, b) => s + b.seats, 0)
  if (booked + seats > trip.seatsTotal) {
    const restant = trip.seatsTotal - booked
    throw fail(400, `Pas assez de places disponibles (${restant} restante(s)).`)
  }

  const [booking] = await db
    .insert(tables.carpoolBookings)
    .values({ tripId, userId, seats })
    .returning()

  return booking
})
