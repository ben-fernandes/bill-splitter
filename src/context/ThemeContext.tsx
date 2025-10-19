import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  effectiveTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('bill-splitter-theme')
      return (saved as ThemeMode) || 'auto'
    } catch (error) {
      console.error('Error loading theme from localStorage:', error)
      return 'auto'
    }
  })

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Calculate effective theme
  const effectiveTheme: 'light' | 'dark' = mode === 'auto' ? systemTheme : mode

  // Apply theme to document using color-scheme for Tailwind v4
  useEffect(() => {
    document.documentElement.style.colorScheme = effectiveTheme
  }, [effectiveTheme])

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bill-splitter-theme', mode)
    } catch (error) {
      console.error('Error saving theme to localStorage:', error)
    }
  }, [mode])

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
