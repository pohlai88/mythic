// Type declarations for Vercel Analytics and Speed Insights
// These help TypeScript resolve the package.json exports correctly

declare module '@vercel/analytics/react' {
  interface AnalyticsProps {
    beforeSend?: (event: { type: 'pageview' | 'event'; url: string }) => {
      type: 'pageview' | 'event'
      url: string
    } | null
    debug?: boolean
    mode?: 'auto' | 'development' | 'production'
    scriptSrc?: string
    endpoint?: string
    dsn?: string
    framework?: string
    route?: string | null
    path?: string | null
    basePath?: string
  }
  declare function Analytics(props: AnalyticsProps): null
  export { Analytics, type AnalyticsProps }
}

declare module '@vercel/speed-insights/react' {
  interface SpeedInsightsProps {
    dsn?: string
    sampleRate?: number
    route?: string | null
    beforeSend?: (data: { type: 'vital'; url: string; route?: string }) =>
      | { type: 'vital'; url: string; route?: string }
      | null
      | undefined
      | false
    debug?: boolean
    scriptSrc?: string
    endpoint?: string
    framework?: string
    basePath?: string
  }
  declare function SpeedInsights(props: SpeedInsightsProps): JSX.Element | null
  export { SpeedInsights }
}
