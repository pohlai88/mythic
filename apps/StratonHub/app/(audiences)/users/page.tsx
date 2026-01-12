/**
 * Users Hub Page
 *
 * Main page for end users documentation
 */

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'User Documentation',
  description: 'User guides, tutorials, and how-to documentation',
}

const modules = [
  'boardroom',
  'accounting',
  'finance',
  'crm',
  'manufacturing',
  'supply-chain',
  'procurement',
  'marketing',
  'investor-relations',
]

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-4xl font-serif font-bold mb-4">User Documentation</h1>
      <p className="text-ash mb-8">
        User guides, tutorials, and how-to documentation for daily ERP system usage.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold mb-4">ERP Modules</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {modules.map((module) => (
            <Link
              key={module}
              href={`/users/${module}`}
              className="block p-4 border border-charcoal rounded-xs bg-obsidian hover:border-gold transition-colors"
            >
              <h3 className="text-lg font-serif font-semibold mb-2 capitalize">{module}</h3>
              <p className="text-sm text-ash">User guide for {module} module</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/users/training"
          className="block p-6 border border-charcoal rounded-xs bg-obsidian hover:border-gold transition-colors"
        >
          <h2 className="text-2xl font-serif font-bold mb-2">Training</h2>
          <p className="text-ash">Training materials and onboarding guides</p>
        </Link>
      </div>
    </div>
  )
}
