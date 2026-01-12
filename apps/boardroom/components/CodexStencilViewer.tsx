/**
 * Codex Stencil Viewer Component
 *
 * Displays stencil definition with fields and validation rules
 */

'use client'

import { Card } from '@mythic/design-system'
import { cn, intelligentStatusStyles } from '@mythic/shared-utils'
import { spacing, typography, tokens, borders, margins, layout, buttons } from '@/src/lib'
import type { StencilDefinition, StencilField } from '@/src/codex'

interface CodexStencilViewerProps {
  stencil: StencilDefinition | null
  className?: string
}

export function CodexStencilViewer({ stencil, className }: CodexStencilViewerProps) {
  if (!stencil) {
    return (
      <div className={cn(typography.body.md, tokens.text.secondary, className)}>
        No stencil selected
      </div>
    )
  }

  return (
    <div className={cn(spacing.space.md, className)}>
      <div>
        <h3 className={cn(tokens.text.accent, typography.heading.sm, margins.bottom.sm)}>{stencil.name}</h3>
        <div className={cn(typography.body.md, tokens.text.secondary)}>
          Version {stencil.version} • ID: <span className={typography.mono.sm}>{stencil.id}</span>
        </div>
      </div>

      <Card elevation="sm" className={spacing.card}>
        <h4 className={cn(tokens.text.primary, typography.heading.sm, margins.bottom.md)}>Fields</h4>
        <div className={spacing.space.sm}>
          {stencil.fields.map((field) => (
            <FieldDefinition key={field.id} field={field} />
          ))}
        </div>
      </Card>

      <Card elevation="sm" className={spacing.card}>
        <h4 className={cn(tokens.text.primary, typography.heading.sm, margins.bottom.md)}>Required Approvers</h4>
        <div className={cn(layout.flexWrap, spacing.gap.sm)}>
          {stencil.requiredApprovers.map((approver) => (
            <span
              key={approver}
              className={intelligentStatusStyles('LISTENING', 'badge', cn(buttons.badge, 'px-3 py-1 text-sm'))}
            >
              {approver}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}

function FieldDefinition({ field }: { field: StencilField }) {
  return (
    <div className={cn(borders.bottom, 'pb-3 last:border-0')}>
      <div className={cn(layout.flexBetween, margins.bottom.sm)}>
        <span className={cn(tokens.text.primary, 'font-medium')}>{field.label}</span>
        <div className={cn(layout.flexCenter, spacing.gap.sm)}>
          {field.required && (
            <span className={cn(typography.mono.sm, tokens.text.warning)}>REQUIRED</span>
          )}
          <span className={cn(typography.mono.sm, tokens.text.secondary, tokens.background.surface, buttons.badge)}>
            {field.type}
          </span>
        </div>
      </div>
      {field.validationRule && (
        <div className={cn(typography.mono.sm, tokens.text.secondary, margins.top.sm)}>
          Rule: {field.validationRule}
        </div>
      )}
      {field.options && (
        <div className={cn(typography.body.sm, tokens.text.secondary, margins.top.sm)}>
          Options: {field.options.join(', ')}
        </div>
      )}
    </div>
  )
}
