import axiosInstance from '../../../shared/api/axiosInstance'
import type { DayCreateRequest, DayResponse, DayUpdateRequest } from '../types'

export const dayService = {
  getDays: async (tripId: number): Promise<DayResponse[]> => {
    const res = await axiosInstance.get(`/trips/${tripId}/days`)
    return res.data.data
  },

  createDay: async (tripId: number, data: DayCreateRequest): Promise<DayResponse> => {
    const res = await axiosInstance.post(`/trips/${tripId}/days`, data)
    return res.data.data
  },

  updateDay: async (tripId: number, dayId: number, data: DayUpdateRequest): Promise<DayResponse> => {
    const res = await axiosInstance.put(`/trips/${tripId}/days/${dayId}`, data)
    return res.data.data
  },

  deleteDay: async (tripId: number, dayId: number): Promise<void> => {
    await axiosInstance.delete(`/trips/${tripId}/days/${dayId}`)
  },
}
