import { useCallback, useEffect, useState } from 'react';
import { getMyReviewsApi } from '../api/reviews';
import { getApiErrorMessage } from '../api/client';
import type { MyReviewResponse } from '../api/types';

const PAGE_SIZE = 3;

export function useMyReviews(enabled: boolean) {
  const [reviews, setReviews] = useState<MyReviewResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = page + 1 < totalPages;

  const fetchPage = useCallback(
    async (pageToLoad: number, append: boolean) => {
      if (!enabled) return;
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      try {
        const res = await getMyReviewsApi(pageToLoad, PAGE_SIZE);
        setReviews((prev) => (append ? [...prev, ...res.content] : res.content));
        setPage(res.page);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      } catch (err) {
        setError(getApiErrorMessage(err, '내 리뷰를 불러오지 못했습니다.'));
        if (!append) {
          setReviews([]);
          setTotalElements(0);
          setTotalPages(0);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [enabled],
  );

  const refetch = useCallback(() => fetchPage(0, false), [fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading) return;
    fetchPage(page + 1, true);
  }, [hasMore, loadingMore, loading, page, fetchPage]);

  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  return {
    reviews,
    totalElements,
    hasMore,
    loading,
    loadingMore,
    error,
    loadMore,
    refetch,
  };
}
