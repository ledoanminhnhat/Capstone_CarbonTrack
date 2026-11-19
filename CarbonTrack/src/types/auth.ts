export type Role = "USER" | "ADMIN";

/** Thông tin user đang đăng nhập (lưu ở local/sessionStorage). */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
}

export interface AuthResponse extends AuthUser {
  token: string;
}
