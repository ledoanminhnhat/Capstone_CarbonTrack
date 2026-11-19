import React from "react";

const TONES = {
  error: "bg-rose-50 text-rose-600",
  success: "bg-emerald-50 text-emerald-700",
  info: "bg-sky-50 text-sky-700",
};

/** Thông báo ngay trong form (lỗi validate…). Thông báo nhanh thì dùng toast. */
export default function Alert({
  tone = "error",
  children,
  className = "",
}: {
  tone?: keyof typeof TONES;
  children: React.ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return <p className={`m-0 text-sm rounded-lg px-3 py-2 ${TONES[tone]} ${className}`}>{children}</p>;
}
