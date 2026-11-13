import { Image, Linking, StyleSheet, View } from 'react-native'
import PixelBox from '../PixelBox/PixelBox.jsx'
import PixelText from '../PixelText/PixelText.jsx'
import { useThemedStyles } from '../../context/ThemeContext.jsx'

const globeIcon = require('../../assets/icons/globe.png')

export default function MapButton({ url, onPress, style }) {
  const styles = useThemedStyles(createStyles)
  const handlePress = onPress ?? (url ? () => Linking.openURL(url) : undefined)

  return (
    <View style={[styles.row, style]}>
      <PixelBox style={styles.label} contentStyle={styles.labelContent} onPress={handlePress} accessibilityLabel="Ver no mapa">
        <PixelText>Ver no Mapa →</PixelText>
      </PixelBox>
      <PixelBox style={styles.iconBox} contentStyle={styles.labelContent} onPress={handlePress} accessibilityLabel="Ver no mapa">
        <Image source={globeIcon} style={styles.icon} />
      </PixelBox>
    </View>
  )
}

const createStyles = (colors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },
    label: {
      flex: 1,
      height: 56,
    },
    labelContent: {
      backgroundColor: colors.surfaceAlt,
    },
    iconBox: {
      width: 57,
      height: 57,
    },
    icon: {
      width: 42,
      height: 42,
    },
  })
