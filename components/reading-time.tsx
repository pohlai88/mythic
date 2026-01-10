'use client'

interface ReadingTimeProps {
  words: number
  wpm?: number // Words per minute (default: 200)
}

export function ReadingTime({ words, wpm = 200 }: ReadingTimeProps) {
  const minutes = Math.ceil(words / wpm)
  const emoji = minutes < 5 ? '⚡' : minutes < 10 ? '📖' : '📚'

  return (
    <span className="text-sm text-gray-600 dark:text-gray-400">
      {emoji} {minutes} min read
    </span>
  )
}
