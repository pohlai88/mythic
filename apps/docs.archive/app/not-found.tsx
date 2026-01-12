/**
 * Not Found Page (App Router)
 *
 * ELITE: Fully optimized with design system tokens, intelligence functions,
 * full responsive design, and enhanced accessibility.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */

import { Button } from '@mythic/design-system'
import { cn, intelligentStatusStyles } from '@mythic/shared-utils'
import { Link } from '@/components/shared'
import { transitions } from '@/lib/transitions'

export default function NotFound() {
  // ELITE: Intelligence-driven styling
  const errorStyles = intelligentStatusStyles('VETOED', 'border')

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-void px-4 py-8 sm:py-12 md:py-16"
      role="main"
      aria-label="Page not found"
    >
      <div className="w-full max-w-2xl text-center">
        {/* 404 Number - ELITE: Design system tokens, responsive sizing */}
        <h1
          className="mb-4 text-6xl font-bold text-ash/20 sm:text-7xl md:text-8xl lg:text-9xl"
          aria-label="404 error"
        >
          404
        </h1>

        {/* Error Message - ELITE: Design system tokens, responsive typography */}
        <h2 className="mb-4 font-serif text-2xl font-semibold text-parchment sm:text-3xl md:text-4xl">
          Page Not Found
        </h2>

        <p className="mb-8 text-base text-ash sm:text-lg md:text-xl">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons - ELITE: Design system Button component */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button variant="primary" size="md">
              Go to Homepage
            </Button>
          </Link>
        </div>

        {/* Helpful Links - ELITE: Design system tokens, enhanced hover states */}
        <div
          className={cn(
            'mt-8 sm:mt-12 border-t border-charcoal/30 pt-6 sm:pt-8',
            transitions.illuminate
          )}
        >
          <p className="mb-4 text-sm font-medium text-parchment sm:text-base">
            Popular Pages:
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { href: '/', label: 'Home' },
              { href: '/features', label: 'Features' },
              { href: '/api-example', label: 'API Reference' },
              { href: '/about', label: 'About' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                variant="primary"
                className="rounded-xs px-2 py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Search Suggestion - ELITE: Design system tokens, enhanced styling */}
        <div
          className={cn(
            'mt-6 sm:mt-8 rounded-lg border p-4 sm:p-6',
            errorStyles,
            transitions.illuminate,
            'bg-obsidian/30'
          )}
          role="complementary"
          aria-label="Search suggestion"
        >
          <p className="mb-3 text-sm text-ash sm:text-base">
            Try searching for what you need:
          </p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <kbd
              className="
                rounded-xs border border-charcoal/50 bg-void px-3 py-1.5
                text-xs font-mono text-parchment
                sm:text-sm
              "
            >
              Cmd/Ctrl + K
            </kbd>
            <span className="text-xs text-ash sm:text-sm">to open search</span>
          </div>
        </div>
      </div>
    </div>
  )
}
