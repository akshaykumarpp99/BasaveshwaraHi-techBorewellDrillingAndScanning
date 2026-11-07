import { Link, useLocation, type LinkProps } from 'react-router-dom'
import { scrollToId } from '../../lib/scroll'

/**
 * Router link that also works for in-page anchors ("/#services").
 * When already on the target page it smooth-scrolls (even if the hash is unchanged);
 * otherwise it navigates and <ScrollManager/> scrolls after the route renders.
 */
export default function HashLink({ to, onClick, ...rest }: LinkProps & { to: string }) {
  const { pathname } = useLocation()
  const [path, hash] = to.split('#')
  return (
    <Link
      to={to}
      {...rest}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || !hash) return
        if ((path || pathname) === pathname && scrollToId(hash)) {
          e.preventDefault()
          history.replaceState(null, '', `${pathname}#${hash}`)
        }
      }}
    />
  )
}
