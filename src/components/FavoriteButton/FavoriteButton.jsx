import { Image, StyleSheet, View } from 'react-native'
import { useTheme } from '../../context/ThemeContext.jsx'
import PixelBox from '../PixelBox/PixelBox.jsx'

const heartFilled = require('../../assets/icons/heart-filled.png')
const heartOutline = require('../../assets/icons/heart-empty.png')

export default function FavoriteButton({ active = false, onPress, width = 48, height = 48, iconSize = 28, style }) {
  return (
    <PixelBox
      onPress={onPress}
      style={[{ width, height }, style]}
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityState={{ selected: active }}
    >
      <FavoriteIcon active={active} size={iconSize} />
    </PixelBox>
  )
}

export function FavoriteIcon({ active, size = 28, style }) {
  const { mode, colors } = useTheme()
  const box = { width: size, height: size }

  if (active) return <Image source={heartFilled} style={[box, styles.icon, style]} />

  // Coração vazio: no modo claro ganha miolo branco (senão some sobre bandeiras pretas);
  // no escuro é só o contorno na cor de ícone do tema
  return (
    <View style={[box, style]}>
      {mode === 'light' ? (
        <Image source={heartFilled} style={[box, styles.icon, styles.fill, { tintColor: colors.white }]} />
      ) : null}
      <Image source={heartOutline} style={[box, styles.icon, styles.fill, mode === 'dark' && { tintColor: colors.icon }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  icon: {
    resizeMode: 'contain',
  },
})
