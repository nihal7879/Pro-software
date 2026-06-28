import { Check, ChevronsUpDown, X } from 'lucide-react'
import { Dropdown } from '@/components/ui/dropdown'
import { cn } from '@/lib/utils'
import type { SelectOption } from '@/types'

interface MultiSelectProps {
  options: SelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, value, onChange, placeholder = 'Select…' }: MultiSelectProps) {
  const toggle = (val: string) =>
    onChange(value.includes(val) ? value.filter((v) => v !== val) : [...value, val])

  const selected = options.filter((o) => value.includes(o.value))

  return (
    <Dropdown
      align="start"
      className="w-[--trigger-width] min-w-[14rem] p-1.5"
      trigger={
        <button
          type="button"
          className="flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-card px-3 py-1.5 text-sm shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex flex-1 flex-wrap gap-1">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selected.map((o) => (
                <span
                  key={o.value}
                  className="inline-flex items-center gap-1 rounded-md bg-accent px-1.5 py-0.5 text-xs text-accent-foreground"
                >
                  {o.label}
                  <X
                    className="size-3 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggle(o.value)
                    }}
                  />
                </span>
              ))
            )}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      }
    >
      {() => (
        <div className="max-h-56 overflow-y-auto">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => toggle(o.value)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
            >
              {o.label}
              {value.includes(o.value) && <Check className={cn('size-4 text-primary')} />}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  )
}
