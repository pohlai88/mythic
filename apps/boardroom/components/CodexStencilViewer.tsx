/**
 * Codex Stencil Viewer Component
 *
 * Displays stencil definition with fields and validation rules
 */

'use client'

import { Card } from '@mythic/design-system'
import { cn } from '@mythic/shared-utils'
import type { StencilDefinition, StencilField } from '@/src/codex'

interface CodexStencilViewerProps {
  stencil: StencilDefinition | null
  className?: string
}

export function CodexStencilViewer({ stencil, className }: CodexStencilViewerProps) {
  if (!stencil) {
    return (
      <div className={cn('text-ash text-sm', className)}>
        No stencil selected
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-gold font-serif text-lg mb-2">{stencil.name}</h3>
        <div className="text-ash text-sm">
          Version {stencil.version} • ID: <span className="font-mono">{stencil.id}</span>
        </div>
      </div>

      <Card elevation="sm" className="p-4">
        <h4 className="text-parchment font-serif mb-3">Fields</h4>
        <div className="space-y-3">
          {stencil.fields.map((field) => (
            <FieldDefinition key={field.id} field={field} />
          ))}
        </div>
      </Card>

      <Card elevation="sm" className="p-4">
        <h4 className="text-parchment font-serif mb-3">Required Approvers</h4>
        <div className="flex flex-wrap gap-2">
          {stencil.requiredApprovers.map((approver) => (
            <span
              key={approver}
              className="px-3 py-1 bg-obsidian border border-gold rounded-xs text-gold text-sm font-mono"
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
    <div className="border-b border-charcoal pb-3 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-parchment font-medium">{field.label}</span>
        <div className="flex items-center gap-2">
          {field.required && (
            <span className="text-xs text-ember font-mono">REQUIRED</span>
          )}
          <span className="text-xs text-ash font-mono bg-obsidian px-2 py-1 rounded-xs">
            {field.type}
          </span>
        </div>
      </div>
      {field.validationRule && (
        <div className="text-xs text-ash font-mono mt-1">
          Rule: {field.validationRule}
        </div>
      )}
      {field.options && (
        <div className="text-xs text-ash mt-1">
          Options: {field.options.join(', ')}
        </div>
      )}
    </div>
  )
}
