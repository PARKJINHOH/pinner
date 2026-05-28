import { useEffect } from 'react'
import AuthImage from '../../../shared/components/AuthImage'
import type { PhotoData } from '../types'

interface Props {
  photos: PhotoData[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onGoTo: (index: number) => void
  onDelete: (photo: PhotoData) => void
}

export default function PhotoViewer({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onGoTo,
  onDelete,
}: Props) {
  const photo = photos[currentIndex]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && currentIndex > 0) onPrev()
      else if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext, currentIndex, photos.length])

  if (!photo) return null

  const formattedDate = photo.exifTakenAt
    ? new Date(photo.exifTakenAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col" onClick={onClose}>
      {/* Header */}
      <div
        className="shrink-0 flex items-start justify-between px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-medium truncate">{photo.originalName}</p>
          {formattedDate && <p className="text-gray-400 text-xs mt-0.5">{formattedDate}</p>}
          {photo.hasGps && <p className="text-xs text-sky mt-0.5">📍 GPS 포함</p>}
        </div>
        <div className="flex items-center gap-3 ml-4 shrink-0">
          <span className="text-gray-400 text-xs">{currentIndex + 1} / {photos.length}</span>
          <button
            onClick={() => onDelete(photo)}
            className="text-gray-400 hover:text-red-400 transition-colors px-1"
            title="삭제"
          >
            🗑️
          </button>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-lg px-1 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 flex items-center justify-center relative min-h-0 px-12"
        onClick={(e) => e.stopPropagation()}
      >
        {currentIndex > 0 && (
          <button
            onClick={onPrev}
            className="absolute left-2 text-white/60 hover:text-white text-4xl px-2 py-8 transition-colors z-10"
          >
            ‹
          </button>
        )}

        <AuthImage
          src={photo.fileUrl}
          alt={photo.originalName}
          className="max-w-full max-h-full object-contain rounded"
        />

        {currentIndex < photos.length - 1 && (
          <button
            onClick={onNext}
            className="absolute right-2 text-white/60 hover:text-white text-4xl px-2 py-8 transition-colors z-10"
          >
            ›
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div
          className="shrink-0 flex gap-1.5 px-4 py-3 overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((p, i) => (
            <div
              key={p.photoId}
              className={`shrink-0 w-12 h-12 rounded overflow-hidden cursor-pointer transition-opacity
                ${i === currentIndex ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-80'}`}
              onClick={() => onGoTo(i)}
            >
              <AuthImage src={p.fileUrl} alt={p.originalName} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
