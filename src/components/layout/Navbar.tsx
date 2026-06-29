import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Moon, Search, Settings, Sun, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui/dropdown'
import { Badge } from '@/components/ui/badge'
import { useUiStore } from '@/store/ui.store'
import { useThemeStore } from '@/store/theme.store'
import { useAuthStore } from '@/store/auth.store'
import { useNotifications } from '@/hooks/useProcurement'
import { roleLabels } from '@/mocks/users'
import { paths } from '@/routes/paths'
import { toast } from '@/store/toast.store'

export function Navbar() {
  const navigate = useNavigate()
  const { setMobileSidebar, setNotifications, setSearch } = useUiStore()
  const { mode, toggle } = useThemeStore()
  const { currentUser, role, logout } = useAuthStore()
  const { data: notifications } = useNotifications()
  const unread = notifications?.filter((n) => !n.read).length ?? 0

  if (!currentUser || !role) return null

  const signOut = () => {
    logout()
    toast.info('Signed out', 'You have been logged out.')
    navigate(paths.login, { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-xl lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileSidebar(true)}
        aria-label="Open menu"
      >
        <Menu />
      </Button>

      <button
        onClick={() => setSearch(true)}
        className="flex h-10 flex-1 items-center gap-2.5 rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted sm:max-w-md"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search vendors, items, orders…</span>
        <kbd className="hidden rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <span className="hidden items-center gap-1.5 rounded-lg border border-input bg-muted/40 px-2.5 py-1.5 text-xs font-medium sm:inline-flex">
          <span className="text-muted-foreground">Role</span>
          <Badge tone="info">{roleLabels[role]}</Badge>
        </span>

        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {mode === 'dark' ? <Sun /> : <Moon />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setNotifications(true)}
          aria-label="Notifications"
        >
          <Bell />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>

        <Dropdown
          trigger={
            <button className="ml-1 flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted">
              <Avatar name={currentUser.name} size="sm" />
            </button>
          }
        >
          {(close) => (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar name={currentUser.name} />
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-semibold">{currentUser.name}</p>
                  <p className="max-w-[12rem] truncate text-xs text-muted-foreground">{currentUser.email}</p>
                </div>
              </div>
              <DropdownSeparator />
              <DropdownItem
                onClick={() => {
                  navigate(paths.profile)
                  close()
                }}
              >
                <User />
                My Profile
              </DropdownItem>
              <DropdownItem onClick={close}>
                <Settings />
                Settings
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                className="text-destructive hover:bg-destructive/10"
                onClick={() => {
                  close()
                  signOut()
                }}
              >
                <LogOut />
                Sign out
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>
    </header>
  )
}
