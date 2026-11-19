// Lưu / đọc token + user đăng nhập.
// remember=true -> localStorage (nhớ lâu); false -> sessionStorage (hết phiên là mất).
import type { AuthResponse, AuthUser } from "@/types";

const TOKEN_KEY = "ct_token";
const USER_KEY = "ct_user";

/** Bắn ra khi user đang lưu thay đổi (đổi tên, avatar) để UI cập nhật. */
export const USER_UPDATED_EVENT = "ct-user-updated";

const isBrowser = () => typeof window !== "undefined";

function clearAll() {
  for (const store of [localStorage, sessionStorage]) {
    store.removeItem(TOKEN_KEY);
    store.removeItem(USER_KEY);
  }
}

export function saveSession(data: AuthResponse, remember = true) {
  const { token, ...user } = data;
  clearAll(); // tránh token "mồ côi" ở nơi còn lại
  const store = remember ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, token);
  store.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

/** Sửa user đang lưu (giữ nguyên nơi lưu) và báo cho UI. */
export function updateStoredUser(patch: Partial<AuthUser>) {
  if (!isBrowser()) return;
  const current = getStoredUser();
  if (!current) return;
  const store = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
  store.setItem(USER_KEY, JSON.stringify({ ...current, ...patch }));
  window.dispatchEvent(new Event(USER_UPDATED_EVENT));
}

export const isLoggedIn = () => !!getToken();

export function clearSession() {
  if (isBrowser()) clearAll();
}
