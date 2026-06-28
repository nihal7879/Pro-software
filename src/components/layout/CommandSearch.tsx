import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, Search } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { useUiStore } from '@/store/ui.store'
import { navigation } from '@/routes/navigation'
import { cn } from '@/lib/utils'

interface SearchEntry {
  label: string
  section: string
  to: string
}

const allEntries: SearchEntry[] = navigation.flatMap((s) =>
  s.items.map((i) => ({ label: i.label, section: s.title, to: i.to })),
)

export function CommandSearch() {
  const navigate = useNavigate()
  const { searchOpen, setSearch } = useUiStore()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearch(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setSearch])

  const results = useMemo(
    () =>
      query
        ? allEntries.filter((e) => e.label.toLowerCase().includes(query.toLowerCase()))
        : allEntries.slice(0, 6),
    [query],
  )

  const go = (to: string) => {
    navigate(to)
    setSearch(false)
    setQuery('')
  }

  return (
    <Modal open={searchOpen} onClose={() => setSearch(false)} size="lg">
      <div className="-m-5">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search className="size-5 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, modules…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">No results for “{query}”.</p>
          ) : (
            results.map((r) => (
              <button
                key={r.to}
                onClick={() => go(r.to)}
                className={cn(
                  'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent',
                )}
              >
                <span>
                  <span className="font-medium">{r.label}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{r.section}</span>
                </span>
                <CornerDownLeft className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100" />
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  )
}
