import { useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'

interface Props {
  src: string | null | undefined
  alt?: string
  className?: string
}

export default function AuthImage({ src, alt = '', className }: Props) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!src) {
      setObjectUrl(null)
      return
    }
    // axiosInstance has baseURL '/api'; strip leading /api so paths don't double
    const path = src.startsWith('/api') ? src.slice(4) : src
    let revoked = false
    let blobUrl = ''
    axiosInstance
      .get(path, { responseType: 'blob' })
      .then((res) => {
        if (!revoked) {
          blobUrl = URL.createObjectURL(res.data)
          setObjectUrl(blobUrl)
        }
      })
      .catch(() => {
        if (!revoked) setObjectUrl(null)
      })
    return () => {
      revoked = true
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [src])

  if (!objectUrl) return null
  return <img src={objectUrl} alt={alt} className={className} />
}
