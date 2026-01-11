/**
 * MDX Components Registry
 *
 * Required by Next.js App Router for MDX support.
 * Following official Nextra 4 migration guide.
 *
 * @see https://the-guild.dev/blog/nextra-4
 */

import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

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
import { CodeBlock } from './components/code-block'
import { Steps } from './components/steps'
import { Tabs } from './components/tabs'

// Get theme components
const docsComponents = getDocsMDXComponents()

export function useMDXComponents(
  // biome-ignore lint/suspicious/noExplicitAny: MDX components accept flexible prop types
  components?: Record<string, React.ComponentType<any>>
) {
  return {
    ...docsComponents,
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
    CodeBlock,
    Steps,
    Tabs,
  }
}
