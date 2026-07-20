import { z } from 'zod'
import { useDb, tables } from '../../utils/db'
import { requireUserId } from '../../utils/auth'
import { validateBody } from '../../utils/validate'

const bodySchema = z.object({
  fromCity: z.string({ required_error: 'La ville de départ est requise' }).trim().min(2, 'La ville de départ doit contenir au moins 2 caractères'),
  toCity: z.string({ required_error: 'La ville d\'arrivée est requise' }).trim().min(2, 'La ville d\'arrivée doit contenir au moins 2 caractères'),
  departureAt: z
    .string({ required_error: 'La date de départ est requise' })
    .min(1, 'La date de départ est requise')
    .refine((v) => !Number.isNaN(Date.parse(v)), 'La date de départ est invalide'),
  seatsTotal: z.coerce.number({ invalid_type_error: 'Le nombre de places doit être un nombre' }).int('Le nombre de places doit être un entier').min(1, 'Proposez au moins 1 place').max(8, 'Maximum 8 places'),
  pricePerSeat: z.coerce.number({ invalid_type_error: 'Le prix doit être un nombre' }).min(0, 'Le prix ne peut pas être négatif'),
  vehicleType: z.string({ required_error: 'Le véhicule est requis' }).trim().min(1, 'Le véhicule est requis'),
  description: z.string().trim().optional(),
})

export default defineEventHandler(async (event) => {
  const driverId = await requireUserId(event)
  const body = await validateBody(event, bodySchema)
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
