/** Lấy message từ lỗi bất kỳ. */
export const errorMessage = (e: unknown, fallback = "Something went wrong") =>
  e instanceof Error && e.message ? e.message : fallback;
