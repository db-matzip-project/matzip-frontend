import { apiClient } from './client';
import type { AuthResponse } from './types';

export type LoginRequest = {
  loginId: string;
  password: string;
};

export type SignUpRequest = {
  loginId: string;
  password: string;
  name: string;
  phone: string;
  nickname?: string;
  age?: number;
};

export async function loginApi(body: LoginRequest) {
  const { data } = await apiClient.post<AuthResponse>('/api/v1/auth/login', body);
  return data;
}

export async function signUpApi(body: SignUpRequest) {
  const { data } = await apiClient.post<AuthResponse>('/api/v1/auth/signup', body);
  return data;
}

export async function logoutApi() {
  await apiClient.post('/api/v1/auth/logout');
}
