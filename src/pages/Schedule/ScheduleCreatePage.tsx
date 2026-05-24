import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import KakaoPlaceSearch from '../../components/schedule/KakaoPlaceSearch';
import RestaurantPicker from '../../components/schedule/RestaurantPicker';
import type { SchedulePlacePayload } from '../../types/place';
import RouteVisualization from '../../components/schedule/RouteVisualization';
import SuggestedVisitOrder from '../../components/schedule/SuggestedVisitOrder';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import { useSchedules } from '../../context/ScheduleContext';

type CreateLocationState = { restaurantId?: string };

export default function ScheduleCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createSchedule } = useSchedules();
  const preselectedId = (location.state as CreateLocationState)?.restaurantId;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [memo, setMemo] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    preselectedId ? [preselectedId] : [],
  );
  const [pendingPlaces, setPendingPlaces] = useState<SchedulePlacePayload[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleRestaurant = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('일정 제목을 입력해 주세요.');
      return;
    }
    if (!date) {
      setError('날짜를 선택해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      const schedule = await createSchedule({
        title,
        date,
        memo,
        restaurantIds: selectedIds,
        places: pendingPlaces,
      });
      navigate(`/schedules/${schedule.id}`, { replace: true });
    } catch {
      setError('일정 생성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-6">
      <PageHeader title="일정 만들기" backTo="/schedules" />

      <form onSubmit={handleSubmit} className="space-y-6 px-4 py-4">
        <Input
          label="일정 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 홍대 맛집 투어"
        />
        <Input
          label="날짜"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand">메모 (선택)</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="첫 번째 식당 메모로 저장됩니다"
            rows={2}
            className="w-full resize-none rounded-xl border border-brand-light bg-brand-soft px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="mb-2 text-sm font-bold text-ink">카카오에서 검색</h2>
            <KakaoPlaceSearch
              disabled={submitting}
              addLabel="목록에 담기"
              hint="카카오에서 검색한 장소는 일정 생성 시 DB에 저장됩니다."
              onAdd={(place) => {
                setPendingPlaces((prev) =>
                  prev.some((p) => p.apiId === place.apiId) ? prev : [...prev, place],
                );
              }}
            />
            {pendingPlaces.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {pendingPlaces.map((place) => (
                  <li
                    key={place.apiId}
                    className="flex items-center justify-between rounded-lg bg-cream px-3 py-2 text-sm"
                  >
                    <span className="truncate font-medium text-ink">{place.name}</span>
                    <button
                      type="button"
                      className="shrink-0 text-xs text-red-500"
                      onClick={() =>
                        setPendingPlaces((prev) => prev.filter((p) => p.apiId !== place.apiId))
                      }
                    >
                      제거
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="mb-2 text-sm font-bold text-ink">
              저장된 맛집 ({selectedIds.length})
            </h2>
            {preselectedId && (
              <p className="mb-2 text-xs text-brand">
                상세 페이지에서 선택한 식당이 포함되어 있습니다.
              </p>
            )}
            <RestaurantPicker
              selectedIds={selectedIds}
              onToggle={toggleRestaurant}
            />
          </div>
        </div>

        {selectedIds.length >= 2 && (
          <div className="space-y-4">
            <SuggestedVisitOrder
              restaurantIds={selectedIds}
              disabled={submitting}
              onApply={(ids) => setSelectedIds(ids)}
            />
            <div>
              <h2 className="mb-2 text-sm font-bold text-ink">동선 미리보기</h2>
              <RouteVisualization restaurantIds={selectedIds} />
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" fullWidth disabled={submitting}>
          {submitting ? '생성 중...' : '일정 생성'}
        </Button>
      </form>
    </div>
  );
}
