#!/usr/bin/env tsx
/**
 * Component Documentation Generator
 *
 * Extracts React component props and metadata from codebase
 * and generates MDX documentation files for apps/docs.
 *
 * Usage:
 *   pnpm generate:component-docs
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs"
import { join } from "node:path"
import { parse } from "react-docgen-typescript"
import { createScriptLogger } from "../src/lib/logger"

const log = createScriptLogger("generate-component-docs")

interface ComponentDoc {
  displayName: string
  description: string
  props: Array<{
    name: string
    type: string
    required: boolean
    description: string
    defaultValue?: string
  }>
  filePath: string
}

const outputDir = join(process.cwd(), "apps/docs/content/reference/components")
const sourcePaths = [
  "components/**/*.tsx",
  "apps/**/components/**/*.tsx",
  "packages/**/src/**/*.tsx",
]

// Exclude patterns
const excludePatterns = [
  "**/node_modules/**",
  "**/.next/**",
  "**/dist/**",
  "**/build/**",
  "**/*.test.tsx",
  "**/*.spec.tsx",
  "**/stories/**",
]

function generateMDX(componentDoc: ComponentDoc): string {
  const { displayName, description, props } = componentDoc

  const propsSection =
    props.length > 0
      ? `## Props

${props
  .map(
    (prop) => `### ${prop.name}

**Type**: \`${prop.type}\`

${prop.required ? "**Required**" : "Optional"}

${prop.description || "No description available"}

${prop.defaultValue ? `**Default**: \`${prop.defaultValue}\`` : ""}

`
  )
  .join("\n")}`
      : ""

  return `---
title: ${displayName}
description: ${description || `React component: ${displayName}`}
category: reference
tags: [components, ui]
---

# ${displayName}

${description || `React component: ${displayName}`}

${propsSection}
`
}

function generateMetadata(componentDocs: ComponentDoc[]): Record<string, unknown> {
  return {
    generated: new Date().toISOString(),
    count: componentDocs.length,
    components: componentDocs.map((doc) => ({
      name: doc.displayName,
      description: doc.description,
      filePath: doc.filePath,
      propCount: doc.props.length,
    })),
  }
}

async function generateComponentDocs(): Promise<void> {
  log.info("Starting component documentation generation...")

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
    log.info({ outputDir }, "Created output directory")
  }

  // Find all component files
  const { glob } = await import("glob")
  const componentFiles: string[] = []

  for (const pattern of sourcePaths) {
    const files = await glob(pattern, {
      ignore: excludePatterns,
      absolute: false,
    })
    componentFiles.push(...files)
  }

  log.info(
    { count: componentFiles.length },
    `Found ${componentFiles.length} component files to process`
  )

  // Parse components using react-docgen-typescript
  const parser = parse(componentFiles, {
    shouldExtractLiteralValuesFromEnum: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: (prop) => {
      // Filter out internal props
      if (prop.name.startsWith("_")) return false
      if (prop.name === "key") return false
      if (prop.name === "ref") return false
      return true
    },
    savePropValueAsString: true,
  })

  log.info({ count: parser.length }, `Extracted ${parser.length} components`)

  const componentDocs: ComponentDoc[] = parser.map((component) => {
    const props = Object.values(component.props || {}).map((prop) => ({
      name: prop.name,
      type: prop.type.name || prop.type.raw || "unknown",
      required: prop.required || false,
      description: prop.description || "",
      defaultValue: prop.defaultValue?.value?.toString(),
    }))

    return {
      displayName: component.displayName || "Unknown",
      description: component.description || "",
      props,
      filePath: component.filePath || "",
    }
  })

  // Generate MDX files
  let generatedCount = 0
  for (const componentDoc of componentDocs) {
    // Skip components without display names
    if (componentDoc.displayName === "Unknown") {
      log.warn({ filePath: componentDoc.filePath }, "Skipping component without display name")
      continue
    }

    const mdx = generateMDX(componentDoc)
    const outputPath = join(outputDir, `${componentDoc.displayName}.mdx`)

    writeFileSync(outputPath, mdx, "utf-8")
    generatedCount++
    log.debug(
      { name: componentDoc.displayName, path: outputPath },
      "Generated component documentation"
    )
  }

  // Generate metadata JSON
  const metadata = generateMetadata(componentDocs)
  const metadataPath = join(outputDir, ".meta.json")
  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), "utf-8")

  log.info(
    { generated: generatedCount, total: componentDocs.length, outputDir },
    `✅ Generated ${generatedCount} component documentation files`
  )
}

// Run generator
generateComponentDocs().catch((error) => {
  log.error({ error }, "Failed to generate component documentation")
  process.exit(1)
})
