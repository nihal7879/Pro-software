import { useEffect } from 'react'
import { useThemeStore } from '@/store/theme.store'

/** Applies the persisted theme to the document root. */
export function useTheme(): void {
  const mode = useThemeStore((s) => s.mode)
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
  }, [mode])
}
