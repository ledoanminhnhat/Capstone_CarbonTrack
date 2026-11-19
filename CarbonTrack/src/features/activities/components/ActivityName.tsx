import { categoryTextColor } from "@/constants/categories";
import type { Activity } from "../types";
import CategoryIcon from "./CategoryIcon";

/** Icon Font Awesome (màu theo category) + tên activity, dùng trong các bảng. */
export default function ActivityName({ activity, extra }: { activity: Activity; extra?: React.ReactNode }) {
  const color = categoryTextColor(activity.category);
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)` }}
      >
        <CategoryIcon value={activity.activity} size={15} color={color} />
      </span>
      {activity.activity}
      {extra}
    </span>
  );
}
