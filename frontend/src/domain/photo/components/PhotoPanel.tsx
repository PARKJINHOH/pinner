import { useState } from 'react'
import { useTripStore } from '../../trip/store/tripStore'
import { useMapStore } from '../../map/store/mapStore'
import { useDeleteMarker } from '../../map/hooks'
import { usePhotos, useUploadPhotos, useDeletePhoto } from '../hooks'
import type { PhotoData } from '../types'
import PhotoUploader from './PhotoUploader'
import PhotoGrid from './PhotoGrid'
import PhotoViewer from './PhotoViewer'
import ConfirmModal from '../../../shared/components/ConfirmModal'
import { useAuthStore } from '../../../shared/store/authStore'

export default function PhotoPanel() {
  const isDemo = useAuthStore((s) => s.isDemo)
  const selectedTripId = useTripStore((s) => s.selectedTripId)
  const selectedDayId = useTripStore((s) => s.selectedDayId)
  const setSelectedDay = useTripStore((s) => s.setSelectedDay)
  const incrementMarkerRefresh = useTripStore((s) => s.incrementMarkerRefresh)

  const markers = useMapStore((s) => s.markers)
  const isMarkerRegisterMode = useMapStore((s) => s.isMarkerRegisterMode)
  const setMarkerRegisterMode = useMapStore((s) => s.setMarkerRegisterMode)

  const { photos, isLoading, refetch } = usePhotos(selectedTripId, selectedDayId)
  const { upload, isLoading: isUploading, error: uploadError, clearError } = useUploadPhotos()
  const { deletePhoto, isLoading: isDeleting } = useDeletePhoto()
  const { deleteMarker, isLoading: isDeletingMarker } = useDeleteMarker()

  const [viewerIndex, setViewerIndex] = useState<number | null>(null)
  const [photoToDelete, setPhotoToDelete] = useState<PhotoData | null>(null)
  const [showDeleteMarker, setShowDeleteMarker] = useState(false)

  if (!selectedDayId || !selectedTripId) return null

  const currentMarker = markers.find((m) => m.dayId === selectedDayId) ?? null

  // While register mode is active, show a slim indicator so map is usable
  if (isMarkerRegisterMode) {
    return (
      <div className="absolute top-0 right-0 z-20 w-full md:w-72 bg-white/95 shadow-2xl border-l border-gray-100 px-4 py-4">
        <p className="text-sm font-semibold text-navy mb-1">📍 마커 등록 중</p>
        <p className="text-xs text-gray-500 mb-3">지도를 클릭하여 위치를 선택하세요</p>
        <button
          onClick={() => setMarkerRegisterMode(false)}
          className="w-full text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg py-1.5 transition-colors"
        >
          취소
        </button>
      </div>
    )
  }

  const handleUpload = async (files: File[]) => {
    try {
      await upload(selectedTripId, selectedDayId, files)
      incrementMarkerRefresh()
      await refetch()
    } catch {
      // error shown via uploadError state
    }
  }

  const handleDeletePhotoConfirm = async () => {
    if (!photoToDelete) return
    if (viewerIndex !== null && photos[viewerIndex]?.photoId === photoToDelete.photoId) {
      setViewerIndex(null)
    }
    await deletePhoto(selectedTripId, selectedDayId, photoToDelete.photoId)
    setPhotoToDelete(null)
    incrementMarkerRefresh()
    await refetch()
  }

  const handleDeleteMarkerConfirm = async () => {
    await deleteMarker(selectedTripId, selectedDayId)
    setShowDeleteMarker(false)
    incrementMarkerRefresh()
  }

  const handleClose = () => {
    setSelectedDay(null)
    setViewerIndex(null)
  }

  return (
    <>
      {/* Right-side panel */}
      <div className="absolute top-0 right-0 h-full w-full md:w-80 bg-white shadow-2xl z-20 flex flex-col border-l border-gray-100">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-navy">사진</span>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Upload error */}
        {uploadError && (
          <div className="shrink-0 mx-3 mt-2 px-3 py-2 bg-red-50 rounded-lg flex items-center justify-between">
            <p className="text-xs text-red-600">{uploadError}</p>
            <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-2 text-xs">✕</button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
          {/* Marker section */}
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700">
                  {currentMarker ? '📍 마커 등록됨' : '📍 마커 없음'}
                </p>
                {currentMarker?.label && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{currentMarker.label}</p>
                )}
                {currentMarker?.isAuto && (
                  <p className="text-xs text-gray-400 mt-0.5">자동 (EXIF GPS)</p>
                )}
              </div>
              {!isDemo && (
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => setMarkerRegisterMode(true)}
                    style={{ backgroundColor: '#0F2D5E' }}
                    className="text-xs text-white px-2.5 py-1.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    {currentMarker ? '위치 수정' : '마커 등록'}
                  </button>
                  {currentMarker && (
                    <button
                      onClick={() => setShowDeleteMarker(true)}
                      className="text-xs text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Photo uploader */}
          {!isDemo && (
            <PhotoUploader
              onUpload={handleUpload}
              isLoading={isUploading}
              disabled={photos.length >= 10}
            />
          )}

          {isLoading ? (
            <p className="text-xs text-gray-400 text-center py-4">로딩 중...</p>
          ) : (
            <PhotoGrid
              photos={photos}
              onPhotoClick={(index) => setViewerIndex(index)}
              onPhotoDelete={isDemo ? () => {} : (photo) => setPhotoToDelete(photo)}
            />
          )}
        </div>
      </div>

      {/* Fullscreen viewer */}
      {viewerIndex !== null && photos.length > 0 && (
        <PhotoViewer
          photos={photos}
          currentIndex={Math.min(viewerIndex, photos.length - 1)}
          onClose={() => setViewerIndex(null)}
          onPrev={() => setViewerIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setViewerIndex((i) => Math.min(photos.length - 1, (i ?? 0) + 1))}
          onGoTo={(i) => setViewerIndex(i)}
          onDelete={isDemo ? () => {} : (photo) => { setViewerIndex(null); setPhotoToDelete(photo) }}
        />
      )}

      {/* Photo delete confirm */}
      {photoToDelete && (
        <ConfirmModal
          message="이 사진을 삭제하시겠습니까?"
          onConfirm={handleDeletePhotoConfirm}
          onCancel={() => setPhotoToDelete(null)}
          isLoading={isDeleting}
        />
      )}

      {/* Marker delete confirm */}
      {showDeleteMarker && (
        <ConfirmModal
          message="마커를 삭제하시겠습니까?"
          onConfirm={handleDeleteMarkerConfirm}
          onCancel={() => setShowDeleteMarker(false)}
          isLoading={isDeletingMarker}
        />
      )}
    </>
  )
}
