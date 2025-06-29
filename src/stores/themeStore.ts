import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  theme: 'light' | 'dark' | 'system'
  actualTheme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      actualTheme: 'light',

      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme })
        
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          
          root.classList.add(systemTheme)
          set({ actualTheme: systemTheme })
        } else {
          root.classList.add(theme)
          set({ actualTheme: theme })
        }
      }
    }),
    {
      name: 'theme-storage'
    }
  )
)

// Initialize theme
const { setTheme, theme } = useThemeStore.getState()
setTheme(theme)

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const { theme, setTheme } = useThemeStore.getState()
  if (theme === 'system') {
    setTheme('system')
  }
})