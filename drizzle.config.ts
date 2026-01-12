import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'

// Load environment variables
config()

// Parse DATABASE_URL if provided (for Neon, etc.)
function parseDatabaseUrl(url?: string) {
  if (!url) return null
  
  try {
    const parsed = new URL(url)
    return {
      host: parsed.hostname,
      port: Number(parsed.port) || 5432,
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.slice(1), // Remove leading '/'
      ssl: parsed.searchParams.get('sslmode') === 'require' || parsed.searchParams.has('sslmode'),
    }
  } catch {
    return null
  }
}

// Try to parse DATABASE_URL first (for Neon, etc.)
const urlConfig = parseDatabaseUrl(process.env.DATABASE_URL)

export default defineConfig({
  schema: './src/db/schema/*.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: urlConfig || {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mythic',
    ssl: process.env.DB_SSL === 'true',
  },
  verbose: true,
  strict: true,
})
