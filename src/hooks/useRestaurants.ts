import { useCallback, useEffect, useState } from 'react';
import { getApiErrorMessage } from '../api/client';
import { getRestaurantByIdApi, getRestaurantsApi, type RestaurantListParams } from '../api/restaurants';
import { mapApiRestaurant, mapApiRestaurants } from '../mappers/restaurant';
import type { Restaurant } from '../types/restaurant';

export function useRestaurantList(params: RestaurantListParams = {}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const parsed = JSON.parse(paramsKey) as RestaurantListParams;
        const res = await getRestaurantsApi(parsed);
        if (!cancelled) {
          setRestaurants(mapApiRestaurants(res.content));
          setTotalElements(res.totalElements);
        }
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paramsKey]);

  return { restaurants, totalElements, loading, error };
}

export function useRestaurantDetail(id: string | undefined) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) {
      setRestaurant(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getRestaurantByIdApi(Number(id));
      setRestaurant(mapApiRestaurant(data));
    } catch (err) {
      setError(getApiErrorMessage(err));
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { restaurant, loading, error, refetch: fetch };
}
