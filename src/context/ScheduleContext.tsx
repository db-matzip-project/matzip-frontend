import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getApiErrorMessage } from '../api/client';
import {
  addScheduleItemApi,
  addScheduleItemFromPlaceApi,
  createScheduleApi,
  deleteScheduleApi,
  getScheduleByIdApi,
  getSchedulesApi,
  removeScheduleItemApi,
  reorderScheduleItemsApi,
  updateScheduleApi,
} from '../api/schedules';
import { mapScheduleDetail, mapScheduleListItem } from '../mappers/schedule';
import type { SchedulePlacePayload } from '../types/place';
import type { Schedule } from '../types/schedule';
import { useAuth } from './AuthContext';

type CreateScheduleInput = {
  title: string;
  date: string;
  memo?: string;
  restaurantIds?: string[];
  /** 카카오 검색만 된 장소 (from-place로 일정 생성 시 추가) */
  places?: SchedulePlacePayload[];
};

type UpdateScheduleInput = Partial<
  Pick<Schedule, 'title' | 'date' | 'memo' | 'restaurantIds'>
>;

type ScheduleContextValue = {
  schedules: Schedule[];
  loading: boolean;
  error: string | null;
  getSchedule: (id: string) => Schedule | undefined;
  fetchScheduleDetail: (id: string) => Promise<Schedule | null>;
  createSchedule: (input: CreateScheduleInput) => Promise<Schedule>;
  updateSchedule: (id: string, patch: UpdateScheduleInput) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  addRestaurant: (scheduleId: string, restaurantId: string, memo?: string) => Promise<void>;
  addRestaurantFromPlace: (
    scheduleId: string,
    place: SchedulePlacePayload,
    memo?: string,
  ) => Promise<void>;
  removeRestaurant: (scheduleId: string, restaurantId: string) => Promise<void>;
  reorderRestaurants: (scheduleId: string, restaurantIds: string[]) => Promise<void>;
  refreshSchedules: () => Promise<void>;
};

const ScheduleContext = createContext<ScheduleContextValue | null>(null);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [scheduleDetails, setScheduleDetails] = useState<Record<string, Schedule>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSchedules = useCallback(async () => {
    if (!isAuthenticated) {
      setSchedules([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await getSchedulesApi();
      setSchedules(
        list
          .map(mapScheduleListItem)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshSchedules();
  }, [refreshSchedules]);

  const fetchScheduleDetail = useCallback(async (id: string): Promise<Schedule | null> => {
    try {
      const detail = await getScheduleByIdApi(Number(id));
      const mapped = mapScheduleDetail(detail);
      setScheduleDetails((prev) => ({ ...prev, [id]: mapped }));
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...mapped, itemCount: mapped.restaurantIds.length } : s)),
      );
      return mapped;
    } catch {
      return null;
    }
  }, []);

  const getSchedule = useCallback(
    (id: string) => scheduleDetails[id] ?? schedules.find((s) => s.id === id),
    [scheduleDetails, schedules],
  );

  const createSchedule = useCallback(async (input: CreateScheduleInput): Promise<Schedule> => {
    let schedule = mapScheduleDetail(
      await createScheduleApi({
        title: input.title.trim(),
        travelDate: input.date,
      }),
    );

    for (const [index, restaurantId] of (input.restaurantIds ?? []).entries()) {
      schedule = mapScheduleDetail(
        await addScheduleItemApi(Number(schedule.id), {
          restaurantId: Number(restaurantId),
          memo: index === 0 ? input.memo?.trim() || undefined : undefined,
        }),
      );
    }

    for (const [index, place] of (input.places ?? []).entries()) {
      const useMemo =
        (input.restaurantIds?.length ?? 0) === 0 && index === 0
          ? input.memo?.trim() || undefined
          : undefined;
      schedule = mapScheduleDetail(
        await addScheduleItemFromPlaceApi(Number(schedule.id), { place, memo: useMemo }),
      );
    }

    setScheduleDetails((prev) => ({ ...prev, [schedule.id]: schedule }));
    setSchedules((prev) => [schedule, ...prev]);
    return schedule;
  }, []);

  const updateSchedule = useCallback(async (id: string, patch: UpdateScheduleInput) => {
    const current = scheduleDetails[id] ?? schedules.find((s) => s.id === id);
    if (!current) return;

    if (patch.title !== undefined || patch.date !== undefined) {
      const updated = mapScheduleDetail(
        await updateScheduleApi(Number(id), {
          title: patch.title?.trim(),
          travelDate: patch.date,
        }),
      );
      setScheduleDetails((prev) => ({
        ...prev,
        [id]: { ...prev[id], ...updated, restaurantIds: current.restaurantIds, items: current.items },
      }));
    }

    if (patch.restaurantIds) {
      const currentIds = new Set(current.restaurantIds);
      const nextIds = patch.restaurantIds;
      const toAdd = nextIds.filter((rid) => !currentIds.has(rid));
      const toRemove = current.restaurantIds.filter((rid) => !nextIds.includes(rid));

      let detail = current.items.length
        ? mapScheduleDetail(await getScheduleByIdApi(Number(id)))
        : current;

      for (const rid of toRemove) {
        const item = detail.items.find((i) => i.restaurantId === rid);
        if (item) {
          detail = mapScheduleDetail(
            await removeScheduleItemApi(Number(id), item.itemId),
          );
        }
      }

      for (const rid of toAdd) {
        detail = mapScheduleDetail(
          await addScheduleItemApi(Number(id), { restaurantId: Number(rid) }),
        );
      }

      if (nextIds.length > 0) {
        detail = mapScheduleDetail(
          await reorderScheduleItemsApi(Number(id), {
            orderedRestaurantIds: nextIds.map(Number),
          }),
        );
      }

      setScheduleDetails((prev) => ({ ...prev, [id]: detail }));
      setSchedules((prev) => prev.map((s) => (s.id === id ? detail : s)));
    }
  }, [scheduleDetails, schedules]);

  const deleteSchedule = useCallback(async (id: string) => {
    await deleteScheduleApi(Number(id));
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    setScheduleDetails((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const addRestaurant = useCallback(
    async (scheduleId: string, restaurantId: string, memo?: string) => {
      const detail = mapScheduleDetail(
        await addScheduleItemApi(Number(scheduleId), {
          restaurantId: Number(restaurantId),
          memo,
        }),
      );
      setScheduleDetails((prev) => ({ ...prev, [scheduleId]: detail }));
      setSchedules((prev) => prev.map((s) => (s.id === scheduleId ? detail : s)));
    },
    [],
  );

  const addRestaurantFromPlace = useCallback(
    async (scheduleId: string, place: SchedulePlacePayload, memo?: string) => {
      try {
        const detail = mapScheduleDetail(
          await addScheduleItemFromPlaceApi(Number(scheduleId), { place, memo }),
        );
        setScheduleDetails((prev) => ({ ...prev, [scheduleId]: detail }));
        setSchedules((prev) => prev.map((s) => (s.id === scheduleId ? detail : s)));
      } catch (err) {
        throw new Error(getApiErrorMessage(err, '장소를 일정에 추가하지 못했습니다.'));
      }
    },
    [],
  );

  const removeRestaurant = useCallback(
    async (scheduleId: string, restaurantId: string) => {
      const current = scheduleDetails[scheduleId] ?? schedules.find((s) => s.id === scheduleId);
      const item = current?.items.find((i) => i.restaurantId === restaurantId);
      if (!item) return;

      const detail = mapScheduleDetail(
        await removeScheduleItemApi(Number(scheduleId), item.itemId),
      );
      setScheduleDetails((prev) => ({ ...prev, [scheduleId]: detail }));
      setSchedules((prev) => prev.map((s) => (s.id === scheduleId ? detail : s)));
    },
    [scheduleDetails, schedules],
  );

  const reorderRestaurants = useCallback(
    async (scheduleId: string, restaurantIds: string[]) => {
      const detail = mapScheduleDetail(
        await reorderScheduleItemsApi(Number(scheduleId), {
          orderedRestaurantIds: restaurantIds.map(Number),
        }),
      );
      setScheduleDetails((prev) => ({ ...prev, [scheduleId]: detail }));
      setSchedules((prev) => prev.map((s) => (s.id === scheduleId ? detail : s)));
    },
    [],
  );

  const value = useMemo(
    () => ({
      schedules,
      loading,
      error,
      getSchedule,
      fetchScheduleDetail,
      createSchedule,
      updateSchedule,
      deleteSchedule,
      addRestaurant,
      addRestaurantFromPlace,
      removeRestaurant,
      reorderRestaurants,
      refreshSchedules,
    }),
    [
      schedules,
      loading,
      error,
      getSchedule,
      fetchScheduleDetail,
      createSchedule,
      updateSchedule,
      deleteSchedule,
      addRestaurant,
      addRestaurantFromPlace,
      removeRestaurant,
      reorderRestaurants,
      refreshSchedules,
    ],
  );

  return (
    <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>
  );
}

export function useSchedules() {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useSchedules must be used within ScheduleProvider');
  return ctx;
}
