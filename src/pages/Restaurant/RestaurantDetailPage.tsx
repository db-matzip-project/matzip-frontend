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
        <p className="text-gray-500">식당을 찾을 수 없습니다.</p>
        <Button onClick={() => navigate('/restaurants')}>목록으로</Button>
      </div>
    );
  }

  const menus = DUMMY_MENUS[restaurant.id] ?? DUMMY_MENUS.default;

  return (
    <div className="pb-6">
      <PageHeader title={restaurant.name} backTo="/restaurants" />

      {/* 히어로 */}
      <div className="mx-4 mt-4 flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 text-7xl shadow-inner">
        {restaurant.imageEmoji}
      </div>

      <section className="space-y-4 px-4 pt-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-700">
              {restaurant.category}
            </span>
            <span className="text-sm text-gray-500">{priceLabels[restaurant.priceRange]}</span>
            <span className="text-sm text-gray-400">· {restaurant.distance}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-amber-500">★ {restaurant.rating}</span>
            <span className="text-sm text-gray-500">
              리뷰 {restaurant.reviewCount.toLocaleString()}개
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {restaurant.description}
          </p>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-1.5">
          {restaurant.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
            >
              {PREFERENCE_LABELS[tag] ?? tag}
            </span>
          ))}
        </div>

        {/* 정보 */}
        <dl className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4">
          <div>
            <dt className="text-xs text-gray-500">주소</dt>
            <dd className="mt-0.5 text-sm font-medium text-gray-900">{restaurant.address}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">영업시간</dt>
            <dd className="mt-0.5 text-sm font-medium text-gray-900">{restaurant.openHours}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">전화</dt>
            <dd className="mt-0.5 text-sm font-medium text-gray-900">{restaurant.phone}</dd>
          </div>
        </dl>

        {/* 메뉴 */}
        <div>
          <h2 className="mb-2 text-sm font-bold text-gray-900">대표 메뉴</h2>
          <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
            {menus.map((menu) => (
              <li
                key={menu.name}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="text-gray-800">{menu.name}</span>
                <span className="font-medium text-gray-900">
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
          className="flex items-center justify-between rounded-2xl bg-gray-100 px-4 py-3 text-sm"
        >
          <span className="font-medium text-gray-700">📍 지도에서 위치 보기</span>
          <span className="text-orange-600">→</span>
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
