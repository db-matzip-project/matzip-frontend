import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RestaurantPicker from '../../components/schedule/RestaurantPicker';
import RouteVisualization from '../../components/schedule/RouteVisualization';
import SuggestedVisitOrder from '../../components/schedule/SuggestedVisitOrder';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import { useSchedules } from '../../context/ScheduleContext';

export default function ScheduleEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSchedule, fetchScheduleDetail, updateSchedule, deleteSchedule } =
    useSchedules();
  const schedule = id ? getSchedule(id) : undefined;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const detail = await fetchScheduleDetail(id);
      if (detail) {
        setTitle(detail.title);
        setDate(detail.date);
        setSelectedIds(detail.restaurantIds);
      }
      setLoading(false);
    })();
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

  const toggleRestaurant = (restaurantId: string) => {
    setSelectedIds((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((rid) => rid !== restaurantId)
        : [...prev, restaurantId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('일정 제목을 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await updateSchedule(schedule.id, {
        title,
        date,
        restaurantIds: selectedIds,
      });
      navigate(`/schedules/${schedule.id}`, { replace: true });
    } catch {
      setError('일정 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`"${schedule.title}" 일정을 삭제할까요?`)) return;
    setSubmitting(true);
    try {
      await deleteSchedule(schedule.id);
      navigate('/schedules', { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-6">
      <PageHeader title="일정 수정" backTo={`/schedules/${schedule.id}`} />

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
          {submitting ? '저장 중...' : '저장하기'}
        </Button>
        <Button
          type="button"
          variant="danger"
          fullWidth
          onClick={handleDelete}
          disabled={submitting}
        >
          일정 삭제
        </Button>
      </form>
    </div>
  );
}
