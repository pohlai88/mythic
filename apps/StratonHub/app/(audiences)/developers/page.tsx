/**
 * Developers Hub Page
 *
 * Main page for developers documentation
 */

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Developers Documentation',
  description: 'API reference, architecture, and technical guides',
}

export default function DevelopersPage() {
  return (
    <div>
      <h1 className="text-4xl font-serif font-bold mb-4">Developers Documentation</h1>
      <p className="text-ash mb-8">
        API reference, architecture documentation, and technical guides for developers.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/developers/api"
          className="block p-6 border border-charcoal rounded-xs bg-obsidian hover:border-gold transition-colors"
        >
          <h2 className="text-2xl font-serif font-bold mb-2">API Reference</h2>
          <p className="text-ash">Complete API documentation for all ERP modules</p>
        </Link>

        <Link
          href="/developers/architecture"
          className="block p-6 border border-charcoal rounded-xs bg-obsidian hover:border-gold transition-colors"
        >
          <h2 className="text-2xl font-serif font-bold mb-2">Architecture</h2>
          <p className="text-ash">System architecture and design patterns</p>
        </Link>

        <Link
          href="/developers/guides"
          className="block p-6 border border-charcoal rounded-xs bg-obsidian hover:border-gold transition-colors"
        >
          <h2 className="text-2xl font-serif font-bold mb-2">Guides</h2>
          <p className="text-ash">Development guides and best practices</p>
        </Link>
      </div>
    </div>
  )
}
