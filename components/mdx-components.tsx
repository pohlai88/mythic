import type { MDXComponents } from 'mdx/types'
import type React from 'react'
import { Accordion } from './accordion'
import { APIReference } from './api-reference'
import { Badge } from './badge'
import { Bleed } from './bleed'
import { Callout } from './callout'
import { Card } from './card'
import { CodeBlock } from './code-block'
import { FileTree } from './file-tree'
import { Npm2Yarn } from './npm2yarn'
import { Playground } from './playground'
import { ReadingTime } from './reading-time'
import { SocialShare } from './social-share'
import { Steps } from './steps'
import { Table } from './table'
import { Tabs } from './tabs'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Custom components available in MDX
    Callout,
    Tabs,
    Card,
    Badge,
    Accordion,
    CodeBlock,
    ReadingTime,
    SocialShare,
    APIReference,
    // Nextra built-in components
    Bleed,
    FileTree,
    Steps,
    Table,
    // Package manager switcher
    Npm2Yarn,
    // Interactive components
    Playground,
    // Override default components
    code: (props: React.HTMLAttributes<HTMLElement>) => {
      const { className, children, ...rest } = props
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''

      return language ? (
        <CodeBlock language={language} {...rest}>
          {children}
        </CodeBlock>
      ) : (
        <code className={className} {...rest}>
          {children}
        </code>
      )
    },
    // Spread existing components
    ...components,
  }
}
