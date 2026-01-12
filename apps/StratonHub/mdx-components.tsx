/**
 * MDX Components Registry
 *
 * Global MDX components for documentation
 * Required by @next/mdx
 * Reference: https://nextjs.org/docs/app/guides/mdx
 */

import type { MDXComponents } from 'mdx/types'
import { cn } from '@mythic/shared-utils'

// Base MDX components (headings, paragraphs, links, etc.)
const baseComponents: MDXComponents = {
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        'font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-parchment mb-6',
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        'font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-parchment mb-4 mt-8',
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        'font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-parchment mb-3 mt-6',
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn('text-ash text-sm sm:text-base leading-relaxed mb-4', className)}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        'text-gold hover:text-parchment underline transition-colors',
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        'font-mono text-xs sm:text-sm bg-void px-1.5 py-0.5 rounded-xs border border-charcoal text-parchment',
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        'bg-void border border-charcoal rounded-xs p-4 overflow-x-auto mb-4',
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul className={cn('list-disc list-inside mb-4 text-ash', className)} {...props} />
  ),
  ol: ({ className, ...props }) => (
    <ol className={cn('list-decimal list-inside mb-4 text-ash', className)} {...props} />
  ),
  li: ({ className, ...props }) => (
    <li className={cn('mb-2', className)} {...props} />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        'border-l-4 border-gold pl-4 italic text-ash my-4',
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <table
      className={cn('w-full border-collapse border border-charcoal my-4', className)}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn('border border-charcoal px-4 py-2 bg-obsidian text-parchment', className)}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn('border border-charcoal px-4 py-2 text-ash', className)}
      {...props}
    />
  ),
}

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...baseComponents,
    ...components,
  }
}
