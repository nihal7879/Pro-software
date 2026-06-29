import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { canAccess, defaultRouteForRole, routeAccess } from './access'
import { paths } from './paths'
import { toast } from '@/store/toast.store'

/** Lightweight path matcher supporting single ":param" segments. */
function matchPath(pattern: string, pathname: string): boolean {
  const pp = pattern.split('/')
  const ap = pathname.split('/')
  if (pp.length !== ap.length) return false
  return pp.every((seg, i) => seg.startsWith(':') || seg === ap[i])
}

/**
 * Gate for the authenticated app. Redirects to /login when signed out, and
 * blocks routes the current role is not permitted to access.
 */
export function ProtectedRoute() {
  const { isAuthenticated, role } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || !role) {
    return <Navigate to={paths.login} state={{ from: location.pathname }} replace />
  }

  const matchedPath = Object.keys(routeAccess).find((p) => matchPath(p, location.pathname))

  if (matchedPath && !canAccess(matchedPath, role)) {
    toast.warning('Access restricted', 'You do not have permission to view that page.')
    return <Navigate to={defaultRouteForRole(role)} replace />
  }

  return <Outlet />
}
