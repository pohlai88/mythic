/**
 * MDX Components Registry
 *
 * Custom MDX components for documentation
 * Replaces Nextra's component system
 */

// Import governance components
import {
  AmendmentHistory,
  ConstitutionalCitation,
  HashVerification,
  LedgerLink,
  ReferenceBenchmark,
  SealedDocument,
  StatusBadge,
} from './components/governance'

// Import other custom components
import { APIReference } from './components/api-reference'
import { Cards } from './components/Cards'

// Import Diátaxis components (only used ones)
import {
  DocumentTypeBadge,
  DocumentTypeBanner,
  TutorialSteps,
  HowToGuide,
  ReferenceTable,
  ExplanationBox,
} from './components/diataxis'

// All unused components have been removed for bundle optimization

import { cn } from '@mythic/shared-utils'
import { transitions } from './lib/transitions'

// Base MDX components (headings, paragraphs, links, etc.)
const baseComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-parchment mb-6" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-parchment mb-4 mt-8" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-semibold text-parchment mb-3 mt-6" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-ash text-sm sm:text-base leading-relaxed mb-4" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn('text-gold hover:text-parchment underline', transitions.illuminate)}
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="font-mono text-xs sm:text-sm bg-void px-1.5 py-0.5 rounded-xs border border-charcoal text-parchment" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-void border border-charcoal rounded-xs p-4 overflow-x-auto mb-4" {...props} />
  ),
}

export function useMDXComponents(
  // biome-ignore lint/suspicious/noExplicitAny: MDX components accept flexible prop types
  components?: Record<string, React.ComponentType<any>>
) {
  return {
    ...baseComponents,
    ...components,

    // ========================================================================
    // Governance Components
    // ========================================================================
    StatusBadge,
    HashVerification,
    LedgerLink,
    SealedDocument,
    ConstitutionalCitation,
    ReferenceBenchmark,
    AmendmentHistory,

    // ========================================================================
    // Custom Components
    // ========================================================================
    APIReference,
    Cards,

    // ========================================================================
    // Diátaxis Components (Tailwind-Enhanced)
    // ========================================================================
    DocumentTypeBadge,
    DocumentTypeBanner,
    TutorialSteps,
    HowToGuide,
    ReferenceTable,
    ExplanationBox,
  }
}
