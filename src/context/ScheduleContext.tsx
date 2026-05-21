import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEMO_SCHEDULE_SEEDS } from '../data/dummySchedules';
import type { Schedule } from '../types/schedule';
import { useAuth } from './AuthContext';

const SCHEDULES_KEY = 'matzip_schedules';

type CreateScheduleInput = {
  title: string;
  date: string;
  memo?: string;
  restaurantIds?: string[];
};

type UpdateScheduleInput = Partial<
  Pick<Schedule, 'title' | 'date' | 'memo' | 'restaurantIds'>
>;

type ScheduleContextValue = {
  schedules: Schedule[];
  getSchedule: (id: string) => Schedule | undefined;
  createSchedule: (input: CreateScheduleInput) => Schedule;
  updateSchedule: (id: string, patch: UpdateScheduleInput) => void;
  deleteSchedule: (id: string) => void;
  addRestaurant: (scheduleId: string, restaurantId: string) => void;
  removeRestaurant: (scheduleId: string, restaurantId: string) => void;
  reorderRestaurants: (scheduleId: string, restaurantIds: string[]) => void;
};

const ScheduleContext = createContext<ScheduleContextValue | null>(null);

function loadAllSchedules(): Schedule[] {
  try {
    const stored = localStorage.getItem(SCHEDULES_KEY);
    return stored ? (JSON.parse(stored) as Schedule[]) : [];
  } catch {
    return [];
  }
}

function saveAllSchedules(schedules: Schedule[]) {
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
}

function seedForUser(userId: string, existing: Schedule[]): Schedule[] {
  const hasSeeds = existing.some(
    (s) => s.userId === userId && DEMO_SCHEDULE_SEEDS.some((d) => d.id === s.id),
  );
  if (hasSeeds) return existing;

  const seeds = DEMO_SCHEDULE_SEEDS.map((seed) => ({
    ...seed,
    userId,
  }));
  return [...existing, ...seeds];
}

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [allSchedules, setAllSchedules] = useState<Schedule[]>(loadAllSchedules);

  useEffect(() => {
    saveAllSchedules(allSchedules);
  }, [allSchedules]);

  useEffect(() => {
    if (!user) return;
    setAllSchedules((prev) => seedForUser(user.id, prev));
  }, [user?.id]);

  const schedules = useMemo(
    () =>
      user
        ? [...allSchedules.filter((s) => s.userId === user.id)].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
        : [],
    [allSchedules, user],
  );

  const getSchedule = useCallback(
    (id: string) => schedules.find((s) => s.id === id),
    [schedules],
  );

  const createSchedule = useCallback(
    (input: CreateScheduleInput): Schedule => {
      if (!user) throw new Error('로그인이 필요합니다.');
      const now = new Date().toISOString();
      const schedule: Schedule = {
        id: `sch-${Date.now()}`,
        userId: user.id,
        title: input.title.trim(),
        date: input.date,
        memo: input.memo?.trim() ?? '',
        restaurantIds: input.restaurantIds ?? [],
        createdAt: now,
        updatedAt: now,
      };
      setAllSchedules((prev) => [...prev, schedule]);
      return schedule;
    },
    [user],
  );

  const updateSchedule = useCallback((id: string, patch: UpdateScheduleInput) => {
    setAllSchedules((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...patch,
              title: patch.title?.trim() ?? s.title,
              memo: patch.memo !== undefined ? patch.memo.trim() : s.memo,
              updatedAt: new Date().toISOString(),
            }
          : s,
      ),
    );
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setAllSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addRestaurant = useCallback((scheduleId: string, restaurantId: string) => {
    setAllSchedules((prev) =>
      prev.map((s) => {
        if (s.id !== scheduleId || s.restaurantIds.includes(restaurantId)) return s;
        return {
          ...s,
          restaurantIds: [...s.restaurantIds, restaurantId],
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }, []);

  const removeRestaurant = useCallback(
    (scheduleId: string, restaurantId: string) => {
      setAllSchedules((prev) =>
        prev.map((s) =>
          s.id === scheduleId
            ? {
                ...s,
                restaurantIds: s.restaurantIds.filter((id) => id !== restaurantId),
                updatedAt: new Date().toISOString(),
              }
            : s,
        ),
      );
    },
    [],
  );

  const reorderRestaurants = useCallback(
    (scheduleId: string, restaurantIds: string[]) => {
      setAllSchedules((prev) =>
        prev.map((s) =>
          s.id === scheduleId
            ? { ...s, restaurantIds, updatedAt: new Date().toISOString() }
            : s,
        ),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      schedules,
      getSchedule,
      createSchedule,
      updateSchedule,
      deleteSchedule,
      addRestaurant,
      removeRestaurant,
      reorderRestaurants,
    }),
    [
      schedules,
      getSchedule,
      createSchedule,
      updateSchedule,
      deleteSchedule,
      addRestaurant,
      removeRestaurant,
      reorderRestaurants,
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
