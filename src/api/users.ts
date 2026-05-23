import { apiClient } from './client';
import type { ApiUser } from './types';

export type UpdateUserRequest = {
  name?: string;
  phone?: string;
  nickname?: string;
  age?: number;
};

export async function getMeApi() {
  const { data } = await apiClient.get<ApiUser>('/api/v1/users/me');
  return data;
}

export async function updateMeApi(body: UpdateUserRequest) {
  const { data } = await apiClient.patch<ApiUser>('/api/v1/users/me', body);
  return data;
}
