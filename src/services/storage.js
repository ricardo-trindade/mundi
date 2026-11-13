import AsyncStorage from '@react-native-async-storage/async-storage'

const KEYS = {
  theme: 'mundi:theme',
  favorites: 'mundi:favorites',
  favoritesView: 'mundi:favorites-view',
}

export { KEYS }

// Lê um valor JSON salvo; qualquer falha devolve o valor padrão
export async function loadValue(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export async function saveValue(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch {
    // sem espaço ou armazenamento indisponível: o app segue funcionando sem persistir
  }
}
