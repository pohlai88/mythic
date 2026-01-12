/**
 * Guides Index Component
 *
 * Server component that generates guide cards from page map
 * Replaces Nextra's createIndexPage and getPageMap automation
 * 
 * UI: 100% Tailwind CSS (design system tokens)
 * Automation: Custom page map generation (replaces Nextra)
 */

import { getPageMap, createIndexPage } from '../lib/page-map'
import { Cards } from './Cards'

interface GuidesIndexProps {
  basePath?: string
}

export async function GuidesIndex({ basePath = '/guides' }: GuidesIndexProps) {
  const pageMap = await getPageMap(basePath)
  const cardItems = createIndexPage(pageMap)

  return <Cards items={cardItems} columns={3} />
}
