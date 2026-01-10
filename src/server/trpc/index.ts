import { initTRPC } from '@trpc/server'
import { z } from 'zod/v4'

// Context type
export interface Context {
  // Add your context here (user, db, etc.)
  userId?: string
}

// Initialize tRPC
const t = initTRPC.context<Context>().create()

// Base router and procedure
export const router = t.router
export const publicProcedure = t.procedure

// Example router with automatic type inference
export const appRouter = router({
  // Example: Get user by ID
  getUser: publicProcedure
    .input(
      z
        .object({
          id: z.number().int().positive().describe('User ID'),
        })
        .describe('Get user input schema')
    )
    .query(async ({ input }) => {
      // Your database query here
      return { id: input.id, name: 'John Doe', email: 'john@example.com' }
    }),

  // Example: Create user with Zod validation
  createUser: publicProcedure
    .input(
      z
        .object({
          email: z.string().email().describe('User email address'),
          name: z.string().min(1).describe('User full name'),
        })
        .describe('Create user input schema')
    )
    .mutation(async ({ input }) => {
      // Your database mutation here
      return { success: true, data: input }
    }),
})

// Export types for client
export type AppRouter = typeof appRouter
