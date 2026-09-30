import { useCallback, useEffect, useState } from "react";

import { api, getToken, setToken, type ApiUser } from "@/lib/api";

/** Session hook backed by the MySQL API (JWT in localStorage). */
export function useAuth() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api
      .me()
      .then(({ user: current }) => {
        if (!cancelled) setUser(current);
      })
      .catch(() => {
        setToken(null);
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { token, user: next } = await api.login(email, password);
    setToken(token);
    setUser(next);
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    const { token, user: next } = await api.register(email, password, displayName);
    setToken(token);
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return { user, loading, signIn, signUp, signOut };
}
