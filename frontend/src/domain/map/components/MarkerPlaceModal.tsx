import { useState } from 'react'
import { useTripStore } from '../../trip/store/tripStore'
import { useMapStore } from '../store/mapStore'
import { useUpsertMarker } from '../hooks'

interface Props {
  lat: number
  lng: number
  onSuccess: () => void
  onCancel: () => void
}

export default function MarkerPlaceModal({ lat, lng, onSuccess, onCancel }: Props) {
  const [label, setLabel] = useState('')
  const selectedTripId = useTripStore((s) => s.selectedTripId)
  const selectedDayId = useTripStore((s) => s.selectedDayId)
  const incrementMarkerRefresh = useTripStore((s) => s.incrementMarkerRefresh)
  const setMarkerRegisterMode = useMapStore((s) => s.setMarkerRegisterMode)
  const { upsertMarker, isLoading } = useUpsertMarker()

  const handleConfirm = async () => {
    if (!selectedTripId || !selectedDayId) return
    await upsertMarker(selectedTripId, selectedDayId, {
      lat,
      lng,
      label: label.trim() || null,
    })
    incrementMarkerRefresh()
    setMarkerRegisterMode(false)
    onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h3 className="text-base font-semibold text-navy mb-3">마커 등록</h3>
        <div className="text-xs text-gray-400 mb-4 space-y-0.5 font-mono">
          <p>위도 {lat.toFixed(6)}</p>
          <p>경도 {lng.toFixed(6)}</p>
        </div>
        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 mb-1">레이블 (선택)</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="예) 호텔, 레스토랑, 카페..."
            maxLength={50}
            autoFocus
            onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm() }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-sky focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !selectedTripId || !selectedDayId}
            style={{ backgroundColor: '#0F2D5E' }}
            className="flex-1 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  )
}
