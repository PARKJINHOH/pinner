import { InfoWindow } from '@react-google-maps/api'
import type { TripMarkerData } from '../types'
import AuthImage from '../../../shared/components/AuthImage'

interface Props {
  marker: TripMarkerData
  onClose: () => void
  onViewPhotos: (dayId: number) => void
}

export default function MarkerInfoWindow({ marker, onClose, onViewPhotos }: Props) {
  return (
    <InfoWindow
      position={{ lat: marker.lat, lng: marker.lng }}
      onCloseClick={onClose}
      options={{ pixelOffset: new window.google.maps.Size(0, -24) }}
    >
      <div style={{ minWidth: 160, maxWidth: 200 }} className="text-sm font-sans">
        {marker.thumbnailUrl && (
          <AuthImage
            src={marker.thumbnailUrl}
            alt={marker.dayName}
            className="w-full h-24 object-cover rounded mb-2"
          />
        )}
        <p className="font-semibold text-gray-800 truncate">{marker.dayName}</p>
        {marker.date && (
          <p className="text-xs text-gray-500 mt-0.5">{marker.date}</p>
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
  )
}
