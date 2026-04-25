import { useCallback, useEffect, useState } from 'react'
import { useTripStore } from '../store/tripStore'
import { tripService } from '../services'
import type { TripCreateRequest, TripUpdateRequest } from '../types'

export function useTrips() {
  const trips = useTripStore((s) => s.trips)
  const setTrips = useTripStore((s) => s.setTrips)
  const [isLoading, setIsLoading] = useState(false)

  const fetchTrips = useCallback(async () => {
    setIsLoading(true)
    try {
      setTrips(await tripService.getTrips())
    } finally {
      setIsLoading(false)
    }
  }, [setTrips])

  useEffect(() => { fetchTrips() }, [fetchTrips])

  return { trips, isLoading, refetch: fetchTrips }
}

export function useCreateTrip() {
  const addTrip = useTripStore((s) => s.addTrip)
  const [isLoading, setIsLoading] = useState(false)

  const createTrip = async (data: TripCreateRequest) => {
    setIsLoading(true)
    try {
      const trip = await tripService.createTrip(data)
      addTrip(trip)
      return trip
    } finally {
      setIsLoading(false)
    }
  }

  return { createTrip, isLoading }
}

export function useUpdateTrip() {
  const updateTrip = useTripStore((s) => s.updateTrip)
  const [isLoading, setIsLoading] = useState(false)

  const update = async (tripId: number, data: TripUpdateRequest) => {
    setIsLoading(true)
    try {
      const updated = await tripService.updateTrip(tripId, data)
      updateTrip(updated)
      return updated
    } finally {
      setIsLoading(false)
    }
  }

  return { updateTrip: update, isLoading }
}

export function useDeleteTrip() {
  const removeTrip = useTripStore((s) => s.removeTrip)
  const [isLoading, setIsLoading] = useState(false)

  const deleteTrip = async (tripId: number) => {
    setIsLoading(true)
    try {
      await tripService.deleteTrip(tripId)
      removeTrip(tripId)
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteTrip, isLoading }
}

export function useUpdateSort() {
  const updateTripSort = useTripStore((s) => s.updateTripSort)

  const updateSort = async (tripIds: number[]) => {
    updateTripSort(tripIds)
    try {
      await tripService.updateSort(tripIds)
    } catch {
      // silent — UI already updated optimistically
    }
  }

  return { updateSort }
}
