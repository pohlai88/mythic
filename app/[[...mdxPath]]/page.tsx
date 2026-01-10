/**
 * Catch-All MDX Page Route
 *
 * Handles all MDX content from the content/ directory.
 * Following official Nextra 4 migration guide.
 *
 * @see https://the-guild.dev/blog/nextra-4
 */

import { generateStaticParamsFor, importPage } from 'nextra/pages'

// Generate static params for all MDX pages
export const generateStaticParams = generateStaticParamsFor('mdxPath')

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
