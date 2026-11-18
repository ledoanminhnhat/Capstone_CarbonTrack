// Màu + emoji dùng chung cho 4 category (khớp với Dashboard)
export const CATEGORY_COLORS: Record<string, string> = {
  Transport: "#3182ce", // xanh dương
  Food: "#ed8936",      // cam
  Energy: "#ecc94b",    // vàng
  Shopping: "#38a169",  // xanh lá
};

export const CATEGORY_EMOJI: Record<string, string> = {
  Transport: "🚌",
  Food: "🍽️",
  Energy: "⚡",
  Shopping: "🛍️",
};

export const categoryColor = (c: string) => CATEGORY_COLORS[c] ?? "#a0aec0";
