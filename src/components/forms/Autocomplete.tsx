import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SelectOption } from '@/types'

interface AutocompleteProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function Autocomplete({ options, value, onChange, placeholder = 'Search…' }: AutocompleteProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const selectedLabel = options.find((o) => o.value === value)?.label ?? ''
  const filtered = useMemo(
    () => options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8),
    [options, query],
  )

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={open ? query : selectedLabel}
        placeholder={placeholder}
        onFocus={() => {
          setOpen(true)
          setQuery('')
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => setQuery(e.target.value)}
        className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1.5 max-h-56 w-full overflow-y-auto rounded-xl border border-border bg-card p-1.5 shadow-popover">
          {filtered.map((o) => (
            <button
              key={o.value}
              type="button"
              onMouseDown={() => {
                onChange(o.value)
                setOpen(false)
              }}
              className={cn(
                'flex w-full flex-col items-start rounded-lg px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground',
                o.value === value && 'bg-accent/60',
              )}
            >
              <span className="font-medium">{o.label}</span>
              {o.description && <span className="text-xs text-muted-foreground">{o.description}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
