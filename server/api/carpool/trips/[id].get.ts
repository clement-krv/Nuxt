import { eq } from 'drizzle-orm'
import { useDb, tables } from '../../../utils/db'
import { fail } from '../../../utils/validate'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const db = useDb()

  const trip = await db.query.carpoolTrips.findFirst({
    where: eq(tables.carpoolTrips.id, id),
    with: {
      driver: { columns: { id: true, name: true, avatar: true } },
      bookings: {
        with: { user: { columns: { id: true, name: true, avatar: true } } },
      },
    },
  })

  if (!trip) {
    throw fail(404, 'Trajet introuvable.')
  }

  const booked = trip.bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((s, b) => s + b.seats, 0)

  return { ...trip, seatsAvailable: trip.seatsTotal - booked }
})
