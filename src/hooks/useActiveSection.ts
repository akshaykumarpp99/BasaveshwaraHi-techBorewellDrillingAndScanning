import { useEffect, useState } from 'react'

/** Returns the id of the section currently under the sticky header. */
export function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState('')
  useEffect(() => {
    if (!enabled) {
      setActive('')
      return
    }
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids.join(','), enabled]) // eslint-disable-line react-hooks/exhaustive-deps
  return active
}
