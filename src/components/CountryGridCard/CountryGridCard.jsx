import { Image, Pressable, StyleSheet, View } from 'react-native'
import { FavoriteIcon } from '../FavoriteButton/FavoriteButton.jsx'
import PixelBox from '../PixelBox/PixelBox.jsx'
import PixelText from '../PixelText/PixelText.jsx'

// Card da tela de favoritos (modo blocos): bandeira com coração no canto + nome
export default function CountryGridCard({ country, favorite = false, onPress, onToggleFavorite, style }) {
  const flagSource = country.flagSource ?? (country.flagUrl ? { uri: country.flagUrl } : null)

  return (
    <View style={[styles.card, style]}>
      <View>
        <PixelBox style={styles.flagBox} contentStyle={styles.flagContent} onPress={onPress} accessibilityLabel={country.name}>
          {flagSource ? <Image source={flagSource} style={styles.flag} /> : null}
        </PixelBox>
        <Pressable
          onPress={onToggleFavorite}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          accessibilityState={{ selected: favorite }}
          style={styles.heart}
        >
          <FavoriteIcon active={favorite} size={28} />
        </Pressable>
      </View>
      <PixelBox style={styles.nameBox} contentStyle={styles.nameContent} onPress={onPress}>
        <PixelText size={8} numberOfLines={3}>
          {country.name}
        </PixelText>
      </PixelBox>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    gap: 11,
  },
  flagBox: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  flagContent: {
    padding: 0,
    overflow: 'hidden',
  },
  flag: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  nameBox: {
    height: 44,
  },
  nameContent: {
    paddingHorizontal: 6,
  },
})
