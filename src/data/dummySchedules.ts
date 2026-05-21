import type { Schedule } from '../types/schedule';

export const DEMO_SCHEDULE_SEEDS: Omit<Schedule, 'userId'>[] = [
  {
    id: 's1',
    title: '합정·연남 맛집 투어',
    date: '2026-05-24',
    memo: '오후 2시부터 시작',
    restaurantIds: ['r7', 'r1', 'r3'],
    createdAt: '2026-05-20T10:00:00.000Z',
    updatedAt: '2026-05-20T10:00:00.000Z',
  },
  {
    id: 's2',
    title: '강남 데이트 코스',
    date: '2026-05-31',
    memo: '저녁 예약 필수',
    restaurantIds: ['r2', 'r9'],
    createdAt: '2026-05-18T14:00:00.000Z',
    updatedAt: '2026-05-19T09:00:00.000Z',
  },
];
