import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/constants/app";

/** Kiểm tra ảnh trước khi upload; trả về thông báo lỗi hoặc null. */
export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return `${file.name}: only JPG, PNG or WEBP`;
  if (file.size > MAX_IMAGE_BYTES) return `${file.name}: larger than 5MB`;
  return null;
}
