import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import { useSchedules } from '../../context/ScheduleContext';
import { getRestaurantById } from '../../data/dummyRestaurants';
import { calculateRoute } from '../../utils/routeCalculator';

export default function ScheduleListPage() {
  const { schedules, deleteSchedule } = useSchedules();
  const navigate = useNavigate();

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`"${title}" 일정을 삭제할까요?`)) {
      deleteSchedule(id);
    }
  };

  return (
    <div className="pb-4">
      <PageHeader
        title="여행 일정"
        subtitle={`${schedules.length}개의 일정`}
        action={
          <Link
            to="/schedules/new"
            className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark"
          >
            + 새 일정
          </Link>
        }
      />

      <div className="flex flex-col gap-3 px-4 py-4">
        {schedules.length === 0 ? (
          <div className="rounded-2xl bg-brand-soft py-16 text-center">
            <p className="text-4xl">📅</p>
            <p className="mt-3 font-medium text-brand">아직 일정이 없어요</p>
            <p className="mt-1 text-sm text-muted">맛집 투어 일정을 만들어 보세요</p>
            <Button className="mt-6" onClick={() => navigate('/schedules/new')}>
              첫 일정 만들기
            </Button>
          </div>
        ) : (
          schedules.map((schedule) => {
            const route = calculateRoute(schedule.restaurantIds);
            const firstRestaurant = schedule.restaurantIds[0]
              ? getRestaurantById(schedule.restaurantIds[0])
              : undefined;

            return (
              <article
                key={schedule.id}
                className="overflow-hidden rounded-2xl border border-brand-light bg-brand-soft"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/schedules/${schedule.id}`)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium text-brand">
                        {schedule.date}
                      </p>
                      <h2 className="mt-0.5 text-base font-bold text-ink">
                        {schedule.title}
                      </h2>
                    </div>
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs text-muted">
                      {schedule.restaurantIds.length}곳
                    </span>
                  </div>

                  {schedule.memo && (
                    <p className="mt-2 line-clamp-1 text-xs text-muted">
                      {schedule.memo}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                    {firstRestaurant && (
                      <span>
                        {firstRestaurant.imageEmoji} {firstRestaurant.name}
                        {schedule.restaurantIds.length > 1 &&
                          ` 외 ${schedule.restaurantIds.length - 1}곳`}
                      </span>
                    )}
                    {route.totalDistanceKm > 0 && (
                      <span className="text-brand">
                        · 총 {route.totalDistanceKm} km
                      </span>
                    )}
                  </div>
                </button>

                <div className="flex border-t border-brand-light">
                  <button
                    type="button"
                    onClick={() => navigate(`/schedules/${schedule.id}/edit`)}
                    className="flex-1 py-2.5 text-xs font-medium text-muted hover:bg-brand-soft"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(schedule.id, schedule.title)}
                    className="flex-1 border-l border-brand-light py-2.5 text-xs font-medium text-red-500 hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
