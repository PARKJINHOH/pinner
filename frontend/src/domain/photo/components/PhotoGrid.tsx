import AuthImage from '../../../shared/components/AuthImage'
import type { PhotoData } from '../types'

interface Props {
  photos: PhotoData[]
  onPhotoClick: (index: number) => void
  onPhotoDelete: (photo: PhotoData) => void
}

export default function PhotoGrid({ photos, onPhotoClick, onPhotoDelete }: Props) {
  if (photos.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">아직 사진이 없습니다</p>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1.5">
      {photos.map((photo, index) => (
        <div
          key={photo.photoId}
          className="relative aspect-square group cursor-pointer rounded-lg overflow-hidden bg-gray-100"
          onClick={() => onPhotoClick(index)}
        >
          <AuthImage
            src={photo.fileUrl}
            alt={photo.originalName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <button
            onClick={(e) => { e.stopPropagation(); onPhotoDelete(photo) }}
            className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs
              opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center leading-none"
          >
            ✕
          </button>
          {photo.hasGps && (
            <span className="absolute bottom-1 left-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              📍
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
