/**
 * MDX Components Registry — StratonHub
 *
 * Global MDX components for documentation system.
 * Required by @next/mdx for App Router.
 *
 * Performance Optimizations:
 * - Memoized base components to prevent unnecessary re-renders
 * - Stable component references for better React reconciliation
 * - Efficient className merging with cn utility
 * - Type-safe component definitions
 *
 * Next.js Best Practices:
 * - Follows @next/mdx conventions for App Router
 * - Server Component compatible (no client-side hooks)
 * - Accessible semantic HTML elements
 * - Design system token usage
 *
 * Reference:
 * - https://nextjs.org/docs/app/guides/mdx
 * - https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components
 */

import { memo } from "react"
import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef } from "react"
import { cn } from "@mythic/nextjs-shared-utils"

// ============================================================================
// Component Style Constants
// ============================================================================

/**
 * Pre-defined className strings for better maintainability and performance
 */
const STYLES = {
  h1: "font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-parchment mb-6",
  h2: "font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-parchment mb-4 mt-8",
  h3: "font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-parchment mb-3 mt-6",
  p: "text-ash text-sm sm:text-base leading-relaxed mb-4",
  a: "text-gold hover:text-parchment underline transition-colors",
  code: "font-mono text-xs sm:text-sm bg-void px-1.5 py-0.5 rounded-xs border border-charcoal text-parchment",
  pre: "bg-void border border-charcoal rounded-xs p-4 overflow-x-auto mb-4",
  ul: "list-disc list-inside mb-4 text-ash",
  ol: "list-decimal list-inside mb-4 text-ash",
  li: "mb-2",
  blockquote: "border-l-4 border-gold pl-4 italic text-ash my-4",
  table: "w-full border-collapse border border-charcoal my-4",
  th: "border border-charcoal px-4 py-2 bg-obsidian text-parchment",
  td: "border border-charcoal px-4 py-2 text-ash",
} as const

// ============================================================================
// Memoized Base Components
// ============================================================================

/**
 * Memoized heading components to prevent unnecessary re-renders
 * Only re-render when props actually change
 */
const Heading1 = memo<ComponentPropsWithoutRef<"h1">>(({ className, ...props }) => (
  <h1 className={cn(STYLES.h1, className)} {...props} />
))
Heading1.displayName = "MDXHeading1"

const Heading2 = memo<ComponentPropsWithoutRef<"h2">>(({ className, ...props }) => (
  <h2 className={cn(STYLES.h2, className)} {...props} />
))
Heading2.displayName = "MDXHeading2"

const Heading3 = memo<ComponentPropsWithoutRef<"h3">>(({ className, ...props }) => (
  <h3 className={cn(STYLES.h3, className)} {...props} />
))
Heading3.displayName = "MDXHeading3"

/**
 * Memoized text components
 */
const Paragraph = memo<ComponentPropsWithoutRef<"p">>(({ className, ...props }) => (
  <p className={cn(STYLES.p, className)} {...props} />
))
Paragraph.displayName = "MDXParagraph"

const Anchor = memo<ComponentPropsWithoutRef<"a">>(({ className, ...props }) => (
  <a
    className={cn(STYLES.a, className)}
    {...props}
    // Accessibility: external links should have proper attributes
    {...(props.href?.startsWith("http") && {
      target: "_blank",
      rel: "noopener noreferrer",
    })}
  />
))
Anchor.displayName = "MDXAnchor"

/**
 * Memoized code components
 */
const Code = memo<ComponentPropsWithoutRef<"code">>(({ className, ...props }) => (
  <code className={cn(STYLES.code, className)} {...props} />
))
Code.displayName = "MDXCode"

const Pre = memo<ComponentPropsWithoutRef<"pre">>(({ className, ...props }) => (
  <pre className={cn(STYLES.pre, className)} {...props} />
))
Pre.displayName = "MDXPre"

/**
 * Memoized list components
 */
const UnorderedList = memo<ComponentPropsWithoutRef<"ul">>(({ className, ...props }) => (
  <ul className={cn(STYLES.ul, className)} {...props} />
))
UnorderedList.displayName = "MDXUnorderedList"

const OrderedList = memo<ComponentPropsWithoutRef<"ol">>(({ className, ...props }) => (
  <ol className={cn(STYLES.ol, className)} {...props} />
))
OrderedList.displayName = "MDXOrderedList"

const ListItem = memo<ComponentPropsWithoutRef<"li">>(({ className, ...props }) => (
  <li className={cn(STYLES.li, className)} {...props} />
))
ListItem.displayName = "MDXListItem"

/**
 * Memoized blockquote component
 */
const Blockquote = memo<ComponentPropsWithoutRef<"blockquote">>(({ className, ...props }) => (
  <blockquote className={cn(STYLES.blockquote, className)} {...props} />
))
Blockquote.displayName = "MDXBlockquote"

/**
 * Memoized table components
 */
const Table = memo<ComponentPropsWithoutRef<"table">>(({ className, ...props }) => (
  <table className={cn(STYLES.table, className)} {...props} />
))
Table.displayName = "MDXTable"

const TableHeader = memo<ComponentPropsWithoutRef<"th">>(({ className, ...props }) => (
  <th className={cn(STYLES.th, className)} {...props} />
))
TableHeader.displayName = "MDXTableHeader"

const TableCell = memo<ComponentPropsWithoutRef<"td">>(({ className, ...props }) => (
  <td className={cn(STYLES.td, className)} {...props} />
))
TableCell.displayName = "MDXTableCell"

// ============================================================================
// Base Components Registry
// ============================================================================

/**
 * Base MDX components registry
 *
 * Using memoized components for better performance.
 * Components are only re-rendered when their props change.
 *
 * @constant
 */
const baseComponents: MDXComponents = {
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  p: Paragraph,
  a: Anchor,
  code: Code,
  pre: Pre,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  blockquote: Blockquote,
  table: Table,
  th: TableHeader,
  td: TableCell,
} as const

// ============================================================================
// MDX Components Hook
// ============================================================================

/**
 * MDX Components hook for @next/mdx
 *
 * Merges base components with optional custom components.
 * Follows Next.js App Router conventions for MDX.
 *
 * @param components - Optional custom components to override base components
 * @returns Merged MDX components registry
 *
 * @example
 * ```tsx
 * // In MDX file
 * export const components = {
 *   h1: ({ children }) => <CustomHeading>{children}</CustomHeading>
 * }
 * ```
 */
export function useMDXComponents(components?: MDXComponents): MDXComponents {
  // Return merged components (base + custom)
  // Custom components override base components
  return {
    ...baseComponents,
    ...components,
  }
}
