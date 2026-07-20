import type { H3Event } from 'h3'
import type { ZodSchema } from 'zod'

/**
 * Throws a clean HTTP error whose human-readable (possibly accented) message is
 * carried in `message` and `data.message` — NOT in `statusMessage`, which becomes
 * the HTTP reason phrase and must stay ASCII (accents there break the response).
 */
export function fail(statusCode: number, message: string) {
  return createError({ statusCode, message, data: { message } })
}

/**
 * Reads and validates the request body against a Zod schema.
 * On failure, throws a 400 whose message lists every problem in French,
 * so the client can display exactly what went wrong in a toast.
 */
export async function validateBody<T>(event: H3Event, schema: ZodSchema<T>): Promise<T> {
  const body = await readBody(event).catch(() => undefined)
  const result = schema.safeParse(body)

  if (!result.success) {
    const messages = result.error.issues.map((i) => i.message)
    const message = [...new Set(messages)].join(' · ')
    throw createError({
      statusCode: 400,
      message,
      data: { message, issues: result.error.issues },
    })
  }

  return result.data
}
