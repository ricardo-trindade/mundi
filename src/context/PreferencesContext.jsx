import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { KEYS, loadValue, saveValue } from '../services/storage.js'

const PreferencesContext = createContext({ favoritesView: 'grid', setFavoritesView: () => {} })

// Escolhas do usuário que precisam sobreviver ao fechar o app (hoje: blocos ou lista nos favoritos)
export function PreferencesProvider({ children }) {
  const [favoritesView, setFavoritesViewState] = useState('grid')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadValue(KEYS.favoritesView, 'grid').then((saved) => {
      if (cancelled) return
      setFavoritesViewState(saved === 'list' ? 'list' : 'grid')
      setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      favoritesView,
      setFavoritesView: (mode) => {
        setFavoritesViewState(mode)
        saveValue(KEYS.favoritesView, mode)
      },
    }),
    [favoritesView],
  )

  if (!loaded) return null
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  return useContext(PreferencesContext)
}
