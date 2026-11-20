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

// ----- Quên mật khẩu -----

/** Gửi mail đặt lại mật khẩu. Backend luôn trả lời giống nhau dù email có tài khoản hay không. */
export const forgotPassword = (email: string) =>
  request<{ message: string }>("/api/auth/forgot-password", { method: "POST", body: { email }, auth: false });

/** Kiểm tra link đặt lại còn dùng được không (ném lỗi nếu hết hạn / sai). */
export const validateResetToken = (token: string) =>
  request(`/api/auth/reset-password/validate?token=${encodeURIComponent(token)}`, { auth: false });

export const resetPassword = (token: string, password: string) =>
  request("/api/auth/reset-password", { method: "POST", body: { token, password }, auth: false });
