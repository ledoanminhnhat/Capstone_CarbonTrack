export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// ----- Mục tiêu phát thải (đặt theo năm ở Settings → Tracking) -----
export const DEFAULT_YEARLY_GOAL_KG = 1800; // = 150 kg/tháng (khớp backend)
export const MIN_YEARLY_GOAL_KG = 100;
export const MAX_YEARLY_GOAL_KG = 100000;

/** Ngưỡng "High" của 1 activity (khớp backend). */
export const HIGH_EMISSION_KG = 5;

export const PAGE_SIZE = {
  history: 8,
  adminUsers: 10,
} as const;

// ----- Community -----
export const MAX_POST_CONTENT = 5000;
export const MAX_POST_IMAGES = 3;
export const MAX_COMMENT_LENGTH = 1000;

// ----- Ảnh upload -----
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(",");
