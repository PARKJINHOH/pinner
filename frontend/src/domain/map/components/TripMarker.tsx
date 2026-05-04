import { Marker, InfoWindow } from '@react-google-maps/api'
import type { TripMarkerData } from '../types'
import AuthImage from '../../../shared/components/AuthImage'

const MARKER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
]

interface Props {
  marker: TripMarkerData
  index: number
  isSelected: boolean
  onClick: (marker: TripMarkerData) => void
  onClose: () => void
  onViewPhotos: (dayId: number) => void
}

export default function TripMarker({ marker, index, isSelected, onClick, onClose, onViewPhotos }: Props) {
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
    >
      {isSelected && (
        <InfoWindow onCloseClick={onClose}>
          <div style={{ minWidth: 160, maxWidth: 200 }} className="text-sm font-sans p-3">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-semibold text-gray-800 truncate">{marker.dayName}</p>
              <button
                onClick={onClose}
                className="shrink-0 text-gray-400 hover:text-gray-600 leading-none -mt-0.5"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            {marker.thumbnailUrl && (
              <AuthImage
                src={marker.thumbnailUrl}
                alt={marker.dayName}
                className="w-full h-24 object-cover rounded mb-2"
              />
            )}
            {marker.date && (
              <p className="text-xs text-gray-500">{marker.date}</p>
            )}
            {marker.label && (
              <p className="text-xs text-gray-600 mt-1 truncate">{marker.label}</p>
            )}
            <button
              onClick={() => onViewPhotos(marker.dayId)}
              style={{ backgroundColor: '#0F2D5E' }}
              className="mt-2 w-full text-xs text-white rounded py-1 hover:opacity-90 transition-opacity"
            >
              사진 보기
            </button>
          </div>
        </InfoWindow>
      )}
    </Marker>
  )
}
