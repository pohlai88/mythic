'use client'

// Example from https://beta.reactjs.org/learn
// Optimized with React best practices

import { useCallback, useState } from 'react'
import styles from './counters.module.css'

function MyButton() {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount((prev) => prev + 1)
  }, [])

  return (
    <div>
      <button onClick={handleClick} className={styles.counter} type="button">
        Clicked {count} times
      </button>
    </div>
  )
}

export default function MyApp() {
  return <MyButton />
}
