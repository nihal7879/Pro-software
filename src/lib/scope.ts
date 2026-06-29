import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types'

/** Department labels that represent organisation-wide data — visible to every role. */
const GLOBAL_DEPARTMENTS = ['All Departments and Wards', 'All Departments', 'Executive Office']

/**
 * Returns a function that scopes a list of records to what the current role may see.
 *
 * - Purchase and CEO see everything (organisation-wide visibility).
 * - HOD sees only records belonging to their own department, plus any
 *   organisation-wide records.
 *
 * Records without a department dimension (e.g. RFQs) are not narrowed here.
 */
export function useDepartmentScope() {
  const role = useAuthStore((s) => s.role)
  const department = useAuthStore((s) => s.currentUser?.department)

  return function scope<T>(rows: T[], getDepartment: (row: T) => string | undefined): T[] {
    if (role !== UserRole.HOD || !department) return rows
    return rows.filter((row) => {
      const dept = getDepartment(row)
      return !dept || dept === department || GLOBAL_DEPARTMENTS.includes(dept)
    })
  }
}
