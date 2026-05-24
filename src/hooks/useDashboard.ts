import { useEffect, useState } from 'react';
import { getDashboardMeApi } from '../api/dashboard';
import { getApiErrorMessage } from '../api/client';
import type { DashboardMeResponse } from '../api/types';

export function useDashboard(enabled = true) {
  const [stats, setStats] = useState<DashboardMeResponse | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStats(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await getDashboardMeApi();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, '대시보드를 불러오지 못했습니다.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { stats, loading, error };
}
