import { iconFor } from "@/constants/categoryIcons";

/** Icon Font Awesome của 1 category / sub-category. */
export default function CategoryIcon({
  value,
  size = 14,
  className,
  color,
}: {
  value: string;
  size?: number;
  className?: string;
  color?: string;
}) {
  const Icon = iconFor(value);
  return <Icon size={size} className={className} color={color} aria-hidden />;
}
