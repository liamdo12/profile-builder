/**
 * Auth context — provides user state, login, register, and logout to the app.
 * On mount, hydrates from localStorage token via /auth/me.
 */
import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { loginApi, registerApi, fetchCurrentUser } from '../api/auth-api';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';
import { AuthContext } from './auth-context-value';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const hasToken = Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(hasToken);

  // Hydrate user state from stored token on mount
  useEffect(() => {
    if (!hasToken) return;

    let cancelled = false;
    fetchCurrentUser()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        // Token invalid or expired — clear storage
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hasToken]);

  async function login(payload: LoginRequest) {
    const response = await loginApi(payload);
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    setUser(response.user);
  }

  async function register(payload: RegisterRequest) {
    const response = await registerApi(payload);
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    setUser(response.user);
  }

  function logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, isLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
