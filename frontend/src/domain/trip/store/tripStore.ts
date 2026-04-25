import { create } from 'zustand'
import type { TripResponse } from '../types'

interface TripState {
  trips: TripResponse[]
  selectedTripId: number | null
  selectedDayId: number | null
  expandedTripIds: number[]
  markerRefreshKey: number

  setTrips: (trips: TripResponse[]) => void
  addTrip: (trip: TripResponse) => void
  updateTrip: (trip: TripResponse) => void
  removeTrip: (tripId: number) => void
  updateTripSort: (tripIds: number[]) => void
  setSelectedTrip: (tripId: number | null) => void
  setSelectedDay: (dayId: number | null) => void
  toggleExpanded: (tripId: number) => void
  incrementMarkerRefresh: () => void
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  selectedTripId: null,
  selectedDayId: null,
  expandedTripIds: [],
  markerRefreshKey: 0,

  setTrips: (trips) => set({ trips }),

  addTrip: (trip) => set((s) => ({ trips: [...s.trips, trip] })),

  updateTrip: (trip) =>
    set((s) => ({ trips: s.trips.map((t) => (t.tripId === trip.tripId ? trip : t)) })),

  removeTrip: (tripId) =>
    set((s) => ({
      trips: s.trips.filter((t) => t.tripId !== tripId),
      expandedTripIds: s.expandedTripIds.filter((id) => id !== tripId),
      selectedTripId: s.selectedTripId === tripId ? null : s.selectedTripId,
    })),

  updateTripSort: (tripIds) =>
    set((s) => ({
      trips: tripIds.map((id, index) => {
        const trip = s.trips.find((t) => t.tripId === id)!
        return { ...trip, sortOrder: index + 1 }
      }),
    })),

  setSelectedTrip: (tripId) => set({ selectedTripId: tripId }),

  setSelectedDay: (dayId) => set({ selectedDayId: dayId }),

  toggleExpanded: (tripId) =>
    set((s) => ({
      expandedTripIds: s.expandedTripIds.includes(tripId)
        ? s.expandedTripIds.filter((id) => id !== tripId)
        : [...s.expandedTripIds, tripId],
    })),

  incrementMarkerRefresh: () => set((s) => ({ markerRefreshKey: s.markerRefreshKey + 1 })),
}))
