import { Link, useNavigate, useParams } from 'react-router-dom';
import RestaurantReviewsSection from '../../components/restaurant/RestaurantReviewsSection';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { useRestaurantDetail } from '../../hooks/useRestaurants';

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { restaurant, loading, error, refetch } = useRestaurantDetail(id);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted">
        식당 정보를 불러오는 중...
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted">{error ?? '식당을 찾을 수 없습니다.'}</p>
        <Button onClick={() => navigate('/restaurants')}>목록으로</Button>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <PageHeader title={restaurant.name} backTo="/restaurants" />

      <div className="mx-4 mt-4 flex h-48 items-center justify-center rounded-2xl border border-brand-light bg-brand-soft text-7xl">
        {restaurant.imageEmoji}
      </div>

      <section className="space-y-4 px-4 pt-4">
        <div>
          <span className="inline-block rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-ink ring-1 ring-brand-light">
            {restaurant.category}
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-brand">★ {restaurant.rating ?? 0}</span>
            <span className="text-sm text-muted">
              리뷰 {(restaurant.reviewCount ?? 0).toLocaleString()}개
            </span>
          </div>
          {restaurant.description && (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {restaurant.description}
            </p>
          )}
        </div>

        <dl className="space-y-3 rounded-2xl border border-brand-light bg-brand-soft p-4">
          <div>
            <dt className="text-xs text-muted">주소</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{restaurant.address}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">전화</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{restaurant.phone}</dd>
          </div>
          {restaurant.latitude != null && restaurant.longitude != null && (
            <div>
              <dt className="text-xs text-muted">좌표</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">
                {restaurant.latitude.toFixed(5)}, {restaurant.longitude.toFixed(5)}
              </dd>
            </div>
          )}
        </dl>

        <Link
          to="/restaurants/map"
          state={{ selectedId: restaurant.id }}
          className="flex items-center justify-between rounded-2xl bg-brand-soft px-4 py-3 text-sm"
        >
          <span className="font-medium text-brand">📍 지도에서 위치 보기</span>
          <span className="text-brand">→</span>
        </Link>

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/restaurants/search')}
          >
            비슷한 맛집 찾기
          </Button>
          <Button
            fullWidth
            onClick={() =>
              navigate('/schedules/new', { state: { restaurantId: restaurant.id } })
            }
          >
            일정에 추가
          </Button>
        </div>

        {id && (
          <RestaurantReviewsSection restaurantId={id} onReviewChanged={refetch} />
        )}
      </section>
    </div>
  );
}
