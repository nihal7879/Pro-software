import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { PageLoader } from '@/components/common/Loader'
import { ProtectedRoute } from './ProtectedRoute'
import { defaultRouteForRole } from './access'
import { useAuthStore } from '@/store/auth.store'
import { paths } from './paths'

/** Sends an authenticated user to their role's dashboard, else to login. */
function RoleHome() {
  const { isAuthenticated, role } = useAuthStore()
  return <Navigate to={isAuthenticated && role ? defaultRouteForRole(role) : paths.login} replace />
}

const lazyPage = (factory: () => Promise<{ default: React.ComponentType }>) => lazy(factory)

// Dashboards
const DashboardPurchase = lazyPage(() => import('@/features/dashboard/DashboardPurchase'))
const DashboardHod = lazyPage(() => import('@/features/dashboard/DashboardHod'))
const DashboardCeo = lazyPage(() => import('@/features/dashboard/DashboardCeo'))
// Masters
const ItemMaster = lazyPage(() => import('@/features/items/ItemMaster'))
const ItemCreate = lazyPage(() => import('@/features/items/ItemCreate'))
const VendorDirectory = lazyPage(() => import('@/features/vendors/VendorDirectory'))
const VendorProfile = lazyPage(() => import('@/features/vendors/VendorProfile'))
const DepartmentMaster = lazyPage(() => import('@/features/masters/DepartmentMaster'))
const StoreMaster = lazyPage(() => import('@/features/masters/StoreMaster'))
// Procurement
const MaterialRequestList = lazyPage(() => import('@/features/procurement/MaterialRequestList'))
const MaterialRequestCreate = lazyPage(() => import('@/features/procurement/MaterialRequestCreate'))
const RfqList = lazyPage(() => import('@/features/procurement/RfqList'))
const RfqCreate = lazyPage(() => import('@/features/procurement/RfqCreate'))
const RfqVendorSelection = lazyPage(() => import('@/features/procurement/RfqVendorSelection'))
const ComparisonList = lazyPage(() => import('@/features/procurement/ComparisonList'))
const ComparisonWorksheet = lazyPage(() => import('@/features/procurement/ComparisonWorksheet'))
const VendorRecommendation = lazyPage(() => import('@/features/procurement/VendorRecommendation'))
const NewMaterialList = lazyPage(() => import('@/features/procurement/NewMaterialList'))
const NewMaterialForm = lazyPage(() => import('@/features/procurement/NewMaterialForm'))
const RateRevisionList = lazyPage(() => import('@/features/procurement/RateRevisionList'))
const RateRevisionForm = lazyPage(() => import('@/features/procurement/RateRevisionForm'))
const PoList = lazyPage(() => import('@/features/procurement/PoList'))
const PoCreate = lazyPage(() => import('@/features/procurement/PoCreate'))
const PoPreview = lazyPage(() => import('@/features/procurement/PoPreview'))
// Approvals
const MaterialRequestApproval = lazyPage(() => import('@/features/approvals/MaterialRequestApproval'))
const ComparisonApproval = lazyPage(() => import('@/features/approvals/ComparisonApproval'))
const HodReview = lazyPage(() => import('@/features/approvals/HodReview'))
const CeoApproval = lazyPage(() => import('@/features/approvals/CeoApproval'))
const RateRevisionApproval = lazyPage(() => import('@/features/approvals/RateRevisionApproval'))
const PoApproval = lazyPage(() => import('@/features/approvals/PoApproval'))
// Analytics
const SpendAnalytics = lazyPage(() => import('@/features/analytics/SpendAnalytics'))
const VendorPerformance = lazyPage(() => import('@/features/analytics/VendorPerformance'))
const ProcurementKpi = lazyPage(() => import('@/features/analytics/ProcurementKpi'))
const AuditLog = lazyPage(() => import('@/features/analytics/AuditLog'))
// Standalone
const Notifications = lazyPage(() => import('@/pages/Notifications'))
const Profile = lazyPage(() => import('@/pages/Profile'))
const NotFound = lazyPage(() => import('@/pages/NotFound'))
const Login = lazyPage(() => import('@/pages/Login'))

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={paths.login} element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<RoleHome />} />

          <Route path={paths.dashboardPurchase} element={<DashboardPurchase />} />
          <Route path={paths.dashboardHod} element={<DashboardHod />} />
          <Route path={paths.dashboardCeo} element={<DashboardCeo />} />

          <Route path={paths.itemMaster} element={<ItemMaster />} />
          <Route path={paths.itemCreate} element={<ItemCreate />} />
          <Route path={paths.vendorDirectory} element={<VendorDirectory />} />
          <Route path={paths.vendorProfile()} element={<VendorProfile />} />
          <Route path={paths.departmentMaster} element={<DepartmentMaster />} />
          <Route path={paths.storeMaster} element={<StoreMaster />} />

          <Route path={paths.materialRequestList} element={<MaterialRequestList />} />
          <Route path={paths.materialRequestCreate} element={<MaterialRequestCreate />} />
          <Route path={paths.rfqList} element={<RfqList />} />
          <Route path={paths.rfqCreate} element={<RfqCreate />} />
          <Route path={paths.rfqVendorSelection} element={<RfqVendorSelection />} />
          <Route path={paths.comparisonList} element={<ComparisonList />} />
          <Route path={paths.comparisonWorksheet} element={<ComparisonWorksheet />} />
          <Route path={paths.vendorRecommendation} element={<VendorRecommendation />} />
          <Route path={paths.newMaterialList} element={<NewMaterialList />} />
          <Route path={paths.newMaterialForm} element={<NewMaterialForm />} />
          <Route path={paths.rateRevisionList} element={<RateRevisionList />} />
          <Route path={paths.rateRevisionForm} element={<RateRevisionForm />} />
          <Route path={paths.poList} element={<PoList />} />
          <Route path={paths.poCreate} element={<PoCreate />} />
          <Route path={paths.poPreview()} element={<PoPreview />} />

          <Route path={paths.materialRequestApproval} element={<MaterialRequestApproval />} />
          <Route path={paths.comparisonApproval} element={<ComparisonApproval />} />
          <Route path={paths.hodReview} element={<HodReview />} />
          <Route path={paths.ceoApproval} element={<CeoApproval />} />
          <Route path={paths.rateRevisionApproval} element={<RateRevisionApproval />} />
          <Route path={paths.poApproval} element={<PoApproval />} />

          <Route path={paths.spendAnalytics} element={<SpendAnalytics />} />
          <Route path={paths.vendorPerformance} element={<VendorPerformance />} />
          <Route path={paths.procurementKpi} element={<ProcurementKpi />} />
          <Route path={paths.auditLog} element={<AuditLog />} />

            <Route path={paths.notifications} element={<Notifications />} />
            <Route path={paths.profile} element={<Profile />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
















































