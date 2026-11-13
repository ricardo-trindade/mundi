import { useEffect, useMemo, useState } from 'react'
import { BackHandler, FlatList, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BackButton from '../../components/BackButton/BackButton.jsx'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog.jsx'
import CountryGridCard from '../../components/CountryGridCard/CountryGridCard.jsx'
import CountryListItem from '../../components/CountryListItem/CountryListItem.jsx'
import PixelText from '../../components/PixelText/PixelText.jsx'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import ViewToggle from '../../components/ViewToggle/ViewToggle.jsx'
import { useFavorites } from '../../context/FavoritesContext.jsx'
import { usePreferences } from '../../context/PreferencesContext.jsx'
import { useThemedStyles } from '../../context/ThemeContext.jsx'

function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
}

const GRID_GAP = 16

export default function Favorites({ onBack, onSelectCountry }) {
  const styles = useThemedStyles(createStyles)
  const insets = useSafeAreaInsets()
  const { favorites, toggleFavorite } = useFavorites()
  const [query, setQuery] = useState('')
  const [countryToRemove, setCountryToRemove] = useState(null)
  const [removalDialogVisible, setRemovalDialogVisible] = useState(false)
  const { favoritesView: viewMode, setFavoritesView: setViewMode } = usePreferences()
  const [listWidth, setListWidth] = useState(0)
  // Lista fixada ao abrir a tela: quem é desfavoritado continua visível, com o coração vazio
  const [listedCountries] = useState(favorites)
  const favoriteCodes = useMemo(() => new Set(favorites.map((favorite) => favorite.code)), [favorites])
  const filteredFavorites = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim())
    return listedCountries.filter((country) => normalizeText(country.name).includes(normalizedQuery))
  }, [listedCountries, query])
  const cardWidth = Math.max(0, (listWidth - GRID_GAP) / 2)

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack()
      return true
    })
    return () => subscription.remove()
  }, [onBack])

  function handleToggleFavorite(country) {
    if (favoriteCodes.has(country.code)) {
      setCountryToRemove(country)
      setRemovalDialogVisible(true)
    } else {
      toggleFavorite(country)
    }
  }

  function confirmRemoval() {
    toggleFavorite(countryToRemove)
    setRemovalDialogVisible(false)
  }

  function renderCountry({ item }) {
    const itemProps = {
      country: item,
      favorite: favoriteCodes.has(item.code),
      onPress: () => onSelectCountry(item),
      onToggleFavorite: () => handleToggleFavorite(item),
    }

    return viewMode === 'grid' ? (
      <CountryGridCard {...itemProps} style={{ width: cardWidth || '48%' }} />
    ) : (
      <CountryListItem {...itemProps} />
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <BackButton onPress={onBack} />
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </View>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Pesquisar nos favoritos"
        style={styles.search}
      />

      <FlatList
        key={viewMode}
        data={filteredFavorites}
        extraData={favorites}
        numColumns={viewMode === 'grid' ? 2 : 1}
        keyExtractor={(country) => country.code}
        renderItem={renderCountry}
        onLayout={({ nativeEvent }) => setListWidth(nativeEvent.layout.width)}
        contentContainerStyle={[
          viewMode === 'grid' ? styles.grid : styles.list,
          filteredFavorites.length === 0 && styles.emptyList,
        ]}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        ItemSeparatorComponent={() => (
          <View style={viewMode === 'grid' ? styles.gridSeparator : styles.separator} />
        )}
        ListEmptyComponent={
          <PixelText size={10} style={styles.emptyText}>
            {listedCountries.length === 0 && !query.trim()
              ? 'Você ainda não tem países favoritos.'
              : 'Nenhum favorito encontrado.'}
          </PixelText>
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      <ConfirmDialog
        visible={removalDialogVisible}
        message={`Tem certeza que quer tirar ${countryToRemove?.name} dos favoritos?`}
        confirmLabel="Tirar"
        onConfirm={confirmRemoval}
        onCancel={() => setRemovalDialogVisible(false)}
      />
    </View>
  )
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    search: {
      marginTop: 26,
    },
    list: {
      paddingTop: 24,
      paddingBottom: 24,
    },
    grid: {
      paddingTop: 24,
      paddingBottom: 24,
    },
    gridRow: {
      gap: GRID_GAP,
    },
    gridSeparator: {
      height: 22,
    },
    emptyList: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    emptyText: {
      paddingHorizontal: 8,
    },
    separator: {
      height: 14,
    },
  })
