/**
 * Catch-All MDX Page Route
 *
 * Handles all MDX content from the content/ directory.
 * Following official Nextra 4 migration guide.
 *
 * @see https://the-guild.dev/blog/nextra-4
 */

import { importPage } from 'nextra/pages'

// Generate static params for all MDX pages
// Return empty array to avoid conflict with optional catch-all route
// This allows Next.js to handle routes dynamically at runtime
// The optional catch-all [[...mdxPath]] handles all routes including "/"
export async function generateStaticParams() {
  // Return empty array to prevent static generation conflicts
  // All routes will be handled dynamically by the optional catch-all
  return []
}

// Generate metadata for each page
export async function generateMetadata(props: { params: Promise<{ mdxPath?: string[] }> }) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

// Page component
export default async function Page(props: { params: Promise<{ mdxPath?: string[] }> }) {
  const params = await props.params
  const result = await importPage(params.mdxPath)
  const { default: MDXContent } = result

  return <MDXContent />
}
