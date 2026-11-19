import type { AuthResponse, AuthUser } from "@/types";
import { request } from "@/services/http";
import { clearSession, getStoredUser, saveSession } from "@/services/session";

export async function login(email: string, password: string, remember = true): Promise<AuthUser> {
  const data = await request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
    errors: { 401: "Incorrect email or password" },
  });
  saveSession(data, remember);
  return getStoredUser()!;
}

export async function register(name: string, email: string, password: string): Promise<AuthUser> {
  const data = await request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: { name, email, password },
    auth: false,
    errors: { 409: "This email is already registered" },
  });
  saveSession(data);
  return getStoredUser()!;
}

export const logout = () => clearSession();

/** Đăng nhập / đăng ký bằng Google: gửi access token cho backend xác minh, nhận JWT như login thường. */
export async function loginWithGoogle(accessToken: string): Promise<AuthUser> {
  const data = await request<AuthResponse>("/api/auth/google", {
    method: "POST",
    body: { accessToken },
    auth: false,
    errors: { 401: "Google sign-in failed", 503: "Google sign-in is not configured" },
  });
  saveSession(data);
  return getStoredUser()!;
}
