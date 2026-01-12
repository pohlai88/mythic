/**
 * Living Schema Generation Script
 *
 * Auto-generates Zod schemas from Drizzle schema definitions.
 * This ensures a single source of truth: Drizzle schema → Zod schema → TypeScript types
 *
 * Usage:
 *   pnpm schema:generate
 *   pnpm schema:watch
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import * as schema from '../apps/boardroom/src/db/schema'

/**
 * Generate Zod schemas from Drizzle tables
 */
function generateZodSchemas() {
  const output: string[] = []
  
  output.push('/**')
  output.push(' * Auto-generated Zod Schemas from Drizzle')
  output.push(' *')
  output.push(' * DO NOT EDIT MANUALLY - This file is auto-generated')
  output.push(' * Run: pnpm schema:generate')
  output.push(' *')
  output.push(' * Living Schema Pattern:')
  output.push(' *   Drizzle Schema → Zod Schema → TypeScript Types')
  output.push(' */')
  output.push('')
  output.push("import { z as z4 } from 'zod/v4'")
  output.push("import { createInsertSchema, createSelectSchema } from 'drizzle-zod'")
  output.push("import * as drizzleSchema from '@/src/db/schema'")
  output.push('')
  
  // Generate schemas for each table
  const tables = [
    { name: 'proposals', table: schema.proposals },
    { name: 'circles', table: schema.circles },
    { name: 'circleMembers', table: schema.circleMembers },
    { name: 'boardComments', table: schema.boardComments },
    { name: 'thanosEvents', table: schema.thanosEvents },
    { name: 'proposalStencils', table: schema.proposalStencils },
  ]
  
  for (const { name, table } of tables) {
    const insertSchemaName = `insert${name.charAt(0).toUpperCase() + name.slice(1)}Schema`
    const selectSchemaName = `select${name.charAt(0).toUpperCase() + name.slice(1)}Schema`
    
    output.push(`// ${name} schemas`)
    output.push(`export const ${insertSchemaName} = createInsertSchema(drizzleSchema.${name})`)
    output.push(`export const ${selectSchemaName} = createSelectSchema(drizzleSchema.${name})`)
    output.push('')
  }
  
  output.push('// Type exports')
  output.push('export type {')
  for (const { name } of tables) {
    const typeName = name.charAt(0).toUpperCase() + name.slice(1)
    output.push(`  ${typeName}Insert = z4.infer<typeof insert${typeName.charAt(0).toUpperCase() + typeName.slice(1)}Schema>,`)
    output.push(`  ${typeName}Select = z4.infer<typeof select${typeName.charAt(0).toUpperCase() + typeName.slice(1)}Schema>,`)
  }
  output.push('}')
  
  return output.join('\n')
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('🔄 Generating Living Schema...')
    
    const zodSchemas = generateZodSchemas()
    
    // Ensure directory exists
    const outputDir = join(process.cwd(), 'apps/boardroom/src/lib/api-schemas')
    mkdirSync(outputDir, { recursive: true })
    
    // Write generated file
    const outputPath = join(outputDir, 'generated.ts')
    writeFileSync(outputPath, zodSchemas, 'utf-8')
    
    console.log('✅ Living Schema generated successfully!')
    console.log(`   Output: ${outputPath}`)
    console.log('')
    console.log('💡 Tip: Run "pnpm schema:watch" to auto-regenerate on schema changes')
  } catch (error) {
    console.error('❌ Error generating Living Schema:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

export { generateZodSchemas }
