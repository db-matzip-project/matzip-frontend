import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loginApi, logoutApi, signUpApi } from '../api/auth';
import {
  extractAccessToken,
  getAccessToken,
  getApiErrorMessage,
  setAccessToken,
  setUnauthorizedHandler,
} from '../api/client';
import { getMyPreferencesApi, updateMyPreferencesApi } from '../api/preferences';
import { getMeApi, updateMeApi } from '../api/users';
import { mapApiUser, preferenceCodesFromApi } from '../mappers/user';
import type { PublicUser } from '../types/user';
import { usePreferences } from './PreferenceContext';

export type AuthUser = PublicUser;

type SignUpPayload = {
  name: string;
  username: string;
  password: string;
  phone: string;
  age?: number;
};

type AuthResult = { ok: boolean; error?: string; user?: AuthUser };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<AuthResult>;
  updateUser: (patch: Partial<Pick<AuthUser, 'name' | 'phone' | 'nickname' | 'age'>>) => Promise<AuthResult>;
  setPreferences: (preferenceCodes: string[]) => Promise<AuthResult>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchUserWithPreferences(): Promise<AuthUser | null> {
  const [apiUser, prefs] = await Promise.all([getMeApi(), getMyPreferencesApi()]);
  const codes = preferenceCodesFromApi(prefs);
  return mapApiUser(apiUser, codes);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { getIdsByCodes } = usePreferences();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      return;
    }
    try {
      const next = await fetchUserWithPreferences();
      setUser(next);
    } catch {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/signup') {
        window.location.assign('/login');
      }
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getAccessToken()) {
        if (!cancelled) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }
      try {
        const next = await fetchUserWithPreferences();
        if (!cancelled) setUser(next);
      } catch {
        setAccessToken(null);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<AuthResult> => {
      try {
        const res = await loginApi({
          loginId: username.trim(),
          password,
        });
        const token = extractAccessToken(res as unknown as Record<string, unknown>);
        if (!token) {
          return {
            ok: false,
            error: '로그인 응답에 토큰이 없습니다. 백엔드 accessToken 필드를 확인해 주세요.',
          };
        }
        setAccessToken(token);
        const prefs = await getMyPreferencesApi();
        const publicUser = mapApiUser(res.user, preferenceCodesFromApi(prefs));
        setUser(publicUser);
        return { ok: true, user: publicUser };
      } catch (error) {
        return {
          ok: false,
          error: getApiErrorMessage(error, '아이디 또는 비밀번호가 올바르지 않습니다.'),
        };
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      /* 토큰 만료 등으로 실패해도 로컬 세션은 제거 */
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const signUp = useCallback(
    async (payload: SignUpPayload): Promise<AuthResult> => {
      try {
        const res = await signUpApi({
          loginId: payload.username.trim(),
          password: payload.password,
          name: payload.name.trim(),
          phone: payload.phone.trim(),
          nickname: payload.name.trim(),
          age: payload.age ?? 20,
        });
        const token = extractAccessToken(res as unknown as Record<string, unknown>);
        if (!token) {
          return {
            ok: false,
            error: '회원가입 응답에 토큰이 없습니다. 백엔드 accessToken 필드를 확인해 주세요.',
          };
        }
        setAccessToken(token);
        const publicUser = mapApiUser(res.user, []);
        setUser(publicUser);
        return { ok: true, user: publicUser };
      } catch (error) {
        return {
          ok: false,
          error: getApiErrorMessage(error, '회원가입에 실패했습니다.'),
        };
      }
    },
    [],
  );

  const updateUser = useCallback(
    async (
      patch: Partial<Pick<AuthUser, 'name' | 'phone' | 'nickname' | 'age'>>,
    ): Promise<AuthResult> => {
      if (!user) return { ok: false, error: '로그인이 필요합니다.' };
      try {
        const updated = await updateMeApi({
          name: patch.name,
          phone: patch.phone,
          nickname: patch.nickname,
          age: patch.age,
        });
        const prefs = await getMyPreferencesApi();
        const next = mapApiUser(updated, preferenceCodesFromApi(prefs));
        setUser(next);
        return { ok: true, user: next };
      } catch (error) {
        return { ok: false, error: getApiErrorMessage(error) };
      }
    },
    [user],
  );

  const setPreferences = useCallback(
    async (preferenceCodes: string[]): Promise<AuthResult> => {
      if (!user) return { ok: false, error: '로그인이 필요합니다.' };
      try {
        const ids = getIdsByCodes(preferenceCodes);
        const updated = await updateMyPreferencesApi(ids);
        const codes = preferenceCodesFromApi(updated);
        const next = { ...user, preferences: codes };
        setUser(next);
        return { ok: true, user: next };
      } catch (error) {
        return { ok: false, error: getApiErrorMessage(error) };
      }
    },
    [user, getIdsByCodes],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      hasCompletedOnboarding: (user?.preferences.length ?? 0) > 0,
      isLoading,
      login,
      logout,
      signUp,
      updateUser,
      setPreferences,
      refreshUser,
    }),
    [user, isLoading, login, logout, signUp, updateUser, setPreferences, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
