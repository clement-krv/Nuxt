import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDb, tables } from '../../utils/db'

const bodySchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const [user] = await db.select().from(tables.users).where(eq(tables.users.email, email)).limit(1)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants incorrects.' })
  }

  const valid = await verifyPassword(user.passwordHash, password)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants incorrects.' })
  }

  await setUserSession(event, {
    user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
  })

  return { user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } }
})
