/**
 * Home Page
 *
 * Audience selection page for documentation
 */

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ERP Documentation',
  description: 'Comprehensive ERP system documentation',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-void text-parchment">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-serif font-bold mb-4">ERP Documentation</h1>
          <p className="text-xl text-ash mb-12">
            Comprehensive documentation for developers, end users, and business stakeholders
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Developers */}
            <Link
              href="/developers"
              className="block p-6 border border-charcoal rounded-xs bg-obsidian hover:border-gold transition-colors"
            >
              <h2 className="text-2xl font-serif font-bold mb-2">👨‍💻 Developers</h2>
              <p className="text-ash">
                API reference, architecture, and technical guides for developers building and
                integrating with the ERP system.
              </p>
            </Link>

            {/* Users */}
            <Link
              href="/users"
              className="block p-6 border border-charcoal rounded-xs bg-obsidian hover:border-gold transition-colors"
            >
              <h2 className="text-2xl font-serif font-bold mb-2">👥 End Users</h2>
              <p className="text-ash">
                User guides, tutorials, and how-to documentation for daily ERP system usage.
              </p>
            </Link>

            {/* Business */}
            <Link
              href="/business"
              className="block p-6 border border-charcoal rounded-xs bg-obsidian hover:border-gold transition-colors"
            >
              <h2 className="text-2xl font-serif font-bold mb-2">🏢 Business</h2>
              <p className="text-ash">
                Business overview, training materials, and compliance documentation for
                stakeholders.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
