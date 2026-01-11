'use client'

import React from 'react'

interface StepsProps {
  children: React.ReactNode
}

/**
 * Steps component transforms headings into a visual step-by-step guide.
 * Each h3 heading becomes a step.
 */
export function Steps({ children }: StepsProps) {
  const childrenArray = React.Children.toArray(children)
  const steps: Array<{ title: string; content: React.ReactNode[] }> = []
  let currentStep: { title: string; content: React.ReactNode[] } | null = null

  childrenArray.forEach((child) => {
    if (React.isValidElement(child) && child.type === 'h3') {
      if (currentStep) {
        steps.push(currentStep)
      }
      currentStep = {
        title: typeof child.props.children === 'string' ? child.props.children : 'Step',
        content: [],
      }
    } else if (currentStep) {
      currentStep.content.push(child)
    }
  })

  if (currentStep) {
    steps.push(currentStep)
  }

  return (
    <div className="my-8">
      {steps.map((step, index) => (
        <div key={`step-${step.title}-${index}`} className="relative mb-8 last:mb-0">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500 text-sm font-semibold text-white">
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="mt-2 h-full w-0.5 bg-gray-300 dark:bg-gray-600" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">{step.content}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
