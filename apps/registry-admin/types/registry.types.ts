/**
 * Registry Type Definitions
 *
 * Comprehensive schema with dependencies, lineage, and metadata
 * Designed for TanStack Query integration
 */

import { z as z4 } from "zod/v4"

// ============================================================================
// Base Types
// ============================================================================

export const ParameterInfoSchema = z4
  .object({
    name: z4.string().min(1).describe("Parameter name"),
    type: z4.string().min(1).describe("Parameter type"),
    description: z4.string().describe("Parameter description"),
    optional: z4.boolean().describe("Whether parameter is optional"),
    default: z4.string().optional().describe("Default value if any"),
  })
  .describe("Function parameter information")

export type ParameterInfo = z4.infer<typeof ParameterInfoSchema>

// ============================================================================
// Dependency & Lineage Types
// ============================================================================

export const DependencySchema = z4
  .object({
    type: z4.enum(["import", "function_call", "type_reference", "module"]).describe("Dependency type"),
    name: z4.string().min(1).describe("Dependency name"),
    source: z4.string().min(1).describe("File path or module name"),
    line: z4.number().int().positive().optional().describe("Line number"),
    column: z4.number().int().nonnegative().optional().describe("Column number"),
  })
  .describe("Code dependency information")

export type Dependency = z4.infer<typeof DependencySchema>

export const LineageSchema = z4
  .object({
    dependsOn: z4.array(DependencySchema).describe("What this item depends on"),
    dependedBy: z4.array(DependencySchema).describe("What depends on this item"),
    depth: z4.number().int().nonnegative().describe("Dependency depth"),
    circular: z4.boolean().describe("Has circular dependencies"),
  })
  .describe("Code lineage and dependency graph")

export type Lineage = z4.infer<typeof LineageSchema>

// ============================================================================
// Function Schema
// ============================================================================

export const RegistryFunctionSchema = z4
  .object({
    id: z4.string().min(1).describe("Unique function identifier"),
    name: z4.string().min(1).describe("Function name"),
    filePath: z4.string().min(1).describe("File path"),
    description: z4.string().describe("Function description"),
    parameters: z4.array(ParameterInfoSchema).describe("Function parameters"),
    returnType: z4.string().describe("Return type"),
    examples: z4.array(z4.string()).describe("Usage examples"),
    exported: z4.boolean().describe("Whether function is exported"),
    category: z4.enum(["utility", "api", "validation", "generation", "other"]).describe("Function category"),
    tags: z4.array(z4.string()).describe("Function tags"),
    usage: z4.string().describe("Usage instructions"),
    lastModified: z4.string().datetime().describe("Last modified timestamp"),
    hash: z4.string().min(1).describe("Content hash for change detection"),
    dependencies: z4.array(DependencySchema).describe("Function dependencies"),
    lineage: LineageSchema.describe("Dependency lineage"),
    complexity: z4.number().int().nonnegative().optional().describe("Cyclomatic complexity"),
    linesOfCode: z4.number().int().nonnegative().optional().describe("Lines of code"),
    testCoverage: z4.number().min(0).max(100).optional().describe("Test coverage percentage"),
    documentation: z4
      .object({
        hasJSDoc: z4.boolean().describe("Has JSDoc comments"),
        hasExamples: z4.boolean().describe("Has usage examples"),
        hasUsage: z4.boolean().describe("Has usage instructions"),
        completeness: z4.number().min(0).max(100).describe("Documentation completeness score"),
      })
      .describe("Documentation metadata"),
  })
  .describe("Registry function schema")

export type RegistryFunction = z4.infer<typeof RegistryFunctionSchema>

// ============================================================================
// Script Schema
// ============================================================================

export const RegistryScriptSchema = z4
  .object({
    id: z4.string().min(1).describe("Unique script identifier"),
    name: z4.string().min(1).describe("Script name"),
    filePath: z4.string().min(1).describe("File path"),
    description: z4.string().describe("Script description"),
    usage: z4.string().describe("Usage instructions"),
    examples: z4.array(z4.string()).describe("Usage examples"),
    category: z4.enum(["validation", "generation", "audit", "migration", "utility", "other"]).describe("Script category"),
    tags: z4.array(z4.string()).describe("Script tags"),
    shebang: z4.string().optional().describe("Shebang line"),
    lastModified: z4.string().datetime().describe("Last modified timestamp"),
    hash: z4.string().min(1).describe("Content hash for change detection"),
    dependencies: z4.array(DependencySchema).describe("Script dependencies"),
    lineage: LineageSchema.describe("Dependency lineage"),
    executable: z4.boolean().describe("Whether script is executable"),
    cliArgs: z4.array(z4.string()).optional().describe("Command-line arguments"),
    environment: z4.array(z4.string()).optional().describe("Required environment variables"),
    documentation: z4
      .object({
        hasJSDoc: z4.boolean().describe("Has JSDoc comments"),
        hasExamples: z4.boolean().describe("Has usage examples"),
        hasUsage: z4.boolean().describe("Has usage instructions"),
        completeness: z4.number().min(0).max(100).describe("Documentation completeness score"),
      })
      .describe("Documentation metadata"),
  })
  .describe("Registry script schema")

export type RegistryScript = z4.infer<typeof RegistryScriptSchema>

// ============================================================================
// Registry Schema
// ============================================================================

export const FunctionRegistrySchema = z4
  .object({
    version: z4.string().min(1).describe("Registry version"),
    description: z4.string().describe("Registry description"),
    lastUpdated: z4.string().datetime().describe("Last update timestamp"),
    functions: z4.array(RegistryFunctionSchema).describe("Registered functions"),
    scripts: z4.array(RegistryScriptSchema).describe("Registered scripts"),
    metadata: z4
      .object({
        totalItems: z4.number().int().nonnegative().describe("Total items count"),
        totalFunctions: z4.number().int().nonnegative().describe("Total functions count"),
        totalScripts: z4.number().int().nonnegative().describe("Total scripts count"),
        categories: z4.record(z4.string(), z4.number().int().nonnegative()).describe("Category counts"),
        tags: z4.record(z4.string(), z4.number().int().nonnegative()).describe("Tag counts"),
        lastScanDuration: z4.number().positive().optional().describe("Scan duration in milliseconds"),
        scannerVersion: z4.string().optional().describe("Scanner version"),
      })
      .describe("Registry metadata"),
  })
  .describe("Function and script registry schema")

export type FunctionRegistry = z4.infer<typeof FunctionRegistrySchema>

// ============================================================================
// Query Response Types (for TanStack Query)
// ============================================================================

export const RegistryQueryResponseSchema = z4
  .object({
    registry: FunctionRegistrySchema.describe("Registry data"),
    stats: z4
      .object({
        totalItems: z4.number().int().nonnegative().describe("Total items"),
        totalFunctions: z4.number().int().nonnegative().describe("Total functions"),
        totalScripts: z4.number().int().nonnegative().describe("Total scripts"),
        categories: z4.record(z4.string(), z4.number().int().nonnegative()).describe("Category counts"),
        tags: z4.record(z4.string(), z4.number().int().nonnegative()).describe("Tag counts"),
        lastUpdated: z4.string().datetime().describe("Last update timestamp"),
      })
      .describe("Registry statistics"),
  })
  .describe("Registry query response schema")

export type RegistryQueryResponse = z4.infer<typeof RegistryQueryResponseSchema>

export const RegistryFilterSchema = z4
  .object({
    search: z4.string().optional().describe("Search query"),
    category: z4.string().optional().describe("Category filter"),
    tag: z4.string().optional().describe("Tag filter"),
    exported: z4.boolean().optional().describe("Filter by exported status"),
    hasDependencies: z4.boolean().optional().describe("Filter by dependency presence"),
    minComplexity: z4.number().int().nonnegative().optional().describe("Minimum complexity"),
    maxComplexity: z4.number().int().nonnegative().optional().describe("Maximum complexity"),
  })
  .describe("Registry filter schema")

export type RegistryFilter = z4.infer<typeof RegistryFilterSchema>
