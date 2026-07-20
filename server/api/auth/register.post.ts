import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { useDb, tables } from '../../utils/db'

const bodySchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe : 6 caractères minimum'),
})

export default defineEventHandler(async (event) => {
  const { name, email, password } = await readValidatedBody(event, bodySchema.parse)
  const db = useDb()

  const existing = await db.select().from(tables.users).where(eq(tables.users.email, email)).limit(1)
  if (existing.length) {
    throw createError({ statusCode: 409, statusMessage: 'Un compte existe déjà avec cet email.' })
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
