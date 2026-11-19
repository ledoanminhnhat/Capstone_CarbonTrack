/* eslint-disable @next/next/no-img-element */
import React from "react";

const GRADIENTS = ["bg-gradient-brand", "bg-gradient-ocean", "bg-gradient-sunrise", "bg-gradient-berry", "bg-gradient-leaf"];

export const AVATAR_SIZES = {
  xs: { box: "w-7 h-7 text-xs", dot: "w-2 h-2" },
  sm: { box: "w-8 h-8 text-sm", dot: "w-2.5 h-2.5" },
  md: { box: "w-11 h-11 text-lg", dot: "w-3 h-3" },
  lg: { box: "w-16 h-16 text-2xl", dot: "w-4 h-4" },
  xl: { box: "w-24 h-24 text-4xl", dot: "w-5 h-5" },
};
export type AvatarSize = keyof typeof AVATAR_SIZES;

const STATUS_COLORS = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  info: "bg-sky-500",
  danger: "bg-rose-500",
  brand: "bg-brand-500",
};
export type AvatarStatus = keyof typeof STATUS_COLORS;

interface AvatarProps {
  id?: string;
  name?: string;
  avatarUrl?: string | null;
  size?: AvatarSize;
  /** chấm trạng thái góc dưới phải (vd admin, đang hoạt động) */
  status?: AvatarStatus;
  /** chú thích khi rê chuột vào chấm trạng thái */
  statusLabel?: string;
  /** viền trắng (dùng khi xếp chồng trong AvatarGroup) */
  ring?: boolean;
  className?: string;
}

/** Ảnh đại diện; chưa có ảnh thì hiện chữ cái đầu trên nền gradient (màu cố định theo id). */
export default function Avatar({
  id = "",
  name = "",
  avatarUrl,
  size = "md",
  status,
  statusLabel,
  ring = false,
  className = "",
}: AvatarProps) {
  const s = AVATAR_SIZES[size];
  const base = `${s.box} rounded-full shrink-0 ${ring ? "ring-2 ring-white" : ""}`;
  const idx = [...(id || name)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % GRADIENTS.length;

  const face = avatarUrl ? (
    <img src={avatarUrl} alt={name} className={`${base} object-cover bg-gray-100`} />
  ) : (
    <div className={`${base} ${GRADIENTS[idx]} flex items-center justify-center text-white font-bold`}>
      {name ? name.charAt(0).toUpperCase() : "?"}
    </div>
  );

  if (!status) return <span className={`inline-flex ${className}`}>{face}</span>;
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      {face}
      <span
        title={statusLabel}
        aria-label={statusLabel}
        className={`absolute bottom-0 right-0 ${s.dot} rounded-full ring-2 ring-white ${STATUS_COLORS[status]}`}
      />
    </span>
  );
}
