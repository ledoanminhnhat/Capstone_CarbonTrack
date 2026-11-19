/* eslint-disable @next/next/no-img-element */
import React from "react";

const GRADIENTS = [
  "bg-gradient-brand",
  "bg-gradient-ocean",
  "bg-gradient-sunrise",
  "bg-gradient-berry",
  "bg-gradient-leaf",
];

const SIZES = {
  xs: "w-7 h-7 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-11 h-11 text-lg",
  lg: "w-16 h-16 text-2xl",
  xl: "w-24 h-24 text-4xl",
};

interface AvatarProps {
  id?: string;
  name?: string;
  avatarUrl?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Ảnh đại diện; chưa có ảnh thì hiện chữ cái đầu trên nền gradient (màu cố định theo id). */
export default function Avatar({ id = "", name = "", avatarUrl, size = "md", className = "" }: AvatarProps) {
  const base = `${SIZES[size]} rounded-full shrink-0 ${className}`;
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className={`${base} object-cover bg-gray-100`} />;
  }
  const idx = [...(id || name)].reduce((s, ch) => s + ch.charCodeAt(0), 0) % GRADIENTS.length;
  return (
    <div className={`${base} ${GRADIENTS[idx]} flex items-center justify-center text-white font-bold`}>
      {name ? name.charAt(0).toUpperCase() : "?"}
    </div>
  );
}
