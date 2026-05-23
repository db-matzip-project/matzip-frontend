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
import { getCachedRestaurant } from '../../utils/restaurantCache';

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
  const restaurant = getCachedRestaurant(id);
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

  if (!restaurant) {
    return (
      <li className="rounded-2xl border border-brand-light bg-brand-soft p-3 text-sm text-muted">
        식당 #{id} (정보 로딩 중)
      </li>
    );
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-2xl border bg-cream p-3 ${
        isDragging ? 'z-10 border-brand bg-brand-soft' : 'border-brand-light'
      }`}
    >
      <button
        type="button"
        className="flex h-10 w-8 shrink-0 cursor-grab touch-none flex-col items-center justify-center gap-0.5 text-subtle active:cursor-grabbing"
        aria-label="순서 변경 드래그"
        {...attributes}
        {...listeners}
      >
        <span className="h-0.5 w-4 rounded-full bg-brand-light" />
        <span className="h-0.5 w-4 rounded-full bg-brand-light" />
        <span className="h-0.5 w-4 rounded-full bg-brand-light" />
      </button>

      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
        {order}
      </span>

      <span className="text-2xl">{restaurant.imageEmoji}</span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{restaurant.name}</p>
        <p className="text-xs text-muted">
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
      <p className="rounded-2xl border border-brand-light bg-brand-soft py-8 text-center text-sm text-muted">
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
      <p className="mt-2 text-center text-[10px] text-subtle">
        ≡ 핸들을 드래그하여 방문 순서를 변경하세요
      </p>
    </DndContext>
  );
}
