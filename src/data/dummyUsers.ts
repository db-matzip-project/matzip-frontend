import type { User } from '../types/user';

export const DEMO_USERS: User[] = [
  {
    id: 'u-demo',
    name: '맛집탐험가',
    username: 'demo',
    phone: '010-1234-5678',
    password: 'demo1234',
    preferences: ['spicy', 'korean', 'value', 'late-night'],
  },
  {
    id: 'u-new',
    name: '신규유저',
    username: 'newuser',
    phone: '010-9999-0000',
    password: 'pass1234',
    preferences: [],
  },
];
