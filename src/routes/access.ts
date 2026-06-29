import { UserRole } from '@/types'
import { navigation } from './navigation'
import { paths } from './paths'

const ALL: UserRole[] = [UserRole.Purchase, UserRole.HOD, UserRole.CEO]

/** Roles allowed on each route. Derived from the sidebar, plus extra
 *  (non-menu) routes such as create forms and detail pages. */
export const routeAccess: Record<string, UserRole[]> = {
  // create forms / sub-pages not present in the sidebar
  [paths.itemCreate]: [UserRole.Purchase],
  [paths.vendorProfile()]: [UserRole.Purchase, UserRole.CEO],
  [paths.materialRequestCreate]: [UserRole.Purchase],
  [paths.rfqCreate]: [UserRole.Purchase],
  [paths.rfqVendorSelection]: [UserRole.Purchase],
  [paths.comparisonWorksheet]: [UserRole.Purchase],
  [paths.vendorRecommendation]: [UserRole.Purchase, UserRole.HOD],
  [paths.newMaterialForm]: [UserRole.Purchase],
  [paths.rateRevisionForm]: [UserRole.Purchase],
  [paths.poCreate]: [UserRole.Purchase],
  [paths.poPreview()]: [UserRole.Purchase, UserRole.CEO],
  // common pages
  [paths.notifications]: ALL,
  [paths.profile]: ALL,
}

// Fold in everything declared in the sidebar.
for (const section of navigation) {
  for (const item of section.items) {
    routeAccess[item.to] = item.roles
  }
}

/** Default landing route for a role. */
export function defaultRouteForRole(role: UserRole): string {
  switch (role) {
    case UserRole.CEO:
      return paths.dashboardCeo
    case UserRole.HOD:
      return paths.dashboardHod
    default:
      return paths.dashboardPurchase
  }
}

/** Whether a role may access a given route path. */
export function canAccess(path: string, role: UserRole): boolean {
  const allowed = routeAccess[path]
  return !allowed || allowed.includes(role)
}
