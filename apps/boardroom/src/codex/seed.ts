/**
 * Seed default stencils into database
 */

import { createScriptLogger } from '@/src/lib/logger'
import { upsertStencil } from './index'
import { defaultStencils } from './index'

const logger = createScriptLogger('seed-stencils')

/**
 * Seed default stencils
 */
export async function seedStencils(): Promise<void> {
  logger.info('Seeding default stencils...')

  for (const stencil of defaultStencils) {
    const success = await upsertStencil(stencil)
    if (success) {
      logger.info(`Seeded stencil: ${stencil.id}`, { stencilId: stencil.id })
    } else {
      logger.error(`Failed to seed stencil: ${stencil.id}`, { stencilId: stencil.id })
    }
  }

  logger.info('Stencil seeding complete!')
}
