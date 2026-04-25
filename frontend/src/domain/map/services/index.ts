import axiosInstance from '../../../shared/api/axiosInstance'
import type { TripMarkerData } from '../types'

export interface MarkerResponse {
  markerId: number
  dayId: number
  lat: number
  lng: number
  label: string | null
  isAuto: boolean
}

export const markerService = {
  getMarkers: async (tripId: number): Promise<TripMarkerData[]> => {
    const res = await axiosInstance.get(`/trips/${tripId}/markers`)
    return res.data.data
  },

  upsertMarker: async (
    tripId: number,
    dayId: number,
    data: { lat: number; lng: number; label?: string | null }
  ): Promise<MarkerResponse> => {
    const res = await axiosInstance.post(`/trips/${tripId}/days/${dayId}/marker`, data)
    return res.data.data
  },

  deleteMarker: async (tripId: number, dayId: number): Promise<void> => {
    await axiosInstance.delete(`/trips/${tripId}/days/${dayId}/marker`)
  },
}
