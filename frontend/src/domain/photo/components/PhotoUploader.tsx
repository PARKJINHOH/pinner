import { useRef, useState } from 'react'

interface Props {
  onUpload: (files: File[]) => Promise<void>
  isLoading: boolean
  disabled?: boolean
}

export default function PhotoUploader({ onUpload, isLoading, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const fileArray = Array.from(files)
    if (inputRef.current) inputRef.current.value = ''
    await onUpload(fileArray)
  }

  const isInactive = disabled || isLoading

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors select-none
        ${isDragOver && !isInactive ? 'border-sky bg-blue-50' : 'border-gray-200'}
        ${isInactive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'}
      `}
      onClick={() => !isInactive && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); if (!isInactive) setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        if (!isInactive) handleFiles(e.dataTransfer.files)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {isLoading ? (
        <p className="text-sm text-gray-400">업로드 중...</p>
      ) : disabled ? (
        <p className="text-sm text-gray-400">사진은 최대 10장까지 업로드할 수 있습니다</p>
      ) : (
        <>
          <p className="text-xl mb-1">📷</p>
          <p className="text-sm text-gray-500">클릭하거나 드래그하여 사진 추가</p>
          <p className="text-xs text-gray-400 mt-0.5">최대 10장 · 장당 5MB 이하</p>
        </>
      )}
    </div>
  )
}
