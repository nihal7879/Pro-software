import { format, formatDistanceToNow, parseISO } from 'date-fns'

/** Format a number as Indian Rupees. */
export function formatCurrency(value: number, compact = false): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? 'compact' : 'standard',
  }).format(value)
}

export function formatNumber(value: number, compact = false): string {
  return new Intl.NumberFormat('en-IN', {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatDate(date: string, pattern = 'dd MMM yyyy'): string {
  try {
    return format(parseISO(date), pattern)
  } catch {
    return date
  }
}

export function formatRelative(date: string): string {
  try {
    return formatDistanceToNow(parseISO(date), { addSuffix: true })
  } catch {
    return date
  }
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
