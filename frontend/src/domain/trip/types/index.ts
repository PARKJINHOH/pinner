export interface TripResponse {
  tripId: number
  title: string
  startDate: string | null
  endDate: string | null
  sortOrder: number
  isShared: boolean
  dayCount: number
  createdAt: string
}

export interface TripCreateRequest {
  title: string
  startDate: string | null
  endDate: string | null
}

export interface TripUpdateRequest {
  title: string
  startDate: string | null
  endDate: string | null
}

export interface TripSortRequest {
  tripIds: number[]
}
