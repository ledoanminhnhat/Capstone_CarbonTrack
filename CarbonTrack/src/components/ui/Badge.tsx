import React from "react";

type Tone = "success" | "danger" | "warning" | "info" | "neutral";

const tones: Record<Tone, string> = {
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-rose-100 text-rose-600",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-sky-100 text-sky-700",
  neutral: "bg-gray-100 text-gray-600",
};

interface BadgeProps {
  tone?: Tone;
  children: React.ReactNode;
  /** hiện chấm tròn nhỏ phía trước */
  dot?: boolean;
  className?: string;
}

export default function Badge({ tone = "neutral", children, dot = false, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[0.8rem] font-semibold ${tones[tone]} ${className}`}
    >
      {dot && <span className="w-2 h-2 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
}
