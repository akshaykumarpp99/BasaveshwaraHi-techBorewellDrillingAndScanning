import { createContext, useContext } from 'react'

/**
 * Whether scroll-triggered / decorative motion (reveals, parallax, timeline draw, wave drift) is on
 * for the current page. Defaults to on; the home page switches it off to stay perfectly still.
 */
export const PageMotion = createContext(true)
export const usePageMotion = () => useContext(PageMotion)
