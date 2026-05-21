import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getRestaurantById } from '../../data/dummyRestaurants';

type SortableStopListProps = {
  restaurantIds: string[];
  onReorder: (ids: string[]) => void;
  onRemove: (restaurantId: string) => void;
};

function SortableStopItem({
  id,
  order,
  onRemove,
}: {
  id: string;
  order: number;
  onRemove: () => void;
}) {
  const restaurant = getRestaurantById(id);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!restaurant) return null;

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-2xl border bg-white p-3 ${
        isDragging
          ? 'z-10 border-orange-400 shadow-lg'
          : 'border-gray-100 shadow-sm'
      }`}
    >
      <button
        type="button"
        className="flex h-10 w-8 shrink-0 cursor-grab touch-none flex-col items-center justify-center gap-0.5 text-gray-400 active:cursor-grabbing"
        aria-label="순서 변경 드래그"
        {...attributes}
        {...listeners}
      >
        <span className="h-0.5 w-4 rounded bg-gray-300" />
        <span className="h-0.5 w-4 rounded bg-gray-300" />
        <span className="h-0.5 w-4 rounded bg-gray-300" />
      </button>

      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
        {order}
      </span>

      <span className="text-2xl">{restaurant.imageEmoji}</span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900">{restaurant.name}</p>
        <p className="text-xs text-gray-500">
          {restaurant.category} · {restaurant.distance}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50"
      >
        삭제
      </button>
    </li>
  );
}

export default function SortableStopList({
  restaurantIds,
  onReorder,
  onRemove,
}: SortableStopListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = restaurantIds.indexOf(String(active.id));
    const newIndex = restaurantIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(restaurantIds, oldIndex, newIndex));
  };

  if (restaurantIds.length === 0) {
    return (
      <p className="rounded-2xl bg-gray-50 py-8 text-center text-sm text-gray-500">
        아직 추가된 식당이 없습니다.
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={restaurantIds}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-2">
          {restaurantIds.map((id, index) => (
            <SortableStopItem
              key={id}
              id={id}
              order={index + 1}
              onRemove={() => onRemove(id)}
            />
          ))}
        </ul>
      </SortableContext>
      <p className="mt-2 text-center text-[10px] text-gray-400">
        ≡ 핸들을 드래그하여 방문 순서를 변경하세요
      </p>
    </DndContext>
  );
}
