import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToId } from '../../lib/scroll'

/** True when this page load was a browser refresh (F5 / reload button). */
const wasReload = () => {
  try {
    return (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type === 'reload'
  } catch {
    return false
  }
}

/**
 * Owns scroll position for the whole app.
 *  - The browser's own scroll restoration is switched off, so it can't fight us.
 *  - A refresh always starts at the top of the page (any #section is dropped from the URL).
 *  - A fresh visit to a link like /#services jumps straight to that section (shared links work).
 *  - Later navigations scroll to the #hash target (smoothly), or to the top.
 */
export default function ScrollManager() {
  const { pathname, search, hash, key } = useLocation()
  const initialKey = useRef(key)
  const strippedKey = useRef<string>()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    const initial = key === initialKey.current
    let target = hash

    if (initial && hash && (strippedKey.current === key || wasReload())) {
      // refresh: forget the section anchor so we land at the top, like a clean visit
      strippedKey.current = key
      history.replaceState(null, '', pathname + search)
      target = ''
    }

    if (!target) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      return
    }

    const id = target.slice(1)
    const behavior: ScrollBehavior = initial ? 'auto' : 'smooth'
    // wait for lazy routes / page transitions to mount the target
    let tries = 0
    const poll = window.setInterval(() => {
      if (scrollToId(id, behavior) || ++tries > 20) window.clearInterval(poll)
    }, 80)

    // on a fresh visit, re-align once images/fonts have settled and shifted the layout
    const realign = () => { scrollToId(id, 'auto') }
    const waitForLoad = initial && document.readyState !== 'complete'
    if (waitForLoad) window.addEventListener('load', realign, { once: true })

    return () => {
      window.clearInterval(poll)
      if (waitForLoad) window.removeEventListener('load', realign)
    }
  }, [pathname, search, hash, key])

  return null
}
