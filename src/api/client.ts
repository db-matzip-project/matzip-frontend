import axios, { type AxiosError } from 'axios';

const TOKEN_KEY = 'matzip_access_token';

const REMOTE_API = import.meta.env.VITE_API_BASE_URL ?? '';
const PROXY_TARGET = import.meta.env.VITE_API_PROXY_TARGET ?? '';
const usesNgrok =
  REMOTE_API.includes('ngrok') || PROXY_TARGET.includes('ngrok');

/** 개발: Vite 프록시(/api). 프로덕션: VITE_API_BASE_URL 직접 호출 */
const baseURL = import.meta.env.DEV ? '' : REMOTE_API;

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  const normalized = token?.trim() || null;
  if (normalized) localStorage.setItem(TOKEN_KEY, normalized);
  else localStorage.removeItem(TOKEN_KEY);
}

/** 로그인 응답 필드명 차이(accessToken / token 등) 흡수 */
export function extractAccessToken(
  payload: Record<string, unknown> | null | undefined,
): string {
  if (!payload) return '';
  const raw = payload.accessToken ?? payload.access_token ?? payload.token;
  return typeof raw === 'string' ? raw.trim() : '';
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

function isAuthRequestUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes('/auth/login') || url.includes('/auth/signup');
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
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
  if (usesNgrok) {
    config.headers['ngrok-skip-browser-warning'] = 'true';
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;
    if (status === 401 && getAccessToken() && !isAuthRequestUrl(url)) {
      setAccessToken(null);
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);

type ApiErrorBody = {
  message?: string;
  error?: string;
  code?: string;
};

function readErrorText(error: AxiosError<ApiErrorBody>): string {
  const data = error.response?.data;
  if (typeof data === 'string' && data) return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  return '';
}

/** POST /restaurants/import/kakao 실패 시 — 백엔드 message 그대로 우선 표시 */
export function getImportKakaoErrorMessage(
  error: unknown,
  fallback = '식당을 저장하지 못했습니다.',
): string {
  if (!axios.isAxiosError(error)) return fallback;

  const axiosError = error as AxiosError<ApiErrorBody>;
  const raw = readErrorText(axiosError);
  const code = axiosError.response?.data?.code;
  const status = axiosError.response?.status;
  const prefix = code ? `[${code}] ` : status ? `[HTTP ${status}] ` : '';

  if (raw) {
    const lower = raw.toLowerCase();
    if (lower.includes('kakao_rest_api_key')) {
      return (
        `${prefix}${raw} — 백엔드(Spring) application.yml에 KAKAO_REST_API_KEY 설정 후 서버 재시작이 필요합니다. ` +
        '프론트 VITE_KAKAO_REST_API_KEY와는 별개입니다.'
      );
    }
    return `${prefix}${raw}`;
  }

  if (status === 400) {
    return `${prefix}장소 저장(import) 요청이 거부되었습니다. 개발자도구 Network → Response 본문을 확인하세요.`;
  }

  return getApiErrorMessage(error, fallback);
}

export function getApiErrorMessage(error: unknown, fallback = '요청에 실패했습니다.'): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const raw = readErrorText(axiosError);
    if (raw) return raw;
    if (axiosError.response?.status === 401) {
      const url = axiosError.config?.url ?? '';
      if (isAuthRequestUrl(url)) {
        return '아이디 또는 비밀번호가 올바르지 않습니다.';
      }
      return '로그인이 만료되었습니다. 다시 로그인해 주세요.';
    }
    if (axiosError.response?.status === 403) {
      return '서버에서 요청이 거부되었습니다. (403)';
    }
  }
  return fallback;
}
