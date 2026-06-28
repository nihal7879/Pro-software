/** Shared primitive and utility types used across the app. */

export type ID = string

export type ISODateString = string

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface QueryParams {
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  [key: string]: string | number | undefined
}

export interface SelectOption<T = string> {
  label: string
  value: T
  description?: string
}

/** Make selected keys optional. */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/** A trend metric used by KPI cards. */
export interface TrendValue {
  value: number
  delta: number
  direction: 'up' | 'down' | 'flat'
}
