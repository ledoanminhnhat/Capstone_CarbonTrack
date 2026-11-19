import Avatar, { type AvatarSize } from "./Avatar";
import { isOnline, lastActiveLabel } from "@/utils/presence";

/** Avatar kèm chấm xanh khi user đang online (rê chuột: "Online now" / "Active 5m ago"). */
export default function PresenceAvatar({
  id,
  name,
  avatarUrl,
  lastActiveAt,
  size = "sm",
  className,
}: {
  id: string;
  name: string;
  avatarUrl?: string | null;
  lastActiveAt?: string | null;
  size?: AvatarSize;
  className?: string;
}) {
  return (
    <Avatar
      id={id}
      name={name}
      avatarUrl={avatarUrl}
      size={size}
      status={isOnline(lastActiveAt) ? "success" : undefined}
      statusLabel={lastActiveLabel(lastActiveAt)}
      className={className}
    />
  );
}
