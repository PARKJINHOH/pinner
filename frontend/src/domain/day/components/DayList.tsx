import { useState } from 'react'
import { useCreateDay, useDays } from '../hooks'
import DayItem from './DayItem'
import DayFormModal from './DayFormModal'
import { useAuthStore } from '../../../shared/store/authStore'

interface Props {
  tripId: number
}

export default function DayList({ tripId }: Props) {
  const isDemo = useAuthStore((s) => s.isDemo)
  const { days, isLoading, refetch } = useDays(tripId)
  const { createDay, isLoading: isCreating } = useCreateDay()
  const [showCreate, setShowCreate] = useState(false)

  const handleCreate = async (data: { name: string; date: string | null }) => {
    await createDay(tripId, data)
    refetch()
  }

  if (isLoading) {
    return <div className="pl-6 py-2 text-xs text-gray-400">로딩 중...</div>
  }

  return (
    <div className="pl-3 pb-1">
      {days.length === 0 ? (
        <p className="text-xs text-gray-400 px-3 py-2">날짜를 추가해보세요!</p>
      ) : (
        days.map((day) => (
          <DayItem key={day.dayId} day={day} onChanged={refetch} />
        ))
      )}

      {!isDemo && (
        <button
          onClick={() => setShowCreate(true)}
          className="w-full text-left px-3 py-1.5 text-xs text-sky hover:text-navy hover:bg-gray-50 rounded-lg transition-colors"
        >
          + 날짜 추가
        </button>
      )}

      {showCreate && (
        <DayFormModal
          onSave={handleCreate}
          onClose={() => setShowCreate(false)}
          isLoading={isCreating}
        />
      )}
    </div>
  )
}
