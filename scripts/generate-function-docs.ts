#!/usr/bin/env tsx
/**
 * Function Documentation Generator
 *
 * Extracts functions with JSDoc comments from codebase
 * and generates MDX documentation files for apps/docs.
 *
 * Usage:
 *   pnpm generate:function-docs
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { Project } from 'ts-morph'
import { createScriptLogger } from '../src/lib/logger'

const log = createScriptLogger('generate-function-docs')

interface FunctionDoc {
  name: string
  description: string
  params: Array<{
    name: string
    type: string
    docs: string
    optional: boolean
  }>
  returnType: string
  examples: string[]
  filePath: string
  exported: boolean
}

const outputDir = join(process.cwd(), 'apps/docs/content/reference/functions')
const sourcePaths = [
  'src/**/*.ts',
  'packages/**/src/**/*.ts',
  'apps/**/src/**/*.ts',
  'apps/**/lib/**/*.ts',
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

function extractJSDocComment(node: { getJsDocs(): Array<{ getComment(): string; getTags(): Array<{ getTagName(): string; getComment(): string }> }> }): {
  description: string
  examples: string[]
} {
  const jsDocs = node.getJsDocs()
  if (jsDocs.length === 0) return { description: '', examples: [] }

  const firstDoc = jsDocs[0]
  const description = firstDoc?.getComment() || ''
  const examples: string[] = []

  // Extract @example tags
  firstDoc?.getTags().forEach((tag) => {
    if (tag.getTagName() === 'example') {
      const example = tag.getComment()
      if (example) examples.push(example)
    }
  })

  return { description, examples }
}


function generateMDX(functionDoc: FunctionDoc): string {
  const { name, description, params, returnType, examples } = functionDoc

  const paramsSection = params.length > 0
    ? `## Parameters

${params
  .map(
    (param) => `### ${param.name}

**Type**: \`${param.type}\`

${param.optional ? '**Optional**' : '**Required**'}

${param.docs || 'No description available'}

`
  )
  .join('\n')}`
    : ''

  const returnsSection = `## Returns

\`${returnType}\`

`

  const examplesSection = examples.length > 0
    ? `## Examples

${examples
  .map(
    (example) => `\`\`\`typescript
${example}
\`\`\`

`
  )
  .join('\n')}`
    : ''

  return `---
title: ${name}
description: ${description || `Function: ${name}`}
category: reference
tags: [functions, api]
---

# ${name}

${description || `Function: ${name}`}

${paramsSection}

${returnsSection}

${examplesSection}
`
}

function generateMetadata(functionDocs: FunctionDoc[]): Record<string, unknown> {
  return {
    generated: new Date().toISOString(),
    count: functionDocs.length,
    functions: functionDocs.map((doc) => ({
      name: doc.name,
      description: doc.description,
      filePath: doc.filePath,
      exported: doc.exported,
      paramCount: doc.params.length,
      hasExamples: doc.examples.length > 0,
    })),
  }
}

async function generateFunctionDocs(): Promise<void> {
  log.info('Starting function documentation generation...')

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

  // Add source files with error handling
  for (const pattern of sourcePaths) {
    try {
      project.addSourceFilesAtPaths(pattern)
    } catch (error) {
      log.warn({ pattern, error }, 'Failed to add source files for pattern')
    }
  }

  const functionDocs: FunctionDoc[] = []
  const processedNames = new Set<string>()

  // Process all source files
  project.getSourceFiles().forEach((sourceFile) => {
    const filePath = sourceFile.getFilePath()

    // Skip excluded files
    if (excludePatterns.some((pattern) => filePath.includes(pattern))) {
      return
    }

    // Extract functions
    sourceFile.getFunctions().forEach((func) => {
      const name = func.getName()
      if (!name) return // Skip anonymous functions

      // Create unique key with file path to handle duplicates
      const uniqueKey = `${filePath}:${name}`
      if (processedNames.has(uniqueKey)) {
        log.warn({ name, filePath }, 'Duplicate function name found, skipping')
        return
      }
      processedNames.add(uniqueKey)

      const jsDoc = extractJSDocComment(func)
      const description = jsDoc.description
      const examples = jsDoc.examples

      const params = func.getParameters().map((param) => {
        const paramName = param.getName()
        const paramType = param.getType().getText()
        const paramOptional = param.hasInitializer() || param.isOptional()

        // Extract param docs from JSDoc
        let paramDocs = ''
        try {
          const jsDocs = func.getJsDocs()
          if (jsDocs.length > 0) {
            const tags = jsDocs[0].getTags()
            const paramTag = tags.find((tag) => {
              try {
                return tag.getTagName() === 'param' && tag.getName() === paramName
              } catch {
                return false
              }
            })
            if (paramTag) {
              try {
                paramDocs = paramTag.getComment() || ''
              } catch {
                // Ignore errors
              }
            }
          }
        } catch {
          // Ignore errors extracting param docs
        }

        return {
          name: paramName,
          type: paramType,
          docs: paramDocs,
          optional: paramOptional,
        }
      })

      const returnType = func.getReturnType().getText()

      functionDocs.push({
        name,
        description,
        params,
        returnType,
        examples,
        filePath,
        exported: func.isExported(),
      })
    })
  })

  log.info({ count: functionDocs.length }, `Found ${functionDocs.length} functions to document`)

  // Generate MDX files
  let generatedCount = 0
  for (const functionDoc of functionDocs) {
    // Only generate docs for exported functions or functions with JSDoc
    if (!functionDoc.exported && !functionDoc.description) {
      log.debug({ name: functionDoc.name }, 'Skipping non-exported function without JSDoc')
      continue
    }

    const mdx = generateMDX(functionDoc)
    const outputPath = join(outputDir, `${functionDoc.name}.mdx`)

    writeFileSync(outputPath, mdx, 'utf-8')
    generatedCount++
    log.debug({ name: functionDoc.name, path: outputPath }, 'Generated function documentation')
  }

  // Generate metadata JSON
  const metadata = generateMetadata(functionDocs)
  const metadataPath = join(outputDir, '.meta.json')
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8')

  log.info(
    { generated: generatedCount, total: functionDocs.length, outputDir },
    `✅ Generated ${generatedCount} function documentation files`
  )
}

// Run generator
generateFunctionDocs().catch((error) => {
  log.error({ error }, 'Failed to generate function documentation')
  process.exit(1)
})
