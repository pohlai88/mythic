/**
 * GraphQL API Route (App Router)
 * Migrated from pages/api/graphql/index.ts
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/route-handlers
 * @see https://www.apollographql.com/docs/apollo-server/integrations/building-integrations/#nextjs
 */

import { db, users } from '@/src/db'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { eq } from 'drizzle-orm'
import { gql } from 'graphql-tag'
import type { NextRequest } from 'next/server'
import { z } from 'zod/v4'

// GraphQL Schema with Zod validation
const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    name: String
    createdAt: String!
    updatedAt: String!
    isActive: Boolean!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    createUser(email: String!, name: String): User!
  }
`

// Zod schemas for input validation
const createUserInputSchema = z
  .object({
    email: z.string().email().describe('User email address'),
    name: z.string().optional().describe('User name'),
  })
  .describe('GraphQL create user input schema')

// Resolvers with type safety
const resolvers = {
  // biome-ignore lint/style/useNamingConvention: GraphQL schema uses PascalCase
  Query: {
    users: async () => {
      return await db.select().from(users)
    },
    user: async (_: unknown, { id }: { id: number }) => {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1)
      return result[0] || null
    },
  },
  // biome-ignore lint/style/useNamingConvention: GraphQL schema uses PascalCase
  Mutation: {
    createUser: async (_: unknown, args: z.infer<typeof createUserInputSchema>) => {
      // Validate input with Zod
      const validated = createUserInputSchema.parse(args)
      // Insert into database (types are auto-inferred)
      const result = await db.insert(users).values(validated).returning()
      return result[0]
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const handler = startServerAndCreateNextHandler(server)

/**
 * GET handler for GraphQL queries
 * App Router compatible route handler
 */
export async function GET(request: NextRequest) {
  return handler(request)
}

/**
 * POST handler for GraphQL mutations
 * App Router compatible route handler
 */
export async function POST(request: NextRequest) {
  return handler(request)
}
