import PresenceAvatar from "@/components/ui/PresenceAvatar";
import type { Author } from "../types";

/** Avatar tác giả (có chấm online). */
export default function AuthorAvatar({ author, size = "md" }: { author: Author; size?: "xs" | "sm" | "md" }) {
  return <PresenceAvatar {...author} size={size} />;
}
