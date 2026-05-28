import axiosInstance from '../../../shared/api/axiosInstance'
import type { TripCreateRequest, TripResponse, TripUpdateRequest } from '../types'

export const tripService = {
  getTrips: async (): Promise<TripResponse[]> => {
    const res = await axiosInstance.get('/trips')
    return res.data.data
  },

  createTrip: async (data: TripCreateRequest): Promise<TripResponse> => {
    const res = await axiosInstance.post('/trips', data)
    return res.data.data
  },

  updateTrip: async (tripId: number, data: TripUpdateRequest): Promise<TripResponse> => {
    const res = await axiosInstance.put(`/trips/${tripId}`, data)
    return res.data.data
  },

  deleteTrip: async (tripId: number): Promise<void> => {
    await axiosInstance.delete(`/trips/${tripId}`)
  },

  updateSort: async (tripIds: number[]): Promise<void> => {
    await axiosInstance.patch('/trips/sort', { tripIds })
  },
}
