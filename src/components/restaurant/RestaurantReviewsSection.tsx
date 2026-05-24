import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRestaurantReviews } from '../../hooks/useRestaurantReviews';
import type { ApiReview } from '../../api/types';
import Button from '../ui/Button';

type RestaurantReviewsSectionProps = {
  restaurantId: string;
  onReviewChanged?: () => void;
};

function reviewAuthor(review: ApiReview, isMine: boolean): string {
  if (isMine) return '내 리뷰';
  return `리뷰어 #${review.userId}`;
}

function formatReviewDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function RestaurantReviewsSection({
  restaurantId,
  onReviewChanged,
}: RestaurantReviewsSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const {
    reviews,
    loading,
    error,
    submitting,
    totalElements,
    hasMore,
    loadMore,
    submitReview,
    removeReview,
  } = useRestaurantReviews(restaurantId);

  const myReview = reviews.find((r) => user && String(r.userId) === user.id);

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setContent(myReview.content);
    } else {
      setRating(5);
      setContent('');
    }
  }, [myReview?.id, myReview?.rating, myReview?.content]);

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed) {
      setFormError('리뷰 내용을 입력해 주세요.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setFormError('평점은 1~5 사이로 선택해 주세요.');
      return;
    }
    setFormError(null);
    const result = await submitReview({ content: trimmed, rating });
    if (result.ok) {
      onReviewChanged?.();
    } else {
      setFormError(result.error);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm('리뷰를 삭제할까요?')) return;
    setDeletingId(reviewId);
    const result = await removeReview(reviewId);
    setDeletingId(null);
    if (result.ok) {
      onReviewChanged?.();
    } else {
      alert(result.error);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">리뷰</h2>
        <span className="text-sm text-muted">{totalElements}개</span>
      </div>

      {isAuthenticated ? (
        <div className="rounded-2xl border border-brand-light bg-brand-soft p-4 space-y-3">
          <p className="text-xs font-semibold text-muted">
            {myReview ? '내 리뷰 수정' : '리뷰 작성'}
          </p>
          <div>
            <p className="mb-1.5 text-xs text-muted">평점 (1~5)</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                    rating >= n
                      ? 'bg-brand text-white'
                      : 'bg-cream text-subtle ring-1 ring-brand-light'
                  }`}
                  aria-label={`${n}점`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 self-center text-sm font-medium text-ink">{rating}점</span>
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="맛, 분위기, 재방문 의사 등을 적어 주세요"
            rows={3}
            className="w-full resize-none rounded-xl border border-brand-light bg-cream px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand-light"
          />
          {formError && <p className="text-xs text-red-500">{formError}</p>}
          <Button fullWidth disabled={submitting} onClick={handleSubmit}>
            {submitting ? '저장 중...' : myReview ? '리뷰 수정' : '리뷰 등록'}
          </Button>
        </div>
      ) : (
        <p className="rounded-2xl bg-brand-soft px-4 py-3 text-center text-sm text-muted">
          리뷰를 작성하려면{' '}
          <Link to="/login" className="font-medium text-brand">
            로그인
          </Link>
          이 필요합니다.
        </p>
      )}

      {loading && reviews.length === 0 && (
        <p className="py-6 text-center text-sm text-muted">리뷰를 불러오는 중...</p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <ul className="space-y-3">
        {reviews.map((review) => {
          const isMine = user && String(review.userId) === user.id;
          return (
            <li
              key={review.id}
              className="rounded-2xl border border-brand-light bg-cream p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {reviewAuthor(review, !!isMine)}
                  </p>
                  {review.createdAt && (
                    <p className="text-[10px] text-subtle">{formatReviewDate(review.createdAt)}</p>
                  )}
                </div>
                <span className="shrink-0 text-sm font-bold text-brand">★ {review.rating}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink whitespace-pre-wrap">
                {review.content}
              </p>
              {isMine && (
                <button
                  type="button"
                  disabled={deletingId === review.id}
                  onClick={() => handleDelete(review.id)}
                  className="mt-2 text-xs font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
                >
                  {deletingId === review.id ? '삭제 중...' : '삭제'}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {!loading && reviews.length === 0 && !error && (
        <p className="py-6 text-center text-sm text-muted">아직 리뷰가 없습니다. 첫 리뷰를 남겨 보세요!</p>
      )}

      {hasMore && (
        <Button variant="secondary" fullWidth onClick={loadMore} disabled={loading}>
          {loading ? '불러오는 중...' : '리뷰 더 보기'}
        </Button>
      )}
    </section>
  );
}
