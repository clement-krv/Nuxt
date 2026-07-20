import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDb, tables } from '../../utils/db'
import { validateBody, fail } from '../../utils/validate'

const bodySchema = z.object({
  name: z.string({ required_error: 'Le nom est requis' }).trim().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string({ required_error: 'L\'email est requis' }).trim().email('Adresse email invalide'),
  password: z.string({ required_error: 'Le mot de passe est requis' }).min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export default defineEventHandler(async (event) => {
  const { name, email, password } = await validateBody(event, bodySchema)
  const db = useDb()

  const existing = await db.select().from(tables.users).where(eq(tables.users.email, email)).limit(1)
  if (existing.length) {
    throw fail(409, 'Un compte existe déjà avec cet email.')
  }

  const passwordHash = await hashPassword(password)
  const [user] = await db
    .insert(tables.users)
    .values({ name, email, passwordHash, avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}` })
    .returning()

  await setUserSession(event, {
    user: { id: user!.id, name: user!.name, email: user!.email, avatar: user!.avatar },
  })

  return { user: { id: user!.id, name: user!.name, email: user!.email, avatar: user!.avatar } }
})
