import type { Category } from "@/features/activities/types";

/** Thứ tự hiển thị 4 category. */
export const CATEGORIES: Category[] = ["Transport", "Food", "Energy", "Shopping"];

/** Màu mỗi category (biểu đồ, chấm màu). */
export const CATEGORY_COLORS: Record<Category, string> = {
  Transport: "#3182ce",
  Food: "#ed8936",
  Energy: "#ecc94b",
  Shopping: "#38a169",
};

export const categoryColor = (c: string) => CATEGORY_COLORS[c as Category] ?? "#a0aec0";

/** Bản đậm hơn của màu category, cho chữ trong badge (vàng gốc khó đọc trên nền nhạt). */
export const CATEGORY_TEXT_COLORS: Record<Category, string> = {
  Transport: "#2b6cb0",
  Food: "#c05621",
  Energy: "#b7791f",
  Shopping: "#2f855a",
};

export const categoryTextColor = (c: string) => CATEGORY_TEXT_COLORS[c as Category] ?? "#4a5568";

/** Class Tailwind cho tab category trong modal Log Activity. */
export const CATEGORY_TAB_STYLE: Record<Category, { active: string; icon: string }> = {
  Transport: { active: "border-sky-500 bg-sky-50 text-sky-700", icon: "text-sky-500" },
  Food: { active: "border-orange-500 bg-orange-50 text-orange-700", icon: "text-orange-500" },
  Energy: { active: "border-amber-500 bg-amber-50 text-amber-700", icon: "text-amber-500" },
  Shopping: { active: "border-violet-500 bg-violet-50 text-violet-700", icon: "text-violet-500" },
};

export interface SubCategory {
  value: string; // khớp với backend EmissionService
  label: string;
  emoji: string;
}

/** Sub-category theo từng category + nhãn ô nhập + đơn vị. */
export const CATEGORY_CONFIG: Record<
  Category,
  { amountLabel: string; unit: string; emoji: string; subCategories: SubCategory[] }
> = {
  Transport: {
    amountLabel: "Distance (km)",
    unit: "km",
    emoji: "🚌",
    subCategories: [
      { value: "Motorbike", label: "Motorbike", emoji: "🏍️" },
      { value: "Car", label: "Car", emoji: "🚗" },
      { value: "Bus", label: "Bus", emoji: "🚌" },
      { value: "Plane", label: "Plane", emoji: "✈️" },
    ],
  },
  Food: {
    amountLabel: "Amount (kg)",
    unit: "kg",
    emoji: "🍽️",
    subCategories: [
      { value: "Red Meat", label: "Red Meat", emoji: "🥩" },
      { value: "White Meat", label: "White Meat / Seafood", emoji: "🍗" },
      { value: "Vegetarian", label: "Vegetarian / Vegan", emoji: "🥗" },
    ],
  },
  Energy: {
    amountLabel: "Amount (kWh / m³)",
    unit: "kWh / m³",
    emoji: "⚡",
    subCategories: [
      { value: "Electricity", label: "Electricity", emoji: "⚡" },
      { value: "Gas", label: "Natural Gas", emoji: "🔥" },
      { value: "Water", label: "Water", emoji: "💧" },
    ],
  },
  Shopping: {
    amountLabel: "Amount (items)",
    unit: "items",
    emoji: "🛍️",
    subCategories: [
      { value: "Clothing", label: "Clothing & Footwear", emoji: "👕" },
      { value: "Electronics", label: "Electronics", emoji: "📱" },
      { value: "Furniture", label: "Furniture", emoji: "🪑" },
    ],
  },
};

/** Tất cả sub-category (giá trị) theo thứ tự. */
export const SUBCATEGORIES: string[] = CATEGORIES.flatMap((c) =>
  CATEGORY_CONFIG[c].subCategories.map((s) => s.value)
);

/** Emoji cho 1 category hoặc sub-category. */
export function emojiFor(value: string): string {
  if (value in CATEGORY_CONFIG) return CATEGORY_CONFIG[value as Category].emoji;
  for (const c of CATEGORIES) {
    const sub = CATEGORY_CONFIG[c].subCategories.find((s) => s.value === value);
    if (sub) return sub.emoji;
  }
  return "🌱";
}
