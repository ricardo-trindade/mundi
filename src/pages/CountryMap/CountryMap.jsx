import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import BackButton from '../../components/BackButton/BackButton.jsx'
import PixelBox from '../../components/PixelBox/PixelBox.jsx'
import PixelText from '../../components/PixelText/PixelText.jsx'
import { useTheme, useThemedStyles } from '../../context/ThemeContext.jsx'

// Medidas da tela de mapa do Figma, em um frame de 402 de largura
const FRAME_WIDTH = 402
const MAX_SCALE = 1.25 // evita elementos gigantes em tablet e web
const DEFAULT_ZOOM = 4

// No Figma o Brasil (8,5 milhões de km²) aparece com zoom ~3,3; países menores ganham mais zoom
function zoomForArea(areaKm) {
  if (!areaKm) return DEFAULT_ZOOM
  return Math.min(10, Math.max(2, 10.2 - Math.log10(areaKm)))
}

function buildMapHtml({ name, coordinates, areaKm }, dark) {
  const options = JSON.stringify({ name, lat: coordinates.lat, lng: coordinates.lng, zoom: zoomForArea(areaKm) }).replace(
    /</g,
    '\\u003c',
  )

  return `<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" />
<style>
  html, body, #map { height: 100%; margin: 0; background: ${dark ? '#0F1823' : '#A6D5EA'}; }
  .leaflet-popup-content-wrapper, .leaflet-popup-tip { background: ${dark ? '#1E2B3A' : '#141414'}; color: ${dark ? '#E8FFF8' : '#FFFFFF'}; box-shadow: none; }
  .leaflet-popup-content-wrapper { border-radius: 0; }
  .leaflet-popup-content { margin: 16px 34px 16px 18px; font: 11px/1.4 'Press Start 2P', monospace; }
  .leaflet-container a.leaflet-popup-close-button { color: #8A8A8A; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
  integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script>
  const options = ${options};
  const map = L.map('map', { zoomControl: false, zoomSnap: 0 }).setView([options.lat, options.lng], options.zoom);
  L.tileLayer(${dark ? `'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',` : `'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',`}
    maxZoom: 18,
  }).addTo(map);
  const label = document.createElement('span');
  label.textContent = options.name;
  // Posição do pino no Figma: 57% da largura e 36% da altura da tela
  const size = map.getSize();
  map.panBy([size.x * (0.5 - 0.57), size.y * (0.5 - 0.36)], { animate: false });
  L.marker([options.lat, options.lng]).addTo(map).bindPopup(label, { autoPan: false }).openPopup();
</script>
</body>
</html>`
}

export default function CountryMap({ country, onBack }) {
  const styles = useThemedStyles(createStyles)
  const { mode } = useTheme()
  const insets = useSafeAreaInsets()
  const { width: screenWidth } = useWindowDimensions()
  const scale = Math.min(screenWidth / FRAME_WIDTH, MAX_SCALE)

  return (
    <View style={styles.screen}>
      <WebView
        key={mode}
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: buildMapHtml(country, mode === 'dark') }}
        accessibilityLabel={`Mapa de ${country.name}`}
      />
      <BackButton
        onPress={onBack}
        style={[styles.back, { top: insets.top + 12 * scale, left: 16 * scale }]}
      />
      <PixelBox
        style={[
          styles.title,
          { top: insets.top + 13 * scale, left: 94 * scale, width: 213 * scale, height: 38 * scale },
        ]}
      >
        <PixelText size={10}>Localização</PixelText>
      </PixelBox>
    </View>
  )
}

const createStyles = (colors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    map: {
      flex: 1,
    },
    back: {
      position: 'absolute',
    },
    title: {
      position: 'absolute',
    },
  })
