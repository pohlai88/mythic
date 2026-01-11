/**
 * Remote Docs: GraphQL Yoga
 *
 * Loads documentation from remote GitHub repository.
 * Optimized with Next.js 16 and Nextra 4 best practices:
 * - ISR (Incremental Static Regeneration) with revalidation
 * - Proper metadata generation for SEO
 * - Optimized fetch with caching
 * - Enhanced error handling
 * - Type-safe configuration
 *
 * @see https://the-guild.dev/blog/nextra-4
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { compileMdx } from 'nextra/compile'
import { Callout, Tabs } from 'nextra/components'
import { evaluate } from 'nextra/evaluate'
import { convertToPageMap, mergeMetaWithPageMap, normalizePageMap } from 'nextra/page-map'
import { useMDXComponents } from '../../../../mdx-components'
import config from '../../../../nextra-remote-filepaths/graphql-yoga.json'

// Type-safe configuration
interface RemoteDocsConfig {
  user: string
  repo: string
  branch: string
  docsPath: string
  filePaths: string[]
}

const { branch, docsPath, filePaths, repo, user } = config as RemoteDocsConfig

// Convert file paths to page map structure
const { mdxPages, pageMap: _pageMap } = convertToPageMap({
  filePaths,
  basePath: 'remote/graphql-yoga',
})

// Merge metadata with page map for sidebar navigation
// Using empty meta object to let page map auto-generate structure
// Remote docs are currently disabled in app/layout.tsx
const yogaPageMap = _pageMap[0]
  ? mergeMetaWithPageMap(_pageMap[0], {})
  : { name: 'graphql-yoga', route: '/remote/graphql-yoga', children: [] }

export const pageMap = normalizePageMap(yogaPageMap)

// Get MDX components with custom components
// Following official Nextra 4 documentation pattern
const { wrapper: Wrapper, ...components } = useMDXComponents({
  // biome-ignore lint/style/useNamingConvention: $Tabs is Nextra convention
  $Tabs: Tabs,
  // biome-ignore lint/style/useNamingConvention: Callout is a component name from nextra/components
  // biome-ignore lint/suspicious/noExplicitAny: Callout component accepts flexible props
  Callout: Callout as React.ComponentType<any>,
})

/**
 * Build GitHub raw content URL
 */
function buildGitHubUrl(filePath: string): string {
  return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${docsPath}${filePath}`
}

/**
 * Fetch MDX content from GitHub with optimized caching
 *
 * Uses Next.js fetch caching with ISR:
 * - Revalidates every hour (3600 seconds)
 * - Caches in CDN for performance
 * - Handles errors gracefully
 */
async function fetchMdxContent(filePath: string): Promise<string> {
  const url = buildGitHubUrl(filePath)

  const response = await fetch(url, {
    // Next.js fetch caching with ISR
    next: {
      revalidate: 3600, // Revalidate every hour
    },
    headers: {
      // biome-ignore lint/style/useNamingConvention: HTTP headers use PascalCase
      Accept: 'text/markdown, text/plain',
      'User-Agent': 'Nextra-Docs-Bot/1.0',
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      notFound()
    }
    throw new Error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`)
  }

  return response.text()
}

/**
 * Generate metadata for SEO and social sharing
 *
 * Extracts metadata from MDX frontmatter or uses defaults.
 */
export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const route = (params.slug || []).join('/')
  const filePath = mdxPages[route]

  if (!filePath) {
    return {
      title: 'Not Found',
      description: 'Page not found',
    }
  }

  try {
    const data = await fetchMdxContent(filePath)
    const rawJs = await compileMdx(data, { filePath })
    const { metadata } = evaluate(rawJs, components)

    return {
      title: metadata?.title || 'GraphQL Yoga Documentation',
      description:
        metadata?.description ||
        'Comprehensive documentation for GraphQL Yoga - a fully-featured GraphQL server',
      keywords: [
        'GraphQL',
        'Yoga',
        'GraphQL Server',
        'API',
        'Documentation',
        ...(metadata?.keywords || []),
      ],
      openGraph: {
        title: metadata?.title || 'GraphQL Yoga Documentation',
        description: metadata?.description || 'Comprehensive documentation for GraphQL Yoga',
        type: 'article',
        url: `https://nexuscanon.dev/remote/graphql-yoga/${route}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata?.title || 'GraphQL Yoga Documentation',
        description: metadata?.description || 'Comprehensive documentation for GraphQL Yoga',
      },
    }
  } catch (error) {
    console.error(`Error generating metadata for ${filePath}:`, error)
    return {
      title: 'GraphQL Yoga Documentation',
      description: 'Documentation for GraphQL Yoga',
    }
  }
}

/**
 * Remote Docs Page Component
 *
 * Fetches MDX content from GitHub and renders it with optimized caching.
 * Uses ISR for automatic revalidation every hour.
 */
export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const route = (params.slug || []).join('/')
  const filePath = mdxPages[route]

  if (!filePath) {
    notFound()
  }

  try {
    // Fetch MDX content with optimized caching
    const data = await fetchMdxContent(filePath)

    // Compile MDX to JavaScript
    const rawJs = await compileMdx(data, { filePath })

    // Evaluate with components
    const result = evaluate(rawJs, components)
    const { default: MDXContent, toc, metadata, sourceCode } = result

    return (
      <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
        <MDXContent />
      </Wrapper>
    )
  } catch (error) {
    console.error(`Error rendering page ${route}:`, error)
    notFound()
  }
}

/**
 * Generate static params for all remote docs routes
 *
 * Pre-generates static pages at build time for better performance.
 * Next.js will use ISR to update pages incrementally.
 */
export function generateStaticParams() {
  return Object.keys(mdxPages).map((route) => ({
    ...(route && { slug: route.split('/') }),
  }))
}

/**
 * Revalidation configuration for ISR
 *
 * Pages will be regenerated at most once per hour.
 * This balances freshness with performance.
 */
export const revalidate = 3600 // 1 hour
