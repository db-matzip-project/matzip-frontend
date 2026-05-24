import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../api/client';
import {
  deleteRestaurantReviewApi,
  getRestaurantReviewsApi,
  upsertRestaurantReviewApi,
  type UpsertReviewPayload,
} from '../api/reviews';
import type { ApiReview } from '../api/types';

export function useRestaurantReviews(restaurantId: string | undefined) {
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async (pageToLoad = 0, append = false) => {
    if (!restaurantId) {
      setReviews([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getRestaurantReviewsApi(Number(restaurantId), pageToLoad, 20);
      setReviews((prev) => (append ? [...prev, ...res.content] : res.content));
      setPage(res.page);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (err) {
      setError(getApiErrorMessage(err, '리뷰를 불러오지 못했습니다.'));
      if (!append) setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchReviews(0, false);
  }, [fetchReviews]);

  const loadMore = useCallback(() => {
    if (page + 1 < totalPages) {
      fetchReviews(page + 1, true);
    }
  }, [page, totalPages, fetchReviews]);

  const submitReview = useCallback(
    async (payload: UpsertReviewPayload) => {
      if (!restaurantId) return { ok: false as const, error: '식당 정보가 없습니다.' };
      setSubmitting(true);
      try {
        await upsertRestaurantReviewApi(Number(restaurantId), payload);
        await fetchReviews(0, false);
        return { ok: true as const };
      } catch (err) {
        return { ok: false as const, error: getApiErrorMessage(err, '리뷰 저장에 실패했습니다.') };
      } finally {
        setSubmitting(false);
      }
    },
    [restaurantId, fetchReviews],
  );

  const removeReview = useCallback(
    async (reviewId: number) => {
      if (!restaurantId) return { ok: false as const, error: '식당 정보가 없습니다.' };
      try {
        await deleteRestaurantReviewApi(Number(restaurantId), reviewId);
        await fetchReviews(0, false);
        return { ok: true as const };
      } catch (err) {
        return { ok: false as const, error: getApiErrorMessage(err, '리뷰 삭제에 실패했습니다.') };
      }
    },
    [restaurantId, fetchReviews],
  );

  return {
    reviews,
    loading,
    error,
    submitting,
    totalElements,
    hasMore: page + 1 < totalPages,
    loadMore,
    submitReview,
    removeReview,
    refetch: () => fetchReviews(0, false),
  };
}
