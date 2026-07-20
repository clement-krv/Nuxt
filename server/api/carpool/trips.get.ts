import { asc } from 'drizzle-orm'
import { useDb, tables } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const db = useDb()
  const { from, to } = getQuery(event)

  const trips = await db.query.carpoolTrips.findMany({
    orderBy: [asc(tables.carpoolTrips.departureAt)],
    with: {
      driver: { columns: { id: true, name: true, avatar: true } },
      bookings: { columns: { seats: true, status: true } },
    },
  })

  return trips
    .map((t) => {
      const booked = t.bookings
        .filter((b) => b.status === 'confirmed')
        .reduce((s, b) => s + b.seats, 0)
      return {
        id: t.id,
        fromCity: t.fromCity,
        toCity: t.toCity,
        departureAt: t.departureAt,
        seatsTotal: t.seatsTotal,
        seatsAvailable: t.seatsTotal - booked,
        pricePerSeat: t.pricePerSeat,
        vehicleType: t.vehicleType,
        description: t.description,
        driver: t.driver,
      }
    })
    .filter((t) => {
      const okFrom = from ? t.fromCity.toLowerCase().includes(String(from).toLowerCase()) : true
      const okTo = to ? t.toCity.toLowerCase().includes(String(to).toLowerCase()) : true
      return okFrom && okTo
    })
})
