import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RestaurantPicker from '../../components/schedule/RestaurantPicker';
import RouteVisualization from '../../components/schedule/RouteVisualization';
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
  const [error, setError] = useState('');

  const toggleRestaurant = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    const schedule = createSchedule({
      title,
      date,
      memo,
      restaurantIds: selectedIds,
    });
    navigate(`/schedules/${schedule.id}`, { replace: true });
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
          <label className="text-sm font-medium text-gray-700">메모 (선택)</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="시간, 동행자 등 메모"
            rows={2}
            className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div>
          <h2 className="mb-2 text-sm font-bold text-gray-900">
            방문 식당 선택 ({selectedIds.length})
          </h2>
          {preselectedId && (
            <p className="mb-2 text-xs text-orange-600">
              상세 페이지에서 선택한 식당이 포함되어 있습니다.
            </p>
          )}
          <RestaurantPicker
            selectedIds={selectedIds}
            onToggle={toggleRestaurant}
          />
        </div>

        {selectedIds.length >= 2 && (
          <div>
            <h2 className="mb-2 text-sm font-bold text-gray-900">동선 미리보기</h2>
            <RouteVisualization restaurantIds={selectedIds} />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" fullWidth>
          일정 생성
        </Button>
      </form>
    </div>
  );
}
