import { Link } from 'react-router-dom';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import PageHeader from '../../components/ui/PageHeader';
import { PREFERENCE_LABELS } from '../../constants/preferences';
import { useAuth } from '../../context/AuthContext';
import { getRecommendations } from '../../utils/recommendations';

export default function HomePage() {
  const { user } = useAuth();
  const recommendations = getRecommendations(user?.preferences ?? [], 6);

  return (
    <div className="pb-4">
      <PageHeader
        title={`안녕하세요, ${user?.name ?? '게스트'}님`}
        subtitle="오늘의 맞춤 맛집을 골라봤어요"
        action={
          <Link
            to="/onboarding"
            className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-medium text-brand"
          >
            취향 수정
          </Link>
        }
      />

      <section className="bg-surface px-4 py-4">
        <h2 className="mb-2 text-sm font-semibold text-ink">내 취향</h2>
        <div className="flex flex-wrap gap-1.5">
          {(user?.preferences ?? []).map((pref) => (
            <span
              key={pref}
              className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand"
            >
              {PREFERENCE_LABELS[pref] ?? pref}
            </span>
          ))}
        </div>
      </section>

      <section className="px-4 pb-4">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-base font-bold text-ink">나를 위한 맞춤 추천</h2>
            <p className="text-xs text-muted">
              취향 일치도 순 · 총 {recommendations.length}곳
            </p>
          </div>
          <Link to="/restaurants" className="text-xs font-medium text-brand">
            전체 보기 →
          </Link>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl border border-brand-light bg-brand-soft p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-brand">{recommendations.length}</p>
            <p className="text-[10px] text-muted">추천 맛집</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-brand">
              {recommendations[0]?.matchScore ?? 0}%
            </p>
            <p className="text-[10px] text-muted">최고 일치도</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-brand">
              {user?.preferences.length ?? 0}
            </p>
            <p className="text-[10px] text-muted">선택 취향</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {recommendations.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      <section className="mt-2 px-4">
        <h2 className="mb-3 text-sm font-semibold text-ink">빠른 탐색</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/restaurants/search"
            className="rounded-2xl border border-brand-light bg-cream p-4 hover:bg-brand-soft"
          >
            <span className="text-2xl">🔍</span>
            <p className="mt-2 text-sm font-semibold text-ink">조건 검색</p>
            <p className="text-xs text-muted">카테고리·평점 필터</p>
          </Link>
          <Link
            to="/schedules/new"
            className="rounded-2xl border border-brand-light bg-brand-soft p-4 hover:bg-brand-muted"
          >
            <span className="text-2xl">📅</span>
            <p className="mt-2 text-sm font-semibold text-ink">일정 만들기</p>
            <p className="text-xs text-muted">맛집 투어 계획</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
