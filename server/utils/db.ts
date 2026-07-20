import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../database/schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDb() {
  if (!_db) {
    const url = process.env.DATABASE_URL || useRuntimeConfig().databaseUrl
    const client = postgres(url, { max: 10 })
    _db = drizzle(client, { schema })
  }
  return _db
}

export { schema }
export const tables = schema
