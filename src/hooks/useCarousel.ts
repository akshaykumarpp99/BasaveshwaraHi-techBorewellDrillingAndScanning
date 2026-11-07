import { useCallback, useEffect, useState } from 'react'

/** Index state with optional autoplay that pauses on demand. */
export function useCarousel(length: number, { interval = 6000, paused = false } = {}) {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)

  const go = useCallback(
    (next: number) => {
      setDir(next >= index ? 1 : -1)
      setIndex(((next % length) + length) % length)
    },
    [index, length]
  )
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  useEffect(() => {
    if (paused || length < 2) return
    const id = window.setTimeout(next, interval)
    return () => window.clearTimeout(id)
  }, [index, paused, interval, length, next])

  return { index, dir, go, next, prev }
}
