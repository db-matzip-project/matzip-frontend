import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RestaurantPicker from '../../components/schedule/RestaurantPicker';
import RouteVisualization from '../../components/schedule/RouteVisualization';
import SortableStopList from '../../components/schedule/SortableStopList';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { useSchedules } from '../../context/ScheduleContext';

export default function ScheduleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    getSchedule,
    deleteSchedule,
    addRestaurant,
    removeRestaurant,
    reorderRestaurants,
  } = useSchedules();

  const schedule = id ? getSchedule(id) : undefined;
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSelection, setPickerSelection] = useState<string[]>([]);

  if (!schedule) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6">
        <p className="text-gray-500">일정을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/schedules')}>목록으로</Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`"${schedule.title}" 일정을 삭제할까요?`)) {
      deleteSchedule(schedule.id);
      navigate('/schedules', { replace: true });
    }
  };

  const togglePickerItem = (restaurantId: string) => {
    setPickerSelection((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId],
    );
  };

  const handleAddRestaurants = () => {
    pickerSelection.forEach((rid) => addRestaurant(schedule.id, rid));
    setPickerSelection([]);
    setShowPicker(false);
  };

  return (
    <div className="pb-6">
      <PageHeader
        title={schedule.title}
        subtitle={schedule.date}
        backTo="/schedules"
        action={
          <Link
            to={`/schedules/${schedule.id}/edit`}
            className="text-xs font-medium text-orange-600"
          >
            수정
          </Link>
        }
      />

      <div className="space-y-6 px-4 py-4">
        {schedule.memo && (
          <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            {schedule.memo}
          </p>
        )}

        {/* 방문 순서 (DnD) */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">
              방문 순서 ({schedule.restaurantIds.length})
            </h2>
            <button
              type="button"
              onClick={() => setShowPicker((v) => !v)}
              className="text-xs font-medium text-orange-600"
            >
              {showPicker ? '닫기' : '+ 식당 추가'}
            </button>
          </div>

          <SortableStopList
            restaurantIds={schedule.restaurantIds}
            onReorder={(ids) => reorderRestaurants(schedule.id, ids)}
            onRemove={(rid) => removeRestaurant(schedule.id, rid)}
          />
        </section>

        {showPicker && (
          <section className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
            <h3 className="mb-2 text-sm font-bold text-gray-900">식당 추가</h3>
            <RestaurantPicker
              selectedIds={pickerSelection}
              onToggle={togglePickerItem}
              excludeIds={schedule.restaurantIds}
            />
            <Button
              fullWidth
              className="mt-3"
              disabled={pickerSelection.length === 0}
              onClick={handleAddRestaurants}
            >
              {pickerSelection.length}곳 추가
            </Button>
          </section>
        )}

        {/* 이동 동선 */}
        <section>
          <h2 className="mb-3 text-sm font-bold text-gray-900">이동 동선 · 예상 거리</h2>
          <RouteVisualization restaurantIds={schedule.restaurantIds} />
        </section>

        <div className="flex gap-3 pt-2">
          <Button
            variant="danger"
            fullWidth
            onClick={handleDelete}
          >
            일정 삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
