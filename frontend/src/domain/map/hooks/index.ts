import { useCallback, useEffect, useState } from 'react'
import { useTripStore } from '../../trip/store/tripStore'
import { useMapStore } from '../store/mapStore'
import { markerService } from '../services'

export function useMarkers(tripId: number | null) {
  const markerRefreshKey = useTripStore((s) => s.markerRefreshKey)
  const setMarkers = useMapStore((s) => s.setMarkers)
  const [isLoading, setIsLoading] = useState(false)

  const reload = useCallback(() => {
    if (!tripId) {
      setMarkers([])
      return
    }
    setIsLoading(true)
    markerService
      .getMarkers(tripId)
      .then(setMarkers)
      .catch(() => setMarkers([]))
      .finally(() => setIsLoading(false))
  }, [tripId, markerRefreshKey, setMarkers])

  useEffect(() => {
    reload()
  }, [reload])

  return { isLoading, reload }
}

export function useUpsertMarker() {
  const [isLoading, setIsLoading] = useState(false)

  const upsertMarker = async (
    tripId: number,
    dayId: number,
    data: { lat: number; lng: number; label?: string | null }
  ) => {
    setIsLoading(true)
    try {
      await markerService.upsertMarker(tripId, dayId, data)
    } finally {
      setIsLoading(false)
    }
  }

  return { upsertMarker, isLoading }
}

export function useDeleteMarker() {
  const [isLoading, setIsLoading] = useState(false)

  const deleteMarker = async (tripId: number, dayId: number) => {
    setIsLoading(true)
    try {
      await markerService.deleteMarker(tripId, dayId)
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteMarker, isLoading }
}
