import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { MotionGlobalConfig } from 'framer-motion'

// Complete animations instantly in tests: deterministic, faster, and immune to fake-timer frame-loop stalls.
MotionGlobalConfig.skipAnimations = true

class IO {
  constructor(private cb: IntersectionObserverCallback) {}
  observe(el: Element) { this.cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], this as unknown as IntersectionObserver) }
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}
Object.assign(window, { IntersectionObserver: IO })
window.matchMedia ??= ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as never
window.scrollTo = (() => {}) as never
Element.prototype.scrollIntoView = () => {}

beforeEach(() => { sessionStorage.setItem('loader:seen', '1'); localStorage.clear() })
afterEach(() => cleanup())
