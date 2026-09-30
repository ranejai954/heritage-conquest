/**
 * Tiny fetch client for the MySQL-backed Express API in /server.
 * The JWT is kept in localStorage under `hc_token`.
 */
const BASE = import.meta.env["VITE_API_URL"] ?? "http://localhost:4000";
const TOKEN_KEY = "hc_token";

export type ApiUser = {
  id: string;
  email: string;
  display_name: string | null;
  points: number;
  crystals: number;
};

export type ProgressRow = {
  monument_slug: string;
  minigame_completed: boolean;
  quiz_completed: boolean;
  points_earned: number;
  crystals_earned: number;
  badge_earned: boolean;
  attempts_used: number;
};

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) throw new Error((body["error"] as string) ?? `Request failed (${res.status})`);
  return body as T;
}

export const api = {
  register: (email: string, password: string, display_name?: string) =>
    request<{ token: string; user: ApiUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: ApiUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<{ user: ApiUser }>("/api/me"),
  progress: () => request<{ rows: ProgressRow[] }>("/api/progress"),
  saveProgress: (row: Partial<ProgressRow> & { monument_slug: string }) =>
    request<{ ok: true }>("/api/progress", { method: "POST", body: JSON.stringify(row) }),
};
