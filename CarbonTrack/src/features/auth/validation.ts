export const MIN_PASSWORD_LENGTH = 6;

/** Kiểm tra mật khẩu mới + nhập lại; trả về lỗi hoặc null. Dùng ở Register và Settings. */
export function validateNewPassword(password: string, confirm: string): string | null {
  if (password !== confirm) return "Passwords do not match";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  return null;
}
