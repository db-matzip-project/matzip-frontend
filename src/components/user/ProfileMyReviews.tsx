import { Link } from 'react-router-dom';
import { deleteRestaurantReviewApi } from '../../api/reviews';
import { getApiErrorMessage } from '../../api/client';
import { useMyReviews } from '../../hooks/useMyReviews';
import Button from '../ui/Button';

type ProfileMyReviewsProps = {
  enabled: boolean;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ProfileMyReviews({ enabled }: ProfileMyReviewsProps) {
  const { reviews, totalElements, hasMore, loading, loadingMore, error, loadMore, refetch } =
    useMyReviews(enabled);

  const handleDelete = async (restaurantId: number, reviewId: number) => {
    if (!window.confirm('이 리뷰를 삭제할까요?')) return;
    try {
      await deleteRestaurantReviewApi(restaurantId, reviewId);
      await refetch();
    } catch (err) {
      alert(getApiErrorMessage(err, '삭제에 실패했습니다.'));
    }
  };

  return (
    <div className="rounded-2xl border border-brand-light bg-surface p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand">내 리뷰</h3>
        {!loading && totalElements > 0 && (
          <span className="text-xs text-muted">{totalElements}개</span>
        )}
      </div>

      {loading && reviews.length === 0 && (
        <p className="text-sm text-muted">불러오는 중...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p className="text-sm text-muted">아직 작성한 리뷰가 없어요.</p>
      )}

      <ul className="space-y-3">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="rounded-xl border border-brand-light bg-brand-soft p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  to={`/restaurants/${review.restaurantId}`}
                  className="truncate text-sm font-semibold text-brand hover:underline"
                >
                  {review.restaurantName}
                </Link>
                <p className="text-[10px] text-subtle">{formatDate(review.createdAt)}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-brand">★ {review.rating}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink line-clamp-3">{review.content}</p>
            <div className="mt-2 flex gap-2">
              <Link
                to={`/restaurants/${review.restaurantId}`}
                className="text-xs font-medium text-brand"
              >
                식당 보기
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(review.restaurantId, review.id)}
                className="text-xs font-medium text-red-500"
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>

      {hasMore && (
        <Button
          variant="secondary"
          fullWidth
          className="mt-3 !py-2 text-xs"
          disabled={loadingMore}
          onClick={loadMore}
        >
          {loadingMore ? '불러오는 중...' : `더보기 (${reviews.length}/${totalElements})`}
        </Button>
      )}
    </div>
  );
}
