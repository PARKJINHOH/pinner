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

export function useUploadPhotos() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = async (tripId: number, dayId: number, files: File[]): Promise<PhotoData[]> => {
    setIsLoading(true)
    setError(null)
    try {
      return await photoService.uploadPhotos(tripId, dayId, files)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? '업로드에 실패했습니다.')
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
