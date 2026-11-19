import { categoryOf, categoryTextColor } from "@/constants/categories";
import CategoryIcon from "./CategoryIcon";

const SIZES = {
  sm: { box: "w-9 h-9 rounded-xl", icon: 15 },
  md: { box: "w-12 h-12 rounded-xl", icon: 20 },
  lg: { box: "w-16 h-16 rounded-2xl", icon: 26 },
};

/**
 * Ô vuông nền nhạt + icon Font Awesome của 1 category / sub-category, tô màu theo category.
 * Dùng cho thẻ challenge, gợi ý, bảng admin…
 */
export default function ActivityIconBox({
  value,
  size = "md",
  className = "",
}: {
  value: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const color = categoryTextColor(categoryOf(value) ?? value);
  const s = SIZES[size];
  return (
    <span
      className={`${s.box} flex items-center justify-center shrink-0 ${className}`}
      style={{ backgroundColor: `${color}14` }}
    >
      <CategoryIcon value={value} size={s.icon} color={color} />
    </span>
  );
}
