import axios, { type AxiosError } from 'axios';

const TOKEN_KEY = 'matzip_access_token';

const REMOTE_API =
  import.meta.env.VITE_API_BASE_URL ??
  'https://unthread-book-salvation.ngrok-free.dev';

/** 개발 시 Vite 프록시(/api → ngrok) 사용 — CORS·Referer 이슈 방지 */
const baseURL = import.meta.env.DEV ? '' : REMOTE_API;

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env.DEV ? {} : { 'ngrok-skip-browser-warning': 'true' }),
  },
});

function toAuthorizationHeader(token: string): string {
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = toAuthorizationHeader(token);
  }
  return config;
});

export function getApiErrorMessage(error: unknown, fallback = '요청에 실패했습니다.'): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const data = axiosError.response?.data;
    if (typeof data === 'string' && data) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (axiosError.response?.status === 401) return '아이디 또는 비밀번호가 올바르지 않습니다.';
    if (axiosError.response?.status === 403) {
      return '서버에서 요청이 거부되었습니다. (403) 백엔드 보안 설정을 확인해 주세요.';
    }
  }
  return fallback;
}
