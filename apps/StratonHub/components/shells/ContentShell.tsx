/**
 * ContentShell - MDX/Documentation Prose Container
 *
 * DOCTRINE: This shell owns prose width and typography.
 * - Applies prose-axis utility (includes Silent Killers)
 * - Owns max-w-prose (single width owner)
 * - For MDX content only
 *
 * DO NOT use AxisHero or other page-level blocks inside ContentShell.
 * Use MDX-safe variants: DocCallout, DocCard, DocTable.
 *
 * NO className prop. Escape hatches are closed.
 */

interface ContentShellProps {
  children: React.ReactNode
  // NO className prop - contracts are closed
}

export function ContentShell({ children }: ContentShellProps) {
  return <article className="prose-axis mx-auto">{children}</article>
}
