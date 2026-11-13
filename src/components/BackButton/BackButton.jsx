import { Image, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext.jsx'

const circle = require('../../assets/icons/back-circle-surface.png')
const arrow = require('../../assets/icons/back-arrow.png')

export default function BackButton({ onPress, style }) {
  const { mode, colors } = useTheme()
  const dark = mode === 'dark'

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      {/* No modo escuro o disco vira menta sólido e a seta assume a cor do fundo */}
      <Image source={circle} style={[styles.circle, dark && { tintColor: colors.border }]} />
      <Image source={arrow} style={[styles.arrow, dark && { tintColor: colors.background }]} />
    </Pressable>
  )
}
const styles = StyleSheet.create({
  button: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  circle: {
    position: 'absolute',
    width: 35,
    height: 35,
  },
  arrow: {
    width: 10,
    height: 16,
    marginLeft: -2,
  },
})
