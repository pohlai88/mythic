/**
 * Users Layout
 *
 * Layout for end users documentation section
 */

import Link from 'next/link'

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-void">
      <nav className="border-b border-charcoal bg-obsidian">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-serif font-bold text-parchment">
              ERP Docs
            </Link>
            <div className="flex gap-4">
              <Link href="/developers" className="text-ash hover:text-parchment">
                Developers
              </Link>
              <Link href="/users" className="text-ash hover:text-parchment">
                Users
              </Link>
              <Link href="/business" className="text-ash hover:text-parchment">
                Business
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
