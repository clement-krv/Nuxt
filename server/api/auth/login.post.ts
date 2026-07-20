import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDb, tables } from '../../utils/db'
import { validateBody, fail } from '../../utils/validate'

const bodySchema = z.object({
  email: z.string({ required_error: 'L\'email est requis' }).trim().email('Adresse email invalide'),
  password: z.string({ required_error: 'Le mot de passe est requis' }).min(1, 'Le mot de passe est requis'),
})

export default defineEventHandler(async (event) => {
  const { email, password } = await validateBody(event, bodySchema)
  const db = useDb()

  const [user] = await db.select().from(tables.users).where(eq(tables.users.email, email)).limit(1)
  if (!user) {
    throw fail(401, 'Identifiants incorrects.')
  }

  const valid = await verifyPassword(user.passwordHash, password)
  if (!valid) {
    throw fail(401, 'Identifiants incorrects.')
  }

  await setUserSession(event, {
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
  })

  return { user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } }
})
