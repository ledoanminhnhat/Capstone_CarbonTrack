// Helper gọi API dùng chung: tự gắn token, đọc lỗi từ backend, parse JSON.
import { API_URL } from "@/constants/app";
import { getToken } from "./session";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** gắn token (mặc định true) */
  auth?: boolean;
  /** thông báo riêng theo mã lỗi, vd { 401: "Incorrect email or password" } */
  errors?: Record<number, string>;
}

async function readError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}

/** Gọi API backend; trả về JSON (hoặc undefined nếu không có nội dung). */
export async function request<T = void>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, errors } = opts;
  const token = auth ? getToken() : null;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new ApiError(res.status, errors?.[res.status] ?? (await readError(res)));
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Tạo query string, bỏ qua giá trị rỗng. */
export function query(params: Record<string, string | number | undefined | null>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}
