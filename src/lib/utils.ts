import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Sleep helper used to simulate network latency in mock services. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Deterministic id generator for mock entities. */
export function makeId(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(4, '0')}`
}
