'use client'

import dynamic from 'next/dynamic'

// Dynamically import analytics (reduces initial bundle size)
const Analytics = dynamic(() => import('@vercel/analytics/react').then((mod) => ({ default: mod.Analytics })), {
  ssr: false,
})

const SpeedInsights = dynamic(() => import('@vercel/speed-insights/react').then((mod) => ({ default: mod.SpeedInsights })), {
  ssr: false,
})

export function AnalyticsWrapper() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
