/** Smooth-scrolls to an element id, accounting for the sticky header via CSS scroll-padding. */
export function scrollToId(id: string, behavior: ScrollBehavior = 'smooth') {
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior, block: 'start' })
  return true
}
