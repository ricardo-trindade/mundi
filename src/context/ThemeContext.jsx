import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { darkColors, lightColors } from '../components/theme.js'
import { KEYS, loadValue, saveValue } from '../services/storage.js'

const ThemeContext = createContext({
  mode: 'light',
  colors: lightColors,
  toggleTheme: () => {},
})

// O app sempre abre no modo claro, a menos que o usuário tenha escolhido o escuro antes (fica salvo)
export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadValue(KEYS.theme, 'light').then((saved) => {
      if (cancelled) return
      setMode(saved === 'dark' ? 'dark' : 'light')
      setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      mode,
      colors: mode === 'dark' ? darkColors : lightColors,
      toggleTheme: () => {
        const next = mode === 'dark' ? 'light' : 'dark'
        setMode(next)
        saveValue(KEYS.theme, next)
      },
    }),
    [mode],
  )

  if (!loaded) return null
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}

// Recebe uma função (colors) => StyleSheet declarada fora do componente
export function useThemedStyles(createStyles) {
  const { colors } = useTheme()
  return useMemo(() => createStyles(colors), [createStyles, colors])
}
