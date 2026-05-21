import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { PREFERENCE_LABELS } from '../../constants/preferences';
import { getRestaurantById } from '../../data/dummyRestaurants';

const priceLabels = ['', '저렴', '보통', '고급'];

const DUMMY_MENUS: Record<string, { name: string; price: number }[]> = {
  default: [
    { name: '대표 메뉴', price: 12000 },
    { name: '세트 A', price: 18000 },
    { name: '세트 B', price: 25000 },
  ],
};

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const restaurant = id ? getRestaurantById(id) : undefined;

  if (!restaurant) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6">
        <p className="text-muted">식당을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/restaurants')}>목록으로</Button>
      </div>
    );
  }

  const menus = DUMMY_MENUS[restaurant.id] ?? DUMMY_MENUS.default;

  return (
    <div className="pb-6">
      <PageHeader title={restaurant.name} backTo="/restaurants" />

      {/* 히어로 */}
      <div className="mx-4 mt-4 flex h-48 items-center justify-center rounded-2xl border border-brand-light bg-brand-soft text-7xl">
        {restaurant.imageEmoji}
      </div>

      <section className="space-y-4 px-4 pt-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-ink ring-1 ring-brand-light">
              {restaurant.category}
            </span>
            <span className="text-sm text-muted">{priceLabels[restaurant.priceRange]}</span>
            <span className="text-sm text-subtle">· {restaurant.distance}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-brand">★ {restaurant.rating}</span>
            <span className="text-sm text-muted">
              리뷰 {restaurant.reviewCount.toLocaleString()}개
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {restaurant.description}
          </p>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1.5">
          {restaurant.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-brand-soft px-2.5 py-1 text-xs text-muted"
            >
              {PREFERENCE_LABELS[tag] ?? tag}
            </span>
          ))}
        </div>

        {/* 정보 */}
        <dl className="space-y-3 rounded-2xl border border-brand-light bg-brand-soft p-4">
          <div>
            <dt className="text-xs text-muted">주소</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{restaurant.address}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">영업시간</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{restaurant.openHours}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">전화</dt>
            <dd className="mt-0.5 text-sm font-medium text-ink">{restaurant.phone}</dd>
          </div>
        </dl>

        {/* 메뉴 */}
        <div>
          <h2 className="mb-2 text-sm font-bold text-ink">대표 메뉴</h2>
          <ul className="divide-y divide-brand-light rounded-2xl border border-brand-light bg-brand-soft">
            {menus.map((menu) => (
              <li
                key={menu.name}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="text-ink">{menu.name}</span>
                <span className="font-medium text-ink">
                  {menu.price.toLocaleString()}원
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 지도 미리보기 링크 */}
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
            onClick={() => navigate('/schedules/new', { state: { restaurantId: restaurant.id } })}
          >
            일정에 추가
          </Button>
        </div>
      </section>
    </div>
  );
}
