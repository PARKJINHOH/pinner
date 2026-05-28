import { create } from 'zustand'
import type { TripMarkerData } from '../types'

interface MapState {
  markers: TripMarkerData[]
  isMarkerRegisterMode: boolean
  setMarkers: (markers: TripMarkerData[]) => void
  setMarkerRegisterMode: (active: boolean) => void
}

export const useMapStore = create<MapState>((set) => ({
  markers: [],
  isMarkerRegisterMode: false,
  setMarkers: (markers) => set({ markers }),
  setMarkerRegisterMode: (active) => set({ isMarkerRegisterMode: active }),
}))
