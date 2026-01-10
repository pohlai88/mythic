'use client'

import { useMDXComponents } from '@/components/mdx-components'
import type { MDXComponents } from 'mdx/types'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

interface RemoteMDXProps {
  source: string | MDXRemoteSerializeResult
  components?: MDXComponents
}

/**
 * RemoteMDX component for rendering MDX content from remote sources.
 * Useful for dynamic content, CMS integration, or API-driven documentation.
 */
export async function RemoteMDX({ source, components }: RemoteMDXProps) {
  const defaultComponents = useMDXComponents({})
  const mdxSource = typeof source === 'string' ? await serialize(source) : source

  return <MDXRemote {...mdxSource} components={components || defaultComponents} />
}

/**
 * Serialize MDX content for remote rendering.
 */
export async function serializeMDX(content: string) {
  return serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  })
}
