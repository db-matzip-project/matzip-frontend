import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getPreferenceCatalogApi } from '../api/preferences';
import { getApiErrorMessage } from '../api/client';
import type { PreferenceCatalogItem } from '../api/types';

type PreferenceContextValue = {
  catalog: PreferenceCatalogItem[];
  loading: boolean;
  getPreferenceIdByCode: (code: string) => number | undefined;
  getCodesByIds: (ids: number[]) => string[];
  getIdsByCodes: (codes: string[]) => number[];
};

const PreferenceContext = createContext<PreferenceContextValue | null>(null);

export function PreferenceProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<PreferenceCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPreferenceCatalogApi();
        if (!cancelled) setCatalog(data);
      } catch (error) {
        console.error(getApiErrorMessage(error, '취향 목록을 불러오지 못했습니다.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getPreferenceIdByCode = useCallback(
    (code: string) => catalog.find((p) => p.code === code)?.id,
    [catalog],
  );

  const getCodesByIds = useCallback(
    (ids: number[]) =>
      ids
        .map((id) => catalog.find((p) => p.id === id)?.code)
        .filter((c): c is string => !!c),
    [catalog],
  );

  const getIdsByCodes = useCallback(
    (codes: string[]) =>
      codes
        .map((code) => catalog.find((p) => p.code === code)?.id)
        .filter((id): id is number => id !== undefined),
    [catalog],
  );

  const value = useMemo(
    () => ({
      catalog,
      loading,
      getPreferenceIdByCode,
      getCodesByIds,
      getIdsByCodes,
    }),
    [catalog, loading, getPreferenceIdByCode, getCodesByIds, getIdsByCodes],
  );

  return (
    <PreferenceContext.Provider value={value}>{children}</PreferenceContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferenceContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferenceProvider');
  return ctx;
}
