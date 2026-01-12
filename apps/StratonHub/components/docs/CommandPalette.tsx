/**
 * Command Palette Component
 *
 * Cmd+K command palette for documentation search
 * Uses cmdk for command palette UI
 * Reference: https://cmdk.paco.me/
 */

'use client'

import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@mythic/shared-utils'

interface SearchResult {
  id: string
  title: string
  description?: string
  route: string
  audience: string
  module?: string
  type?: string
}

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      // Close on Escape
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open])

  // Search when query changes
  useEffect(() => {
    if (!open || !query.trim()) {
      setResults([])
      return
    }

    const performSearch = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`)
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(performSearch, 300)
    return () => clearTimeout(timeoutId)
  }, [query, open])

  const handleSelect = (route: string) => {
    router.push(route)
    setOpen(false)
    setQuery('')
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Command
          className={cn(
            'rounded-xs border border-charcoal bg-obsidian shadow-lg',
            'overflow-hidden'
          )}
        >
          <div className="flex items-center border-b border-charcoal px-4">
            <Command.Input
              placeholder="Search documentation... (Cmd+K)"
              value={query}
              onValueChange={setQuery}
              className={cn(
                'flex h-12 w-full bg-transparent text-parchment',
                'placeholder:text-ash outline-none',
                'text-sm'
              )}
            />
            <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-charcoal bg-void px-1.5 font-mono text-[10px] font-medium text-ash opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            {loading && (
              <Command.Loading>
                <div className="py-6 text-center text-sm text-ash">Searching...</div>
              </Command.Loading>
            )}
            {!loading && query && results.length === 0 && (
              <Command.Empty className="py-6 text-center text-sm text-ash">
                No results found.
              </Command.Empty>
            )}
            {!loading && !query && (
              <Command.Empty className="py-6 text-center text-sm text-ash">
                Type to search documentation...
              </Command.Empty>
            )}
            {!loading &&
              results.map((result) => (
                <Command.Item
                  key={result.id}
                  value={result.title}
                  onSelect={() => handleSelect(result.route)}
                  className={cn(
                    'flex flex-col gap-1 rounded-xs px-3 py-2',
                    'cursor-pointer',
                    'hover:bg-charcoal',
                    'aria-selected:bg-charcoal',
                    'outline-none'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-parchment">{result.title}</span>
                    <span className="text-xs text-ash capitalize">{result.audience}</span>
                  </div>
                  {result.description && (
                    <span className="text-xs text-ash line-clamp-1">{result.description}</span>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {result.module && (
                      <span className="text-xs px-2 py-0.5 rounded-xs bg-void text-ash">
                        {result.module}
                      </span>
                    )}
                    {result.type && (
                      <span className="text-xs px-2 py-0.5 rounded-xs bg-void text-ash">
                        {result.type}
                      </span>
                    )}
                  </div>
                </Command.Item>
              ))}
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
