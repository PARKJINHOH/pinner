import { useCallback, useEffect, useState } from 'react'
import { photoService } from '../services'
import type { PhotoData } from '../types'

export function usePhotos(tripId: number | null, dayId: number | null) {
  const [photos, setPhotos] = useState<PhotoData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchPhotos = useCallback(async () => {
    if (!tripId || !dayId) {
      setPhotos([])
      return
    }
    setIsLoading(true)
    try {
      setPhotos(await photoService.getPhotos(tripId, dayId))
    } catch {
      setPhotos([])
    } finally {
      setIsLoading(false)
    }
  }, [tripId, dayId])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  return { photos, isLoading, refetch: fetchPhotos }
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

export function useUploadPhotos() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (tripId: number, dayId: number, files: File[]): Promise<PhotoData[]> => {
    const oversized = files.find((f) => f.size > MAX_FILE_SIZE)
    if (oversized) {
      const msg = `파일 크기가 허용 한도를 초과했습니다 (최대 5MB): ${oversized.name}`
      setError(msg)
      throw new Error(msg)
    }

    setIsLoading(true)
    setError(null)
    try {
      return await photoService.uploadPhotos(tripId, dayId, files)
    } catch (e: unknown) {
      const msg = (e instanceof Error ? e.message : null) ?? '업로드에 실패했습니다.'
      setError(msg)
      throw e
    } finally {
      setIsLoading(false)
    }
  }

  return { upload, isLoading, error, clearError: () => setError(null) }
}

export function useDeletePhoto() {
  const [isLoading, setIsLoading] = useState(false)

  const deletePhoto = async (tripId: number, dayId: number, photoId: number): Promise<void> => {
    setIsLoading(true)
    try {
      await photoService.deletePhoto(tripId, dayId, photoId)
    } finally {
      setIsLoading(false)
    }
  }

  return { deletePhoto, isLoading }
}
