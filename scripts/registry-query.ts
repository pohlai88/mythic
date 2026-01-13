#!/usr/bin/env tsx
/**
 * Registry Query Tool
 *
 * Query the function and script registry to find functions and scripts.
 *
 * Usage:
 *   pnpm registry:query <name>              # Search by name
 *   pnpm registry:query --category utility  # Filter by category
 *   pnpm registry:query --tag zod           # Filter by tag
 *   pnpm registry:query --list              # List all items
 *   pnpm registry:query --script <name>     # Find a specific script
 *   pnpm registry:query --function <name>   # Find a specific function
 */

import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

// Types (duplicated from registry-scanner.ts for standalone usage)
interface FunctionRegistry {
  version: string
  description: string
  lastUpdated: string
  functions: RegistryFunction[]
  scripts: RegistryScript[]
}

interface RegistryFunction {
  id: string
  name: string
  filePath: string
  description: string
  parameters: ParameterInfo[]
  returnType: string
  examples: string[]
  exported: boolean
  category: "utility" | "api" | "validation" | "generation" | "other"
  tags: string[]
  usage: string
  lastModified: string
  hash: string
}

interface RegistryScript {
  id: string
  name: string
  filePath: string
  description: string
  usage: string
  examples: string[]
  category: "validation" | "generation" | "audit" | "migration" | "utility" | "other"
  tags: string[]
  shebang?: string
  lastModified: string
  hash: string
}

interface ParameterInfo {
  name: string
  type: string
  description: string
  optional: boolean
  default?: string
}

const REGISTRY_PATH = join(process.cwd(), "scripts", "function-registry.json")

function loadRegistry(): FunctionRegistry {
  if (!existsSync(REGISTRY_PATH)) {
    console.error("❌ Registry not found. Run 'pnpm registry:scan' first.")
    process.exit(1)
  }

  const content = readFileSync(REGISTRY_PATH, "utf-8")
  return JSON.parse(content) as FunctionRegistry
}

function searchFunctions(
  registry: FunctionRegistry,
  query?: string,
  category?: string,
  tag?: string
): RegistryFunction[] {
  let results = registry.functions

  if (query) {
    const lowerQuery = query.toLowerCase()
    results = results.filter(
      (f) =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.description.toLowerCase().includes(lowerQuery) ||
        f.filePath.toLowerCase().includes(lowerQuery)
    )
  }

  if (category) {
    results = results.filter((f) => f.category === category)
  }

  if (tag) {
    results = results.filter((f) => f.tags.includes(tag))
  }

  return results
}

function searchScripts(
  registry: FunctionRegistry,
  query?: string,
  category?: string,
  tag?: string
): RegistryScript[] {
  let results = registry.scripts

  if (query) {
    const lowerQuery = query.toLowerCase()
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.filePath.toLowerCase().includes(lowerQuery)
    )
  }

  if (category) {
    results = results.filter((s) => s.category === category)
  }

  if (tag) {
    results = results.filter((s) => s.tags.includes(tag))
  }

  return results
}

function printFunction(func: RegistryFunction): void {
  console.log(`\n📦 ${func.name}`)
  console.log(`   File: ${func.filePath}`)
  console.log(`   Category: ${func.category}`)
  console.log(`   Exported: ${func.exported ? "✅" : "❌"}`)
  console.log(`   Description: ${func.description}`)

  if (func.parameters.length > 0) {
    console.log(`   Parameters:`)
    func.parameters.forEach((param) => {
      console.log(`     • ${param.name}: ${param.type}${param.optional ? " (optional)" : ""}`)
      if (param.description) {
        console.log(`       ${param.description}`)
      }
    })
  }

  console.log(`   Returns: ${func.returnType}`)
  console.log(`   Usage: ${func.usage}`)

  if (func.examples.length > 0) {
    console.log(`   Examples:`)
    func.examples.forEach((example, i) => {
      console.log(`     ${i + 1}. ${example}`)
    })
  }

  if (func.tags.length > 0) {
    console.log(`   Tags: ${func.tags.join(", ")}`)
  }
}

function printScript(script: RegistryScript): void {
  console.log(`\n📜 ${script.name}`)
  console.log(`   File: ${script.filePath}`)
  console.log(`   Category: ${script.category}`)
  if (script.shebang) {
    console.log(`   Shebang: ${script.shebang}`)
  }
  console.log(`   Description: ${script.description}`)
  console.log(`   Usage: ${script.usage}`)

  if (script.examples.length > 0) {
    console.log(`   Examples:`)
    script.examples.forEach((example, i) => {
      console.log(`     ${i + 1}. ${example}`)
    })
  }

  if (script.tags.length > 0) {
    console.log(`   Tags: ${script.tags.join(", ")}`)
  }
}

function main(): void {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log(`
Registry Query Tool

Usage:
  pnpm registry:query <name>              Search by name
  pnpm registry:query --category <cat>    Filter by category
  pnpm registry:query --tag <tag>         Filter by tag
  pnpm registry:query --list              List all items
  pnpm registry:query --script <name>     Find a specific script
  pnpm registry:query --function <name>   Find a specific function

Categories:
  utility, api, validation, generation, audit, migration, other

Examples:
  pnpm registry:query validate
  pnpm registry:query --category validation
  pnpm registry:query --tag zod
  pnpm registry:query --script validate-docs
`)
    process.exit(0)
  }

  const registry = loadRegistry()

  // Parse arguments
  const listAll = args.includes("--list")
  const scriptName = args.find((arg, i) => arg === "--script" && args[i + 1])
    ? args[args.indexOf("--script") + 1]
    : undefined
  const functionName = args.find((arg, i) => arg === "--function" && args[i + 1])
    ? args[args.indexOf("--function") + 1]
    : undefined
  const category = args.find((arg, i) => arg === "--category" && args[i + 1])
    ? args[args.indexOf("--category") + 1]
    : undefined
  const tag = args.find((arg, i) => arg === "--tag" && args[i + 1])
    ? args[args.indexOf("--tag") + 1]
    : undefined
  const query = args.find((arg) =>
    !arg.startsWith("--") &&
    arg !== scriptName &&
    arg !== functionName &&
    arg !== category &&
    arg !== tag
  )

  if (listAll) {
    console.log(`\n📚 Registry Overview`)
    console.log(`   Last Updated: ${registry.lastUpdated}`)
    console.log(`   Total Functions: ${registry.functions.length}`)
    console.log(`   Total Scripts: ${registry.scripts.length}`)

    console.log(`\n📦 Functions:`)
    registry.functions.forEach((f) => {
      console.log(`   • ${f.name} (${f.category}) - ${f.filePath}`)
    })

    console.log(`\n📜 Scripts:`)
    registry.scripts.forEach((s) => {
      console.log(`   • ${s.name} (${s.category}) - ${s.filePath}`)
    })
    return
  }

  if (scriptName) {
    const script = registry.scripts.find((s) =>
      s.name.toLowerCase() === scriptName.toLowerCase() ||
      s.name.toLowerCase().includes(scriptName.toLowerCase())
    )
    if (script) {
      printScript(script)
    } else {
      console.log(`❌ Script '${scriptName}' not found`)
      const similar = registry.scripts.filter((s) =>
        s.name.toLowerCase().includes(scriptName.toLowerCase())
      )
      if (similar.length > 0) {
        console.log(`\nDid you mean:`)
        similar.forEach((s) => console.log(`   • ${s.name}`))
      }
    }
    return
  }

  if (functionName) {
    const func = registry.functions.find((f) =>
      f.name.toLowerCase() === functionName.toLowerCase() ||
      f.name.toLowerCase().includes(functionName.toLowerCase())
    )
    if (func) {
      printFunction(func)
    } else {
      console.log(`❌ Function '${functionName}' not found`)
      const similar = registry.functions.filter((f) =>
        f.name.toLowerCase().includes(functionName.toLowerCase())
      )
      if (similar.length > 0) {
        console.log(`\nDid you mean:`)
        similar.forEach((f) => console.log(`   • ${f.name}`))
      }
    }
    return
  }

  // General search
  const functions = searchFunctions(registry, query, category, tag)
  const scripts = searchScripts(registry, query, category, tag)

  if (functions.length === 0 && scripts.length === 0) {
    console.log("❌ No results found")
    return
  }

  if (functions.length > 0) {
    console.log(`\n📦 Found ${functions.length} function(s):`)
    functions.forEach((f) => {
      console.log(`   • ${f.name} (${f.category}) - ${f.filePath}`)
      if (query || category || tag) {
        printFunction(f)
      }
    })
  }

  if (scripts.length > 0) {
    console.log(`\n📜 Found ${scripts.length} script(s):`)
    scripts.forEach((s) => {
      console.log(`   • ${s.name} (${s.category}) - ${s.filePath}`)
      if (query || category || tag) {
        printScript(s)
      }
    })
  }
}

main()
