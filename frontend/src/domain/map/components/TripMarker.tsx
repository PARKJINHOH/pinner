import { Marker } from '@react-google-maps/api'
import type { TripMarkerData } from '../types'

const MARKER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
]

interface Props {
  marker: TripMarkerData
  index: number
  isSelected: boolean
  onClick: (marker: TripMarkerData) => void
}

export default function TripMarker({ marker, index, isSelected, onClick }: Props) {
  const color = MARKER_COLORS[index % MARKER_COLORS.length]

  return (
    <Marker
      position={{ lat: marker.lat, lng: marker.lng }}
      icon={{
        path: google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? 12 : 9,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      }}
      animation={isSelected ? google.maps.Animation.BOUNCE : undefined}
      onClick={(e) => { e?.stop(); onClick(marker) }}
      title={marker.label ?? marker.dayName}
    />
  )
}
