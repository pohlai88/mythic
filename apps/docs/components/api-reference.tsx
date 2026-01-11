'use client'
import { Badge } from './badge'

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

export function APIReference({ endpoints }: APIReferenceProps) {
  const methodColors = {
    GET: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    POST: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    PATCH: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  }

  return (
    <div className="my-6 space-y-6">
      {endpoints.map((endpoint) => (
        <div
          key={`${endpoint.method}-${endpoint.path}`}
          className="rounded-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <span
              className={`rounded px-2 py-1 text-xs font-semibold ${methodColors[endpoint.method]}`}
            >
              {endpoint.method}
            </span>
            <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
              {endpoint.path}
            </code>
          </div>

          <p className="mb-4 text-gray-700 dark:text-gray-300">{endpoint.description}</p>

          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-semibold">Parameters:</h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-2 py-2 text-left">Name</th>
                    <th className="px-2 py-2 text-left">Type</th>
                    <th className="px-2 py-2 text-left">Required</th>
                    <th className="px-2 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.parameters.map((param) => (
                    <tr key={param.name} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-2 py-2 font-mono">{param.name}</td>
                      <td className="px-2 py-2">
                        <Badge variant="info">{param.type}</Badge>
                      </td>
                      <td className="px-2 py-2">
                        {param.required ? (
                          <Badge variant="error">Required</Badge>
                        ) : (
                          <Badge variant="default">Optional</Badge>
                        )}
                      </td>
                      <td className="px-2 py-2">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {endpoint.response && (
            <div>
              <h4 className="mb-2 text-sm font-semibold">Response:</h4>
              <div className="rounded bg-gray-50 dark:bg-gray-800 p-4">
                <div className="mb-2">
                  <Badge variant="success">Status: {endpoint.response.status}</Badge>
                </div>
                <pre className="overflow-x-auto text-xs">
                  <code>{endpoint.response.example}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
