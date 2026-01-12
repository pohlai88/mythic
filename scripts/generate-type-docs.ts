#!/usr/bin/env tsx
/**
 * Type Documentation Generator
 *
 * Extracts TypeScript types, interfaces, and enums from codebase
 * and generates MDX documentation files for apps/docs.
 *
 * Usage:
 *   pnpm generate:type-docs
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { Project } from 'ts-morph'
import { createScriptLogger } from '../src/lib/logger'

const log = createScriptLogger('generate-type-docs')

interface TypeDoc {
  name: string
  description: string
  properties: Array<{
    name: string
    type: string
    optional: boolean
    docs: string
  }>
  filePath: string
  exported: boolean
}

const outputDir = join(process.cwd(), 'apps/docs/content/reference/types')
const sourcePaths = [
  'src/**/*.ts',
  'packages/**/src/**/*.ts',
  'apps/**/src/**/*.ts',
]

// Exclude patterns (check if file path contains these)
const excludePatterns = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.test.ts',
  '.spec.ts',
]

function extractJSDocComment(node: { getJsDocs(): Array<{ getComment(): string }> }): string {
  const jsDocs = node.getJsDocs()
  if (jsDocs.length === 0) return ''
  return jsDocs[0]?.getComment() || ''
}

function generateMDX(typeDoc: TypeDoc): string {
  const { name, description, properties } = typeDoc

  const propertiesSection = properties.length > 0
    ? `## Properties

${properties
  .map(
    (prop) => `### ${prop.name}

**Type**: \`${prop.type}\`

${prop.optional ? '**Optional**' : '**Required**'}

${prop.docs || 'No description available'}

`
  )
  .join('\n')}`
    : ''

  return `---
title: ${name}
description: ${description || `Type definition for ${name}`}
category: reference
tags: [types, api]
---

# ${name}

${description || `Type definition for ${name}`}

${propertiesSection}
`
}

function generateMetadata(typeDocs: TypeDoc[]): Record<string, unknown> {
  return {
    generated: new Date().toISOString(),
    count: typeDocs.length,
    types: typeDocs.map((doc) => ({
      name: doc.name,
      description: doc.description,
      filePath: doc.filePath,
      exported: doc.exported,
      propertyCount: doc.properties.length,
    })),
  }
}

async function generateTypeDocs(): Promise<void> {
  log.info('Starting type documentation generation...')

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
    log.info({ outputDir }, 'Created output directory')
  }

  // Initialize ts-morph project
  const project = new Project({
    tsConfigFilePath: join(process.cwd(), 'tsconfig.json'),
    skipAddingFilesFromTsConfig: false,
  })

  // Add source files with exclusions
  for (const pattern of sourcePaths) {
    try {
      project.addSourceFilesAtPaths(pattern, {
        skipAddingFilesFromTsConfig: false,
      })
    } catch (error) {
      log.warn({ pattern, error }, 'Failed to add source files for pattern')
    }
  }

  const typeDocs: TypeDoc[] = []
  const processedNames = new Set<string>()

  // Process all source files
  project.getSourceFiles().forEach((sourceFile) => {
    const filePath = sourceFile.getFilePath()

    // Skip excluded files
    if (excludePatterns.some((pattern) => filePath.includes(pattern))) {
      return
    }

    // Extract interfaces
    sourceFile.getInterfaces().forEach((iface) => {
      const name = iface.getName()
      if (processedNames.has(name)) {
        log.warn({ name, filePath }, 'Duplicate type name found, skipping')
        return
      }
      processedNames.add(name)

      const description = extractJSDocComment(iface)
      const properties = iface.getProperties().map((prop) => ({
        name: prop.getName(),
        type: prop.getType().getText(),
        optional: prop.hasQuestionToken(),
        docs: extractJSDocComment(prop),
      }))

      typeDocs.push({
        name,
        description,
        properties,
        filePath,
        exported: iface.isExported(),
      })
    })

    // Extract type aliases
    sourceFile.getTypeAliases().forEach((typeAlias) => {
      const name = typeAlias.getName()
      if (processedNames.has(name)) {
        log.warn({ name, filePath }, 'Duplicate type name found, skipping')
        return
      }
      processedNames.add(name)

      const description = extractJSDocComment(typeAlias)
      const typeText = typeAlias.getType().getText()

      // For type aliases, show the type as a single property
      // Complex object types will show the full type text
      typeDocs.push({
        name,
        description,
        properties: [{ name: 'type', type: typeText, optional: false, docs: '' }],
        filePath,
        exported: typeAlias.isExported(),
      })
    })

    // Extract enums
    sourceFile.getEnums().forEach((enumDecl) => {
      const name = enumDecl.getName()
      if (processedNames.has(name)) {
        log.warn({ name, filePath }, 'Duplicate type name found, skipping')
        return
      }
      processedNames.add(name)

      const description = extractJSDocComment(enumDecl)
      const properties = enumDecl.getMembers().map((member) => ({
        name: member.getName(),
        type: member.getValue()?.toString() || 'string',
        optional: false,
        docs: extractJSDocComment(member),
      }))

      typeDocs.push({
        name,
        description,
        properties,
        filePath,
        exported: enumDecl.isExported(),
      })
    })
  })

  log.info({ count: typeDocs.length }, `Found ${typeDocs.length} types to document`)

  // Generate MDX files
  let generatedCount = 0
  for (const typeDoc of typeDocs) {
    // Only generate docs for exported types
    if (!typeDoc.exported) {
      log.debug({ name: typeDoc.name }, 'Skipping non-exported type')
      continue
    }

    const mdx = generateMDX(typeDoc)
    const outputPath = join(outputDir, `${typeDoc.name}.mdx`)

    writeFileSync(outputPath, mdx, 'utf-8')
    generatedCount++
    log.debug({ name: typeDoc.name, path: outputPath }, 'Generated type documentation')
  }

  // Generate metadata JSON
  const metadata = generateMetadata(typeDocs)
  const metadataPath = join(outputDir, '.meta.json')
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8')

  log.info(
    { generated: generatedCount, total: typeDocs.length, outputDir },
    `✅ Generated ${generatedCount} type documentation files`
  )
}

// Run generator
generateTypeDocs().catch((error) => {
  log.error({ error }, 'Failed to generate type documentation')
  process.exit(1)
})
