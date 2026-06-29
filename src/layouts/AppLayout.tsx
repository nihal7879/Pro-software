import { Outlet } from 'react-router-dom'
import { Sidebar, MobileSidebarContent } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { NotificationDrawer } from '@/components/layout/NotificationDrawer'
import { CommandSearch } from '@/components/layout/CommandSearch'
import { Drawer } from '@/components/ui/drawer'
import { useUiStore } from '@/store/ui.store'

export function AppLayout() {
  const { mobileSidebarOpen, setMobileSidebar } = useUiStore()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <Drawer
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebar(false)}
        side="left"
        widthClass="w-72"
      >
        <MobileSidebarContent />
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1500px] px-4 py-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      <NotificationDrawer />
      <CommandSearch />
    </div>
  )
}





























