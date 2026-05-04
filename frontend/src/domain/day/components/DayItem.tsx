import { useState } from 'react'
import { useTripStore } from '../../trip/store/tripStore'
import { useDeleteDay, useUpdateDay } from '../hooks'
import type { DayResponse } from '../types'
import ConfirmModal from '../../../shared/components/ConfirmModal'
import DayFormModal from './DayFormModal'
import { useAuthStore } from '../../../shared/store/authStore'

interface Props {
  day: DayResponse
  onChanged: () => void
}

export default function DayItem({ day, onChanged }: Props) {
  const isDemo = useAuthStore((s) => s.isDemo)
  const setSelectedDay = useTripStore((s) => s.setSelectedDay)
  const selectedDayId = useTripStore((s) => s.selectedDayId)
  const incrementMarkerRefresh = useTripStore((s) => s.incrementMarkerRefresh)
  const { updateDay, isLoading: isUpdating } = useUpdateDay()
  const { deleteDay, isLoading: isDeleting } = useDeleteDay()

  const [showEdit, setShowEdit] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const isSelected = selectedDayId === day.dayId

  const handleSelect = () => setSelectedDay(day.dayId)

  const handleUpdate = async (data: { name: string; date: string | null }) => {
    await updateDay(day.tripId, day.dayId, data)
    incrementMarkerRefresh()
    onChanged()
  }

  const handleDelete = async () => {
    await deleteDay(day.tripId, day.dayId)
    incrementMarkerRefresh()
    onChanged()
    setShowConfirm(false)
  }

  // MM.DD 형식
  const dateLabel = day.date
    ? `${day.date.slice(5, 7)}.${day.date.slice(8, 10)}`
    : null

  return (
    <>
      <div
        onClick={handleSelect}
        className={`flex items-center gap-2 pl-5 pr-2 py-1.5 rounded-lg cursor-pointer group transition-colors ${
          isSelected ? 'bg-sky/10 text-navy font-medium' : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        {dateLabel && (
          <span className="shrink-0 text-xs font-medium text-sky w-10 tabular-nums">
            {dateLabel}
          </span>
        )}
        <span className="flex-1 text-sm truncate">{day.name}</span>
        {day.hasMarker && <span className="text-xs shrink-0">📍</span>}
        {!isDemo && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); setShowEdit(true) }}
              className="p-0.5 text-gray-400 hover:text-navy text-xs"
              title="수정"
            >
              ✏️
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true) }}
              className="p-0.5 text-gray-400 hover:text-red-500 text-xs"
              title="삭제"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {showEdit && (
        <DayFormModal
          initial={day}
          onSave={handleUpdate}
          onClose={() => setShowEdit(false)}
          isLoading={isUpdating}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          message="날짜를 삭제하면 모든 사진이 함께 삭제됩니다. 정말 삭제하시겠습니까?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          isLoading={isDeleting}
        />
      )}
    </>
  )
}
