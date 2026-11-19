import Badge from "@/components/ui/Badge";
import { categoryTextColor } from "@/constants/categories";
import CategoryIcon from "./CategoryIcon";

/** Badge phân loại theo màu của category, kèm icon Font Awesome. */
export default function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge color={categoryTextColor(category)} size="sm" icon={<CategoryIcon value={category} size={11} />}>
      {category}
    </Badge>
  );
}
