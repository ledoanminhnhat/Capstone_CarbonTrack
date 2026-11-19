import React from "react";

export type BadgeTone = "success" | "danger" | "warning" | "info" | "neutral" | "brand";

const TONES: Record<BadgeTone, { soft: string; solid: string; outline: string }> = {
  success: { soft: "bg-emerald-100 text-emerald-700", solid: "bg-emerald-500 text-white", outline: "border-emerald-300 text-emerald-700" },
  danger: { soft: "bg-rose-100 text-rose-600", solid: "bg-rose-500 text-white", outline: "border-rose-300 text-rose-600" },
  warning: { soft: "bg-amber-100 text-amber-700", solid: "bg-amber-500 text-white", outline: "border-amber-300 text-amber-700" },
  info: { soft: "bg-sky-100 text-sky-700", solid: "bg-sky-500 text-white", outline: "border-sky-300 text-sky-700" },
  neutral: { soft: "bg-gray-100 text-gray-600", solid: "bg-gray-600 text-white", outline: "border-gray-300 text-gray-600" },
  brand: { soft: "bg-brand-50 text-brand-700", solid: "bg-gradient-brand text-white", outline: "border-brand-300 text-brand-700" },
};

const SIZES = {
  sm: "py-0.5 px-2 text-[0.7rem] gap-1",
  md: "py-1 px-3 text-[0.8rem] gap-1.5",
};

interface BadgeProps {
  tone?: BadgeTone;
  /** soft = nền nhạt (mặc định), solid = nền đậm, outline = chỉ viền */
  variant?: "soft" | "solid" | "outline";
  size?: keyof typeof SIZES;
  /** chấm tròn nhỏ phía trước */
  dot?: boolean;
  /** icon phía trước (react-icons…) */
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** màu tùy chỉnh dạng hex (vd màu category) — thay cho `tone` */
  color?: string;
}

/** Style inline khi dùng màu tùy chỉnh. */
function customStyle(color: string, variant: "soft" | "solid" | "outline"): React.CSSProperties {
  if (variant === "solid") return { backgroundColor: color, color: "#fff" };
  if (variant === "outline") return { borderColor: `${color}66`, color, backgroundColor: "#fff" };
  return { backgroundColor: `${color}1f`, color }; // soft: nền ~12% độ đậm
}

export default function Badge({
  tone = "neutral",
  variant = "soft",
  size = "md",
  dot = false,
  icon,
  children,
  className = "",
  color,
}: BadgeProps) {
  const border = variant === "outline" ? "border bg-white" : "";
  const toneCls = color ? "" : TONES[tone][variant];
  return (
    <span
      style={color ? customStyle(color, variant) : undefined}
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${SIZES[size]} ${toneCls} ${border} ${className}`}
    >
      {dot && <span className={`${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"} rounded-full bg-current opacity-80`} />}
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </span>
  );
}
