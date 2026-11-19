import Avatar from "@/components/ui/Avatar";
import type { Author } from "../types";

export default function AuthorAvatar({ author, size = "md" }: { author: Author; size?: "sm" | "md" }) {
  return <Avatar id={author.id} name={author.name} avatarUrl={author.avatarUrl} size={size} />;
}
