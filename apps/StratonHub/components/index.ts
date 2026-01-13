/**
 * StratonHub Component Library - PUBLIC API
 *
 * GOVERNANCE: Pages MUST import from this file only.
 * Direct imports from ./shells/* or ./blocks/* are forbidden.
 *
 * DOCTRINE:
 * - Pages compose Shells + Blocks
 * - Shells own layout (backgrounds, widths, padding)
 * - Blocks own content patterns (typography, component structure)
 * - Pages own data mapping only
 */

// ============================================================================
// SHELLS - Layout Containers
// ============================================================================
export { PageShell } from "./shells/PageShell"
export { CenteredShell } from "./shells/CenteredShell"
export { ContentShell } from "./shells/ContentShell"
export { DocShell } from "./shells/DocShell"

// ============================================================================
// BLOCKS - Content Patterns
// ============================================================================
export { AxisHero } from "./blocks/AxisHero"
export { AxisCard } from "./blocks/AxisCard"
export { AxisCardGrid } from "./blocks/AxisCardGrid"
export { AxisStack } from "./blocks/AxisStack"
export { DocHeader } from "./blocks/DocHeader"
export { GoldFilament } from "./blocks/GoldFilament"

// ============================================================================
// CONCIERGE - Luxury Features
// ============================================================================
export { CodeBlock } from "./blocks/CodeBlock"
export { DefinitionPeek } from "./blocks/DefinitionPeek"
export { DiffToggle } from "./blocks/DiffToggle"

// ============================================================================
// DOCS - Documentation-specific components (legacy)
// ============================================================================
export { AudienceSelector } from "./docs/AudienceSelector"
export { CommandPalette } from "./docs/CommandPalette"
export { ModuleNav } from "./docs/ModuleNav"
