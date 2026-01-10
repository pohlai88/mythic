/**
 * tRPC API Route (App Router)
 * Migrated from pages/api/trpc/[trpc].ts
 *
 * @see https://trpc.io/docs/server/adapters/nextjs#app-directory
 */

import { appRouter } from '@/src/server/trpc'
import type { Context } from '@/src/server/trpc'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: (): Context => {
      // Add your context creation logic here
      return {}
    },
  })

export { handler as GET, handler as POST }
