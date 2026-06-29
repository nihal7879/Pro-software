import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { navigation } from '@/routes/navigation'
import { useUiStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/types'

/** Sidebar sections with items the current role may access. */
function useVisibleNavigation() {
  const role = useAuthStore((s) => s.role)
  return navigation
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => role && item.roles.includes(role as UserRole)),
    }))
    .filter((section) => section.items.length > 0)
}

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex h-16 items-center gap-3 px-5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
        P
      </span>
      {!collapsed && (
        <div className="leading-tight">
          <p className="text-sm font-bold text-sidebar-foreground">Procura</p>
          <p className="text-[11px] text-sidebar-foreground/60">Saifee Hospital</p>
        </div>
      )}
    </div>
  )
}

function SidebarContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const sections = useVisibleNavigation()
  const [open, setOpen] = useState<Record<string, boolean>>(
    () => Object.fromEntries(navigation.map((s) => [s.title, true])),
  )

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
      {sections.map((section) => {
        const SectionIcon = section.icon
        const expanded = open[section.title]
        return (
          <div key={section.title}>
            <button
              onClick={() => setOpen((o) => ({ ...o, [section.title]: !o[section.title] }))}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground',
                collapsed && 'justify-center',
              )}
            >
              <SectionIcon className="size-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{section.title}</span>
                  <ChevronDown className={cn('size-3.5 transition-transform', !expanded && '-rotate-90')} />
                </>
              )}
            </button>
            {expanded && (
              <div className={cn('mt-0.5 space-y-0.5', !collapsed && 'ml-2 border-l border-sidebar-border pl-2')}>
                {section.items.map((item) => {
                  const ItemIcon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          collapsed && 'justify-center',
                          isActive
                            ? 'bg-sidebar-accent text-white'
                            : 'text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground',
                        )
                      }
                    >
                      {ItemIcon && <ItemIcon className="size-4 shrink-0" />}
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUiStore()

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 76 : 264 }}
      transition={{ type: 'spring', damping: 26, stiffness: 280 }}
      className="hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex"
    >
      <Logo collapsed={sidebarCollapsed} />
      <SidebarContent collapsed={sidebarCollapsed} />
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-white/5 hover:text-sidebar-foreground"
        >
          {sidebarCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  )
}

/** Sidebar rendered inside the mobile drawer (always expanded). */
export function MobileSidebarContent() {
  const setMobileSidebar = useUiStore((s) => s.setMobileSidebar)
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <Logo collapsed={false} />
      <SidebarContent collapsed={false} onNavigate={() => setMobileSidebar(false)} />
    </div>
  )
}
