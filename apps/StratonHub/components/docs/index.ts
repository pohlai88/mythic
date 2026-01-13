/**
 * Documentation Components Barrel Export
 *
 * Centralized exports for all documentation-related components.
 * This barrel export enables clean imports:
 *
 * @example
 * ```tsx
 * import { CommandPalette, AudienceSelector, ModuleNav, DocLayout } from '@/components/docs'
 * ```
 *
 * Components:
 * - CommandPalette: Cmd+K search palette
 * - AudienceSelector: Audience navigation switcher
 * - ModuleNav: Surface/module navigation
 * - DocLayout: Reading mode memory (Zustand-powered preferences)
 */

export { CommandPalette } from "./CommandPalette"
export { AudienceSelector } from "./AudienceSelector"
export { ModuleNav } from "./ModuleNav"
export { DocLayout } from "./DocLayout"
