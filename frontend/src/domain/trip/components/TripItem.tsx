import { useMemo, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTripStore } from '../store/tripStore'
import { useDeleteTrip, useUpdateTrip } from '../hooks'
import type { TripResponse } from '../types'
import DayList from '../../day/components/DayList'
import TripFormModal from './TripFormModal'
import ConfirmModal from '../../../shared/components/ConfirmModal'

interface Props {
  trip: TripResponse
}

function calcDuration(start: string | null, end: string | null): number {
  if (!start || !end) return 0
  const diff = new Date(end).getTime() - new Date(start).getTime()
  return diff < 0 ? 0 : Math.round(diff / 86400000) + 1
}

export default function TripItem({ trip }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: trip.tripId })

  const expandedTripIds = useTripStore((s) => s.expandedTripIds)
  const toggleExpanded = useTripStore((s) => s.toggleExpanded)
  const setSelectedTrip = useTripStore((s) => s.setSelectedTrip)
  const isExpanded = expandedTripIds.includes(trip.tripId)

  const { updateTrip, isLoading: isUpdating } = useUpdateTrip()
  const { deleteTrip, isLoading: isDeleting } = useDeleteTrip()

  const [showEdit, setShowEdit] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const duration = useMemo(
    () => calcDuration(trip.startDate, trip.endDate),
    [trip.startDate, trip.endDate]
  )

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleUpdate = async (data: {
    title: string
    startDate: string | null
    endDate: string | null
  }) => {
    await updateTrip(trip.tripId, data)
  }

  const handleDelete = async () => {
    await deleteTrip(trip.tripId)
    setShowConfirm(false)
  }

  return (
    <>
      <div ref={setNodeRef} style={style}>
        <div
          className="flex items-center gap-1.5 px-2 py-2 hover:bg-gray-100 rounded-lg cursor-pointer group"
          onClick={() => {
            toggleExpanded(trip.tripId)
            setSelectedTrip(trip.tripId)
          }}
        >
          <span
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab text-gray-300 hover:text-gray-500 text-sm select-none px-0.5"
            title="드래그로 순서 변경"
          >
            ⠿
          </span>
          <span className="text-xs text-gray-400 w-3">
            {isExpanded ? '▼' : '▶'}
          </span>
          <span className="flex-1 text-sm font-semibold text-gray-800 truncate">
            {trip.title}
          </span>
          <span className="text-xs text-gray-400 shrink-0">{duration}일</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); setShowEdit(true) }}
              className="p-1 text-gray-400 hover:text-navy text-xs rounded"
              title="수정"
            >
              ✏️
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true) }}
              className="p-1 text-gray-400 hover:text-red-500 text-xs rounded"
              title="삭제"
            >
              🗑️
            </button>
          </div>
        </div>

        {isExpanded && <DayList tripId={trip.tripId} />}
      </div>

      {showEdit && (
        <TripFormModal
          initial={trip}
          onSave={handleUpdate}
          onClose={() => setShowEdit(false)}
          isLoading={isUpdating}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          message="여행을 삭제하면 모든 날짜와 사진이 함께 삭제됩니다. 정말 삭제하시겠습니까?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          isLoading={isDeleting}
        />
      )}
    </>
  )
}
