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

/**
 * Màu category cho chữ / icon / badge — biến CSS (src/app/index.css) nên tự đổi theo theme:
 * light đậm hơn màu biểu đồ (vàng gốc khó đọc), dark sáng hơn để nổi trên nền tối.
 */
export const CATEGORY_TEXT_COLORS: Record<Category, string> = {
  Transport: "var(--ct-cat-transport)",
  Food: "var(--ct-cat-food)",
  Energy: "var(--ct-cat-energy)",
  Shopping: "var(--ct-cat-shopping)",
};

export const categoryTextColor = (c: string) => CATEGORY_TEXT_COLORS[c as Category] ?? "rgb(var(--ct-muted))";

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
}

/** Sub-category theo từng category + nhãn ô nhập + đơn vị. */
export const CATEGORY_CONFIG: Record<
  Category,
  { amountLabel: string; unit: string; subCategories: SubCategory[] }
> = {
  Transport: {
    amountLabel: "Distance (km)",
    unit: "km",
    subCategories: [
      { value: "Motorbike", label: "Motorbike" },
      { value: "Car", label: "Car" },
      { value: "Bus", label: "Bus" },
      { value: "Plane", label: "Plane" },
    ],
  },
  Food: {
    amountLabel: "Amount (kg)",
    unit: "kg",
    subCategories: [
      { value: "Red Meat", label: "Red Meat" },
      { value: "White Meat", label: "White Meat / Seafood" },
      { value: "Vegetarian", label: "Vegetarian / Vegan" },
    ],
  },
  Energy: {
    amountLabel: "Amount (kWh / m³)",
    unit: "kWh / m³",
    subCategories: [
      { value: "Electricity", label: "Electricity" },
      { value: "Gas", label: "Natural Gas" },
      { value: "Water", label: "Water" },
    ],
  },
  Shopping: {
    amountLabel: "Amount (items)",
    unit: "items",
    subCategories: [
      { value: "Clothing", label: "Clothing & Footwear" },
      { value: "Electronics", label: "Electronics" },
      { value: "Furniture", label: "Furniture" },
    ],
  },
};

/** Tất cả sub-category (giá trị) theo thứ tự. */
export const SUBCATEGORIES: string[] = CATEGORIES.flatMap((c) =>
  CATEGORY_CONFIG[c].subCategories.map((s) => s.value)
);

/** Category chứa 1 sub-category (hoặc chính nó nếu đã là category). */
export function categoryOf(value: string): Category | undefined {
  if (value in CATEGORY_CONFIG) return value as Category;
  return CATEGORIES.find((c) => CATEGORY_CONFIG[c].subCategories.some((s) => s.value === value));
}

