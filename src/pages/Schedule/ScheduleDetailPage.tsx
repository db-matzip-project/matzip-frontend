import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import KakaoPlaceSearch from '../../components/schedule/KakaoPlaceSearch';
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
    fetchScheduleDetail,
    deleteSchedule,
    addRestaurant,
    addRestaurantFromPlace,
    removeRestaurant,
    reorderRestaurants,
  } = useSchedules();

  const [loading, setLoading] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSelection, setPickerSelection] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const schedule = id ? getSchedule(id) : undefined;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      await fetchScheduleDetail(id);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, fetchScheduleDetail]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted">
        일정을 불러오는 중...
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted">일정을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/schedules')}>목록으로</Button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm(`"${schedule.title}" 일정을 삭제할까요?`)) return;
    setBusy(true);
    try {
      await deleteSchedule(schedule.id);
      navigate('/schedules', { replace: true });
    } finally {
      setBusy(false);
    }
  };

  const togglePickerItem = (restaurantId: string) => {
    setPickerSelection((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((rid) => rid !== restaurantId)
        : [...prev, restaurantId],
    );
  };

  const handleAddRestaurants = async () => {
    setBusy(true);
    try {
      for (const rid of pickerSelection) {
        await addRestaurant(schedule.id, rid);
      }
      setPickerSelection([]);
      setShowPicker(false);
      await fetchScheduleDetail(schedule.id);
    } finally {
      setBusy(false);
    }
  };

  const handleReorder = async (ids: string[]) => {
    setBusy(true);
    try {
      await reorderRestaurants(schedule.id, ids);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (rid: string) => {
    setBusy(true);
    try {
      await removeRestaurant(schedule.id, rid);
    } finally {
      setBusy(false);
    }
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
            className="text-xs font-medium text-brand"
          >
            수정
          </Link>
        }
      />

      <div className="space-y-6 px-4 py-4">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">
              방문 순서 ({schedule.restaurantIds.length})
            </h2>
            <button
              type="button"
              onClick={() => setShowPicker((v) => !v)}
              className="text-xs font-medium text-brand"
              disabled={busy}
            >
              {showPicker ? '닫기' : '+ 식당 추가'}
            </button>
          </div>

          <SortableStopList
            restaurantIds={schedule.restaurantIds}
            onReorder={handleReorder}
            onRemove={handleRemove}
          />
        </section>

        {showPicker && (
          <section className="space-y-4 rounded-2xl border border-brand-light bg-brand-soft p-4">
            <div>
              <h3 className="mb-2 text-sm font-bold text-ink">카카오에서 검색</h3>
              <KakaoPlaceSearch
                disabled={busy}
                onAdd={async (place) => {
                  await addRestaurantFromPlace(schedule.id, place);
                  await fetchScheduleDetail(schedule.id);
                }}
              />
            </div>
            <div className="border-t border-brand-light pt-4">
              <h3 className="mb-2 text-sm font-bold text-ink">저장된 맛집에서 선택</h3>
              <RestaurantPicker
                selectedIds={pickerSelection}
                onToggle={togglePickerItem}
                excludeIds={schedule.restaurantIds}
              />
              <Button
                fullWidth
                className="mt-3"
                disabled={pickerSelection.length === 0 || busy}
                onClick={handleAddRestaurants}
              >
                {pickerSelection.length}곳 추가
              </Button>
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-sm font-bold text-ink">이동 동선 · 예상 거리</h2>
          <RouteVisualization
            restaurantIds={schedule.restaurantIds}
            scheduleId={schedule.id}
          />
        </section>

        <div className="flex gap-3 pt-2">
          <Button variant="danger" fullWidth onClick={handleDelete} disabled={busy}>
            일정 삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
