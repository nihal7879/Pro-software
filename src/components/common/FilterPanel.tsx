import { SlidersHorizontal } from 'lucide-react'
import { Dropdown } from '@/components/ui/dropdown'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FilterOption {
  label: string
  value: string
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
}

export function FilterPanel({ groups }: { groups: FilterGroup[] }) {
  const activeCount = groups.filter((g) => g.value !== 'all').length

  return (
    <Dropdown
      align="end"
      className="w-64 p-3"
      trigger={
        <Button variant="outline" size="sm">
          <SlidersHorizontal />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      }
    >
      {() => (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id}>
              <p className="mb-1.5 text-xs font-semibold text-muted-foreground">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => group.onChange(opt.value)}
                    className={cn(
                      'rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                      group.value === opt.value
                        ? 'border-primary bg-accent text-accent-foreground'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Dropdown>
  )
}
