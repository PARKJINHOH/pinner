import { useState } from 'react'
import { useCreateTrip, useTrips } from '../hooks'
import TripList from './TripList'
import TripFormModal from './TripFormModal'
import { useAuthStore } from '../../../shared/store/authStore'

export default function LeftPanel() {
  useTrips()
  const isDemo = useAuthStore((s) => s.isDemo)
  const { createTrip, isLoading: isCreating } = useCreateTrip()
  const [showCreate, setShowCreate] = useState(false)

  const handleCreate = async (data: {
    title: string
    startDate: string | null
    endDate: string | null
  }) => {
    await createTrip(data)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm font-semibold text-navy">내 여행</span>
        {!isDemo && (
          <button
            onClick={() => setShowCreate(true)}
            className="text-xs bg-navy text-white px-3 py-1.5 rounded-lg hover:bg-blue-900 transition-colors"
          >
            + 여행 추가
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        <TripList />
      </div>

      {showCreate && (
        <TripFormModal
          onSave={handleCreate}
          onClose={() => setShowCreate(false)}
          isLoading={isCreating}
        />
      )}
    </div>
  )
}
