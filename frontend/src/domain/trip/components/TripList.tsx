import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useTripStore } from '../store/tripStore'
import { useUpdateSort } from '../hooks'
import TripItem from './TripItem'

export default function TripList() {
  const trips = useTripStore((s) => s.trips)
  const updateTripSort = useTripStore((s) => s.updateTripSort)
  const { updateSort } = useUpdateSort()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = trips.findIndex((t) => t.tripId === active.id)
    const newIndex = trips.findIndex((t) => t.tripId === over.id)
    const newTrips = arrayMove(trips, oldIndex, newIndex)
    const newTripIds = newTrips.map((t) => t.tripId)

    updateTripSort(newTripIds)
    updateSort(newTripIds)
  }

  if (trips.length === 0) {
    return (
      <p className="px-3 py-6 text-sm text-gray-400 text-center">
        아직 여행이 없어요.
        <br />
        첫 여행을 추가해보세요!
      </p>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={trips.map((t) => t.tripId)}
        strategy={verticalListSortingStrategy}
      >
        {trips.map((trip) => (
          <TripItem key={trip.tripId} trip={trip} />
        ))}
      </SortableContext>
    </DndContext>
  )
}
