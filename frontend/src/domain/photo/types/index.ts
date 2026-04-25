export interface PhotoData {
  photoId: number
  dayId: number
  fileName: string
  originalName: string
  fileSize: number
  fileUrl: string
  lat: number | null
  lng: number | null
  exifTakenAt: string | null
  uploadedAt: string
  hasGps: boolean
}
