import { createContext, useContext, useEffect, useState } from 'react'
import { KEYS, loadValue, saveValue } from '../services/storage.js'

const FavoritesContext = createContext(null)

// Sem initialFavorites, os favoritos são lidos do armazenamento do aparelho e salvos a cada mudança.
// Com initialFavorites (prévia web), ficam só em memória.
export function FavoritesProvider({ children, initialFavorites }) {
  const persist = initialFavorites === undefined
  const [favorites, setFavorites] = useState(initialFavorites ?? [])
  const [loaded, setLoaded] = useState(!persist)

  useEffect(() => {
    if (!persist) return undefined
    let cancelled = false
    loadValue(KEYS.favorites, []).then((saved) => {
      if (cancelled) return
      setFavorites(Array.isArray(saved) ? saved : [])
      setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [persist])

  function toggleFavorite(country) {
    const isFavorite = favorites.some((favorite) => favorite.code === country.code)
    const next = isFavorite
      ? favorites.filter((favorite) => favorite.code !== country.code)
      : [...favorites, country]

    setFavorites(next)
    if (persist) saveValue(KEYS.favorites, next)
  }

  if (!loaded) return null

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error('useFavorites precisa ser usado dentro de FavoritesProvider')
  }

  return context
}
