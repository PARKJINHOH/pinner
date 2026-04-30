import axiosInstance from '../../../shared/api/axiosInstance'
import { useAuthStore } from '../../../shared/store/authStore'
import type { PhotoData } from '../types'

export const photoService = {
  getPhotos: async (tripId: number, dayId: number): Promise<PhotoData[]> => {
    const res = await axiosInstance.get(`/trips/${tripId}/days/${dayId}/photos`)
    return res.data.data
  },

  uploadPhotos: async (tripId: number, dayId: number, files: File[]): Promise<PhotoData[]> => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    const token = useAuthStore.getState().accessToken
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`/api/trips/${tripId}/days/${dayId}/photos`, {
      method: 'POST',
      headers,
      body: form,
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body?.message ?? `Upload failed: ${res.status}`)
    }
    const json = await res.json()
    return json.data
  },

  deletePhoto: async (tripId: number, dayId: number, photoId: number): Promise<void> => {
    await axiosInstance.delete(`/trips/${tripId}/days/${dayId}/photos/${photoId}`)
  },
}
