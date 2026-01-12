/**
 * Business Hub Page
 *
 * Main page for business stakeholders documentation
 */

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Business Documentation',
  description: 'Business overview, training, and compliance documentation',
}

export default function BusinessPage() {
  return (
    <div>
      <h1 className="text-4xl font-serif font-bold mb-4">Business Documentation</h1>
      <p className="text-ash mb-8">
        Business overview, training materials, and compliance documentation for stakeholders.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/business/overview"
          className="block p-6 border border-charcoal rounded-xs bg-obsidian hover:border-gold transition-colors"
        >
          <h2 className="text-2xl font-serif font-bold mb-2">System Overview</h2>
          <p className="text-ash">ERP system capabilities, modules, and business value</p>
        </Link>

        <Link
          href="/business/training"
          className="block p-6 border border-charcoal rounded-xs bg-obsidian hover:border-gold transition-colors"
        >
          <h2 className="text-2xl font-serif font-bold mb-2">Training</h2>
          <p className="text-ash">Training materials and onboarding resources</p>
        </Link>

        <Link
          href="/business/compliance"
          className="block p-6 border border-charcoal rounded-xs bg-obsidian hover:border-gold transition-colors"
        >
          <h2 className="text-2xl font-serif font-bold mb-2">Compliance</h2>
          <p className="text-ash">Compliance documentation and audit trails</p>
        </Link>
      </div>
    </div>
  )
}
