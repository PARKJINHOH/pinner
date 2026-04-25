import { useCallback, useEffect, useState } from 'react'
import { dayService } from '../services'
import type { DayCreateRequest, DayResponse, DayUpdateRequest } from '../types'

export function useDays(tripId: number | null) {
  const [days, setDays] = useState<DayResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchDays = useCallback(async () => {
    if (!tripId) return
    setIsLoading(true)
    try {
      setDays(await dayService.getDays(tripId))
    } catch {
      setDays([])
    } finally {
      setIsLoading(false)
    }
  }, [tripId])

  useEffect(() => { fetchDays() }, [fetchDays])

  return { days, isLoading, refetch: fetchDays }
}

export function useCreateDay() {
  const [isLoading, setIsLoading] = useState(false)

  const createDay = async (tripId: number, data: DayCreateRequest): Promise<DayResponse> => {
    setIsLoading(true)
    try {
      return await dayService.createDay(tripId, data)
    } finally {
      setIsLoading(false)
    }
  }

  return { createDay, isLoading }
}

export function useUpdateDay() {
  const [isLoading, setIsLoading] = useState(false)

  const updateDay = async (
    tripId: number,
    dayId: number,
    data: DayUpdateRequest
  ): Promise<DayResponse> => {
    setIsLoading(true)
    try {
      return await dayService.updateDay(tripId, dayId, data)
    } finally {
      setIsLoading(false)
    }
  }

  return { updateDay, isLoading }
}

export function useDeleteDay() {
  const [isLoading, setIsLoading] = useState(false)

  const deleteDay = async (tripId: number, dayId: number) => {
    setIsLoading(true)
    try {
      await dayService.deleteDay(tripId, dayId)
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteDay, isLoading }
}
