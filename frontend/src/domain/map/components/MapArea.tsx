import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { GoogleMap, useJsApiLoader, Polyline } from '@react-google-maps/api'
import { useTripStore } from '../../trip/store/tripStore'
import { useMapStore } from '../store/mapStore'
import { useMarkers } from '../hooks'
import type { TripMarkerData } from '../types'
import TripMarker from './TripMarker'
import MarkerInfoWindow from './MarkerInfoWindow'
import MarkerPlaceModal from './MarkerPlaceModal'

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 }
const DEFAULT_ZOOM = 12
const BASE_OPTIONS: google.maps.MapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
}

export default function MapArea() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
    language: 'ko',
    region: 'KR',
  })

  const selectedTripId = useTripStore((s) => s.selectedTripId)
  const setSelectedDay = useTripStore((s) => s.setSelectedDay)

  const markers = useMapStore((s) => s.markers)
  const isMarkerRegisterMode = useMapStore((s) => s.isMarkerRegisterMode)
  const setMarkerRegisterMode = useMapStore((s) => s.setMarkerRegisterMode)

  useMarkers(selectedTripId) // syncs markers to mapStore

  const [selectedMarker, setSelectedMarker] = useState<TripMarkerData | null>(null)
  const [pendingLatLng, setPendingLatLng] = useState<{ lat: number; lng: number } | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)

  // 날짜 오름차순 정렬, 동일 날짜는 markerId 순 — polyline과 index 색상에 함께 사용
  const sortedMarkers = useMemo(() => {
    return [...markers].sort((a, b) => {
      if (a.date && b.date) {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
      } else if (a.date) return -1
      else if (b.date) return 1
      return a.markerId - b.markerId
    })
  }, [markers])


  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    map.setCenter(DEFAULT_CENTER)
    map.setZoom(DEFAULT_ZOOM)
  }, [])

  // fitBounds when markers change
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded || markers.length === 0) return
    if (markers.length === 1) {
      map.setCenter({ lat: markers[0].lat, lng: markers[0].lng })
      map.setZoom(14)
    } else {
      const bounds = new window.google.maps.LatLngBounds()
      markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }))
      map.fitBounds(bounds, 60)
    }
  }, [markers, isLoaded])

  // clear InfoWindow on trip change
  useEffect(() => {
    setSelectedMarker(null)
  }, [selectedTripId])

  // ESC exits register mode
  useEffect(() => {
    if (!isMarkerRegisterMode) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMarkerRegisterMode(false)
        setPendingLatLng(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMarkerRegisterMode, setMarkerRegisterMode])

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return
      if (isMarkerRegisterMode) {
        setPendingLatLng({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      } else {
        setSelectedMarker(null)
      }
    },
    [isMarkerRegisterMode]
  )

  const handleViewPhotos = (dayId: number) => {
    setSelectedDay(dayId)
    setSelectedMarker(null)
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-400 text-sm">지도 로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      {/* Register mode banner */}
      {isMarkerRegisterMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3
          bg-navy text-white text-xs px-4 py-2 rounded-full shadow-lg whitespace-nowrap pointer-events-auto">
          <span>📍 지도를 클릭하여 마커를 등록하세요</span>
          <button
            onClick={() => { setMarkerRegisterMode(false); setPendingLatLng(null) }}
            className="text-sky hover:text-white transition-colors"
          >
            취소
          </button>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        onLoad={onMapLoad}
        onClick={handleMapClick}
        options={{
          ...BASE_OPTIONS,
          draggableCursor: isMarkerRegisterMode ? 'crosshair' : undefined,
        }}
      >
        {/* 날짜순 여정 연결선 — 인접 마커 쌍마다 개별 segment, 처음↔끝 미연결 */}
        {sortedMarkers.slice(0, -1).map((marker, i) => (
          <Polyline
            key={`seg-${marker.markerId}-${sortedMarkers[i + 1].markerId}`}
            path={[
              { lat: marker.lat, lng: marker.lng },
              { lat: sortedMarkers[i + 1].lat, lng: sortedMarkers[i + 1].lng },
            ]}
            options={{
              strokeColor: '#2563EB',
              strokeOpacity: 0.55,
              strokeWeight: 2,
              geodesic: true,
            }}
          />
        ))}

        {sortedMarkers.map((marker, index) => (
          <TripMarker
            key={marker.markerId}
            marker={marker}
            index={index}
            isSelected={selectedMarker?.markerId === marker.markerId}
            onClick={isMarkerRegisterMode ? () => {} : setSelectedMarker}
          />
        ))}

        {selectedMarker && !isMarkerRegisterMode && (
          <MarkerInfoWindow
            marker={selectedMarker}
            onClose={() => setSelectedMarker(null)}
            onViewPhotos={handleViewPhotos}
          />
        )}
      </GoogleMap>

      {/* Marker placement confirmation modal */}
      {pendingLatLng && (
        <MarkerPlaceModal
          lat={pendingLatLng.lat}
          lng={pendingLatLng.lng}
          onSuccess={() => setPendingLatLng(null)}
          onCancel={() => {
            setPendingLatLng(null)
            setMarkerRegisterMode(false)
          }}
        />
      )}
    </div>
  )
}
