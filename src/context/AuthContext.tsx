import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEMO_USERS } from '../data/dummyUsers';
import type { PublicUser, User } from '../types/user';

const SESSION_KEY = 'matzip_session';
const USERS_KEY = 'matzip_users';

export type AuthUser = PublicUser;

type SignUpPayload = {
  name: string;
  username: string;
  password: string;
  phone: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: (username: string, password: string) => AuthUser | null;
  logout: () => void;
  signUp: (payload: SignUpPayload) => { ok: boolean; error?: string };
  updateUser: (patch: Partial<Pick<AuthUser, 'name' | 'phone'>>) => void;
  setPreferences: (preferences: string[]) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toPublicUser(user: User): AuthUser {
  const { password: _, ...publicUser } = user;
  return publicUser;
}

function loadUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    const demoIds = new Set(DEMO_USERS.map((u) => u.id));
    const custom = stored ? (JSON.parse(stored) as User[]) : [];
    return [...DEMO_USERS, ...custom.filter((u) => !demoIds.has(u.id))];
  } catch {
    return [...DEMO_USERS];
  }
}

function saveCustomUsers(users: User[]) {
  const custom = users.filter((u) => !DEMO_USERS.some((d) => d.id === u.id));
  localStorage.setItem(USERS_KEY, JSON.stringify(custom));
}

function findUser(users: User[], username: string, password: string): User | undefined {
  return users.find(
    (u) => u.username === username.trim() && u.password === password,
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(loadUsers);
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (!sessionId) return null;
      const found = loadUsers().find((u) => u.id === sessionId);
      return found ? toPublicUser(found) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    saveCustomUsers(users);
  }, [users]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, user.id);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const syncUserFromStore = useCallback(
    (userId: string) => {
      const found = users.find((u) => u.id === userId);
      if (found) setUser(toPublicUser(found));
    },
    [users],
  );

  const login = useCallback(
    (username: string, password: string): AuthUser | null => {
      const found = findUser(users, username, password);
      if (!found) return null;
      const publicUser = toPublicUser(found);
      setUser(publicUser);
      return publicUser;
    },
    [users],
  );

  const logout = useCallback(() => setUser(null), []);

  const signUp = useCallback(
    (payload: SignUpPayload): { ok: boolean; error?: string } => {
      const username = payload.username.trim();
      if (users.some((u) => u.username === username)) {
        return { ok: false, error: '이미 사용 중인 아이디입니다.' };
      }
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: payload.name.trim(),
        username,
        phone: payload.phone.trim(),
        password: payload.password,
        preferences: [],
      };
      setUsers((prev) => [...prev, newUser]);
      setUser(toPublicUser(newUser));
      return { ok: true };
    },
    [users],
  );

  const updateUser = useCallback(
    (patch: Partial<Pick<AuthUser, 'name' | 'phone'>>) => {
      if (!user) return;
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...patch } : u)),
      );
      setUser((prev) => (prev ? { ...prev, ...patch } : prev));
    },
    [user],
  );

  const setPreferences = useCallback(
    (preferences: string[]) => {
      if (!user) return;
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, preferences } : u)),
      );
      setUser((prev) => (prev ? { ...prev, preferences } : prev));
    },
    [user],
  );

  useEffect(() => {
    if (user) syncUserFromStore(user.id);
  }, [users, user?.id, syncUserFromStore]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      hasCompletedOnboarding: (user?.preferences.length ?? 0) > 0,
      login,
      logout,
      signUp,
      updateUser,
      setPreferences,
    }),
    [user, login, logout, signUp, updateUser, setPreferences],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
