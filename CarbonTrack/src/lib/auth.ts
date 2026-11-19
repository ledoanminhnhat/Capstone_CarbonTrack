// Helper gọi API auth + quản lý token đăng nhập (lưu ở localStorage).

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const TOKEN_KEY = "ct_token";
const USER_KEY = "ct_user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  avatarUrl?: string | null;
}

export const USER_UPDATED_EVENT = "ct-user-updated";

interface AuthResponse extends AuthUser {
  token: string;
}

// ---- Lưu / đọc token & user ----
// remember=true -> localStorage (nhớ lâu); false -> sessionStorage (hết phiên là mất)
export function saveAuth(data: AuthResponse, remember: boolean = true) {
  const { token, ...user } = data;
  try {
    // xóa ở cả 2 nơi trước để tránh "mồ côi"
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
  const store = remember ? localStorage : sessionStorage;
  store.setItem(TOKEN_KEY, token);
  store.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

/** Sửa thông tin user đang lưu (giữ nguyên nơi lưu local/session) và báo cho sidebar cập nhật. */
export function updateStoredUser(patch: Partial<AuthUser>) {
  if (typeof window === "undefined") return;
  const store = localStorage.getItem(USER_KEY) ? localStorage : sessionStorage;
  const current = getUser();
  if (!current) return;
  store.setItem(USER_KEY, JSON.stringify({ ...current, ...patch }));
  window.dispatchEvent(new Event(USER_UPDATED_EVENT));
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

// ---- Gọi API ----

// Rút thông điệp lỗi gọn gàng từ response
async function readError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}

export async function login(
  email: string,
  password: string,
  remember: boolean = true
): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Incorrect email or password");
    throw new Error(await readError(res));
  }

  const data: AuthResponse = await res.json();
  saveAuth(data, remember);
  return getUser()!;
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    if (res.status === 409) throw new Error("This email is already registered");
    throw new Error(await readError(res));
  }

  const data: AuthResponse = await res.json();
  saveAuth(data);
  return getUser()!;
}

// Dùng cho các API cần đăng nhập: tự đính kèm token
export async function authFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
}
