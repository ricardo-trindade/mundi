import { PressStart2P_400Regular, useFonts } from '@expo-google-fonts/press-start-2p'
import * as NavigationBar from 'expo-navigation-bar'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import CountryResult from './pages/CountryResult/CountryResult.jsx'
import Favorites from './pages/Favorites/Favorites.jsx'
import Home from './pages/Home/Home.jsx'
import Splash from './pages/Splash/Splash.jsx'
import { findCountry } from './services/countriesApi.js'
import flagBrazil from './assets/images/flags/br.png'
import flagCanada from './assets/images/flags/ca.png'
import flagJapan from './assets/images/flags/jp.png'
import { PreferencesProvider } from './context/PreferencesContext.jsx'
import { ThemeProvider, useTheme, useThemedStyles } from './context/ThemeContext.jsx'

const PREVIEW_COUNTRIES = [
  {
    code: 'BRA',
    name: 'Brasil',
    flagSource: flagBrazil,
    capital: 'Brasília',
    population: '212.583.750',
    currency: 'Real (R$)',
    continent: 'América do Sul',
    language: 'Português',
    callingCode: '+55',
    area: '8.515.767 km²',
    areaKm: 8515767,
    coordinates: { lat: -15.79, lng: -47.88 },
    hemisphere: 'Sul Ocidental',
    mapUrl: 'https://www.google.com/maps?q=-15.79,-47.88',
  },
  {
    code: 'CAN',
    name: 'Canadá',
    flagSource: flagCanada,
    capital: 'Ottawa',
    population: '40.097.761',
    currency: 'Dólar canadense ($)',
    continent: 'América do Norte',
    language: 'Inglês',
    callingCode: '+1',
    area: '9.984.670 km²',
    areaKm: 9984670,
    coordinates: { lat: 45.42, lng: -75.69 },
    hemisphere: 'Norte Ocidental',
    mapUrl: 'https://www.google.com/maps?q=45.42,-75.69',
  },
  {
    code: 'JPN',
    name: 'Japão',
    flagSource: flagJapan,
    capital: 'Tóquio',
    population: '123.753.041',
    currency: 'Iene (¥)',
    continent: 'Ásia',
    language: 'Japonês',
    callingCode: '+81',
    area: '377.975 km²',
    areaKm: 377975,
    coordinates: { lat: 35.68, lng: 139.69 },
    hemisphere: 'Norte Oriental',
    mapUrl: 'https://www.google.com/maps?q=35.68,139.69',
  },
]

export default function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <AppContent />
      </PreferencesProvider>
    </ThemeProvider>
  )
}

function AppContent() {
  const styles = useThemedStyles(createStyles)
  const { mode, colors } = useTheme()
  const statusBarStyle = mode === 'dark' ? 'light' : 'dark'
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular })
  const isWebPreview = Platform.OS === 'web'
  const [previewFavorites, setPreviewFavorites] = useState(null)
  const [splashDone, setSplashDone] = useState(isWebPreview)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [showFavorites, setShowFavorites] = useState(isWebPreview)

  // A barra de gestos do Android aparecia como uma linha branca sobre o globo
  useEffect(() => {
    if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('hidden')
  }, [])

  useEffect(() => {
    if (!isWebPreview) return undefined

    let cancelled = false
    Promise.all(['Brasil', 'Canadá', 'Japão'].map((name) => findCountry(name)))
      .then((countries) => {
        if (countries.some((country) => !country)) {
          throw new Error('A API não retornou todos os países de demonstração.')
        }
        if (!cancelled) setPreviewFavorites(countries)
      })
      .catch((error) => {
        console.warn('Falha ao carregar os países pela API; usando dados locais de demonstração.', error.message)
        if (!cancelled) setPreviewFavorites(PREVIEW_COUNTRIES)
      })

    return () => {
      cancelled = true
    }
  }, [isWebPreview])

  return (
    <SafeAreaProvider>
      {isWebPreview && !previewFavorites ? (
        <View style={[styles.root, styles.previewState]}>
          <StatusBar style={statusBarStyle} />
          <ActivityIndicator color={colors.text} />
        </View>
      ) : (
        <FavoritesProvider initialFavorites={isWebPreview ? previewFavorites : undefined}>
          <View style={styles.root}>
            <StatusBar style={statusBarStyle} />
            {!splashDone ? <Splash onFinish={() => setSplashDone(true)} /> : null}
            {splashDone && fontsLoaded ? (
              selectedCountry ? (
                <CountryResult
                  country={selectedCountry}
                  onBack={() => setSelectedCountry(null)}
                  onSelectCountry={setSelectedCountry}
                />
              ) : showFavorites ? (
                <Favorites onBack={() => setShowFavorites(false)} onSelectCountry={setSelectedCountry} />
              ) : (
                <Home onSelectCountry={setSelectedCountry} onOpenFavorites={() => setShowFavorites(true)} />
              )
            ) : null}
          </View>
        </FavoritesProvider>
      )}
    </SafeAreaProvider>
  )
}

const createStyles = (colors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    previewState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
  })
