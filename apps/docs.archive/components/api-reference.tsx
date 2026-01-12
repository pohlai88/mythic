/**
 * API Reference Component
 *
 * Displays API endpoint documentation using design system tokens
 * and shared components
 *
 * Optimized with React.memo() for performance
 */

'use client'

import { memo, useMemo } from 'react'
import { cn } from '@mythic/shared-utils'
import { Card } from './shared'
import { Badge } from './shared'
import { tokens } from '../lib/design-tokens'
import { spacing } from '../lib/tailwind-utils'

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  description: string
  parameters?: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  response?: {
    status: number
    example: string
  }
}

interface APIReferenceProps {
  endpoints: APIEndpoint[]
}

/**
 * Map HTTP methods to status for intelligence-driven styling
 */
const methodToStatus: Record<string, 'APPROVED' | 'LISTENING' | 'VETOED'> = {
  GET: 'APPROVED',
  POST: 'APPROVED',
  PUT: 'LISTENING',
  DELETE: 'VETOED',
  PATCH: 'LISTENING',
}

// Memoized endpoint card component to prevent unnecessary re-renders
const EndpointCard = memo(function EndpointCard({ endpoint }: { endpoint: APIEndpoint }) {
  const status = methodToStatus[endpoint.method] || 'LISTENING'

  return (
    <Card
      key={`${endpoint.method}-${endpoint.path}`}
      status={status}
      className="overflow-hidden"
    >
            <Card.Header>
              <div className="flex flex-wrap items-center gap-3">
                <Badge status={status} size="sm">
                  {endpoint.method}
                </Badge>
                <code className="text-sm font-mono text-parchment">
                  {endpoint.path}
                </code>
              </div>
            </Card.Header>

            <Card.Content>
              <p className="mb-4 text-ash">{endpoint.description}</p>

              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-semibold text-parchment">Parameters:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={cn('border-b', tokens.borders.subtle)}>
                          <th className="px-2 py-2 text-left text-parchment">Name</th>
                          <th className="px-2 py-2 text-left text-parchment">Type</th>
                          <th className="px-2 py-2 text-left text-parchment">Required</th>
                          <th className="px-2 py-2 text-left text-parchment">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.parameters.map((param) => (
                          <tr
                            key={param.name}
                            className={cn('border-b', tokens.borders.subtle)}
                          >
                            <td className="px-2 py-2 font-mono text-ash">{param.name}</td>
                            <td className="px-2 py-2">
                              <Badge status="LISTENING" size="sm">
                                {param.type}
                              </Badge>
                            </td>
                            <td className="px-2 py-2">
                              {param.required ? (
                                <Badge status="VETOED" size="sm">
                                  Required
                                </Badge>
                              ) : (
                                <Badge status="LISTENING" size="sm">
                                  Optional
                                </Badge>
                              )}
                            </td>
                            <td className="px-2 py-2 text-ash">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {endpoint.response && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-parchment">Response:</h4>
                  <div className={cn('rounded-xs bg-void p-4', tokens.borders.default)}>
                    <div className="mb-2">
                      <Badge status="APPROVED" size="sm">
                        Status: {endpoint.response.status}
                      </Badge>
                    </div>
                    <pre className="overflow-x-auto text-xs">
                      <code className="font-mono text-parchment">
                        {endpoint.response.example}
                      </code>
                    </pre>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>
  )
})

export function APIReference({ endpoints }: APIReferenceProps) {
  // Memoize container classes
  const containerClasses = useMemo(
    () => cn('my-6 space-y-6', spacing.gap.md),
    []
  )

  return (
    <div className={containerClasses}>
      {endpoints.map((endpoint) => (
        <EndpointCard key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
      ))}
    </div>
  )
}
