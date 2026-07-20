import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://eco:eco@localhost:5432/ecotransport',
  },
  verbose: true,
  strict: false,
})
