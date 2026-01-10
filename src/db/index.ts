import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/mythic'

const client = postgres(connectionString)
export const db = drizzle(client, { schema })

// Export types
export type Database = typeof db
export { users } from './schema'
export type { User, NewUser } from './schema'
