export interface DayResponse {
  dayId: number
  tripId: number
  name: string
  date: string | null
  photoCount: number
  hasMarker: boolean
  createdAt: string
}

export interface DayCreateRequest {
  name: string
  date: string | null
}

export interface DayUpdateRequest {
  name: string
  date: string | null
}
