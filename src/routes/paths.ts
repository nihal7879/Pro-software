/** Centralised route path constants. */
export const paths = {
  root: '/',
  login: '/login',
  dashboardPurchase: '/dashboard/purchase',
  dashboardHod: '/dashboard/hod',
  dashboardCeo: '/dashboard/ceo',
  notifications: '/notifications',
  profile: '/profile',

  itemMaster: '/masters/items',
  itemCreate: '/masters/items/new',
  vendorDirectory: '/vendors',
  vendorProfile: (id = ':id') => `/vendors/${id}`,
  departmentMaster: '/masters/departments',
  storeMaster: '/masters/stores',

  materialRequestList: '/procurement/material-requests',
  materialRequestCreate: '/procurement/material-requests/new',
  materialRequestApproval: '/approvals/material-requests',

  rfqList: '/procurement/rfq',
  rfqCreate: '/procurement/rfq/new',
  rfqVendorSelection: '/procurement/rfq/vendor-selection',

  comparisonList: '/procurement/comparison',
  comparisonWorksheet: '/procurement/comparison/worksheet',
  comparisonApproval: '/approvals/comparison',
  vendorRecommendation: '/procurement/comparison/recommendation',

  newMaterialList: '/procurement/new-material',
  newMaterialForm: '/procurement/new-material/new',
  hodReview: '/approvals/new-material/hod',
  ceoApproval: '/approvals/new-material/ceo',

  rateRevisionList: '/procurement/rate-revision',
  rateRevisionForm: '/procurement/rate-revision/new',
  rateRevisionApproval: '/approvals/rate-revision',

  poList: '/procurement/purchase-orders',
  poCreate: '/procurement/purchase-orders/new',
  poApproval: '/approvals/purchase-orders',
  poPreview: (id = ':id') => `/procurement/purchase-orders/${id}/preview`,

  spendAnalytics: '/analytics/spend',
  vendorPerformance: '/analytics/vendor-performance',
  procurementKpi: '/analytics/kpi',
  auditLog: '/analytics/audit-log',
} as const
