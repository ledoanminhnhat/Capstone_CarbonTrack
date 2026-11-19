"use client";
import Avatar, { AVATAR_SIZES, type AvatarSize } from "./Avatar";

export interface AvatarPerson {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

/**
 * Nhiều avatar xếp chồng; quá `max` thì hiện "+N".
 * `total` = tổng số người thật (có thể lớn hơn số `people` được gửi về).
 */
export default function AvatarGroup({
  people,
  max = 3,
  total,
  size = "xs",
  className = "",
}: {
  people: AvatarPerson[];
  max?: number;
  total?: number;
  size?: AvatarSize;
  className?: string;
}) {
  const shown = people.slice(0, max);
  const extra = Math.max(0, (total ?? people.length) - shown.length);
  if (shown.length === 0) return null;

  return (
    <div className={`flex items-center -space-x-2 ${className}`} title={people.map((p) => p.name).join(", ")}>
      {shown.map((p) => (
        <Avatar key={p.id} id={p.id} name={p.name} avatarUrl={p.avatarUrl} size={size} ring />
      ))}
      {extra > 0 && (
        <span
          className={`${AVATAR_SIZES[size].box} rounded-full ring-2 ring-surface bg-soft text-muted font-semibold flex items-center justify-center !text-[0.65rem]`}
        >
          +{extra > 99 ? "99" : extra}
        </span>
      )}
    </div>
  );
}
