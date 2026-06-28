import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from '@/routes/AppRouter'
import { Toaster } from '@/components/common/Toaster'
import { queryClient } from '@/lib/queryClient'
import { useTheme } from '@/hooks/useTheme'

export function App() {
  useTheme()
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}
