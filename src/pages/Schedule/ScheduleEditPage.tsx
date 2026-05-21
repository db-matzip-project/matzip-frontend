import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RestaurantPicker from '../../components/schedule/RestaurantPicker';
import RouteVisualization from '../../components/schedule/RouteVisualization';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import { useSchedules } from '../../context/ScheduleContext';

export default function ScheduleEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSchedule, updateSchedule, deleteSchedule } = useSchedules();
  const schedule = id ? getSchedule(id) : undefined;

  const [title, setTitle] = useState(schedule?.title ?? '');
  const [date, setDate] = useState(schedule?.date ?? '');
  const [memo, setMemo] = useState(schedule?.memo ?? '');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    schedule?.restaurantIds ?? [],
  );
  const [error, setError] = useState('');

  if (!schedule) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted">일정을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/schedules')}>목록으로</Button>
      </div>
    );
  }

  const toggleRestaurant = (restaurantId: string) => {
    setSelectedIds((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId)
        : [...prev, restaurantId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('일정 제목을 입력해 주세요.');
      return;
    }

    updateSchedule(schedule.id, {
      title,
      date,
      memo,
      restaurantIds: selectedIds,
    });
    navigate(`/schedules/${schedule.id}`, { replace: true });
  };

  const handleDelete = () => {
    if (window.confirm(`"${schedule.title}" 일정을 삭제할까요?`)) {
      deleteSchedule(schedule.id);
      navigate('/schedules', { replace: true });
    }
  };

  return (
    <div className="pb-6">
      <PageHeader
        title="일정 수정"
        backTo={`/schedules/${schedule.id}`}
      />

      <form onSubmit={handleSubmit} className="space-y-6 px-4 py-4">
        <Input
          label="일정 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="날짜"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand">메모</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border border-brand-light bg-brand-soft px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
          />
        </div>

        <div>
          <h2 className="mb-2 text-sm font-bold text-ink">
            방문 식당 ({selectedIds.length})
          </h2>
          <RestaurantPicker
            selectedIds={selectedIds}
            onToggle={toggleRestaurant}
          />
        </div>

        {selectedIds.length >= 2 && (
          <div>
            <h2 className="mb-2 text-sm font-bold text-ink">동선 미리보기</h2>
            <RouteVisualization restaurantIds={selectedIds} />
          </div>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" fullWidth>
          저장하기
        </Button>
        <Button type="button" variant="danger" fullWidth onClick={handleDelete}>
          일정 삭제
        </Button>
      </form>
    </div>
  );
}
