import { useEffect, useRef } from 'react'
import { Animated, Easing, Image, Platform, StyleSheet, View, useWindowDimensions } from 'react-native'
import { useTheme, useThemedStyles } from '../../context/ThemeContext.jsx'

const fadeMask = require('../../assets/images/fade.png')

const FLAGS = [
  require('../../assets/images/flags/ax.png'),
  require('../../assets/images/flags/cz.png'),
  require('../../assets/images/flags/nl.png'),
  require('../../assets/images/flags/cx.png'),
  require('../../assets/images/flags/fr.png'),
  require('../../assets/images/flags/co.png'),
  require('../../assets/images/flags/cd.png'),
  require('../../assets/images/flags/bt.png'),
  require('../../assets/images/flags/no.png'),
  require('../../assets/images/flags/bg.png'),
  require('../../assets/images/flags/ca.png'),
  require('../../assets/images/flags/td.png'),
  require('../../assets/images/flags/cn.png'),
  require('../../assets/images/flags/cl.png'),
  require('../../assets/images/flags/fi.png'),
  require('../../assets/images/flags/ki.png'),
  require('../../assets/images/flags/ru.png'),
  require('../../assets/images/flags/pw.png'),
  require('../../assets/images/flags/gu.png'),
  require('../../assets/images/flags/in.png'),
  require('../../assets/images/flags/sz.png'),
  require('../../assets/images/flags/br.png'),
  require('../../assets/images/flags/jp.png'),
  require('../../assets/images/flags/za.png'),
]

// Medidas do mosaico do Figma, em um frame de 402 de largura
const FRAME_WIDTH = 402
const TILE_WIDTH = 98
const TILE_HEIGHT = 70
const TILE_GAP = 9
const FLAGS_PER_ROW = 12
const ROWS = 9
const SPEED = 24 // unidades do frame por segundo

// Cada fileira tem duas cópias iguais: ao terminar de deslocar uma, o loop recomeça sem emenda visível
function FlagRow({ index, scale }) {
  const styles = useThemedStyles(createStyles)
  const progress = useRef(new Animated.Value(0)).current
  const tileWidth = TILE_WIDTH * scale
  const tileHeight = TILE_HEIGHT * scale
  const gap = TILE_GAP * scale
  const rowWidth = FLAGS_PER_ROW * (tileWidth + gap)
  const movesLeft = index % 2 === 0

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: (FLAGS_PER_ROW * (TILE_WIDTH + TILE_GAP) * 1000) / SPEED,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      }),
    )
    animation.start()
    return () => animation.stop()
  }, [progress])

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: movesLeft ? [0, -rowWidth] : [-rowWidth, 0],
  })

  return (
    <Animated.View style={[styles.row, { gap, marginBottom: gap, transform: [{ translateX }] }]}>
      {Array.from({ length: FLAGS_PER_ROW * 2 }, (_, position) => (
        <Image
          key={position}
          source={FLAGS[(index * 7 + position % FLAGS_PER_ROW) % FLAGS.length]}
          style={{ width: tileWidth, height: tileHeight }}
        />
      ))}
    </Animated.View>
  )
}

// Carrossel inclinado de bandeiras do topo da tela inicial; o fade leva as bandeiras até o fundo
export default function FlagMosaic({ height = 360, fadeColor, style }) {
  const styles = useThemedStyles(createStyles)
  const { colors } = useTheme()
  const { width: screenWidth } = useWindowDimensions()
  const scale = screenWidth / FRAME_WIDTH

  return (
    <View style={[styles.container, { height }, style]} pointerEvents="none">
      {/* Largura e altura fixas: a inclinação gira em torno do centro da tela, não do centro das fileiras */}
      <View
        style={[
          styles.grid,
          {
            top: -100 * scale,
            left: -120 * scale,
            width: screenWidth + 240 * scale,
            height: ROWS * (TILE_HEIGHT + TILE_GAP) * scale,
          },
        ]}
      >
        {Array.from({ length: ROWS }, (_, index) => (
          <FlagRow key={index} index={index} scale={scale} />
        ))}
      </View>
      <Image source={fadeMask} resizeMode="stretch" tintColor={fadeColor ?? colors.background} style={styles.fade} />
    </View>
  )
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
      backgroundColor: colors.background,
    },
    grid: {
      position: 'absolute',
      transform: [{ rotate: '-10deg' }],
    },
    row: {
      flexDirection: 'row',
    },
    fade: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '45%',
    },
  })
