/** @type { import('drizzle-kit').Config} */
export default {
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
    url: process.env.DATABASE_URL
}