import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Thêm hiệu ứng nổi khi hover */
  hover?: boolean;
  /** Dải màu gradient mỏng ở viền trên */
  accent?: "brand" | "ocean" | "sunrise" | "berry" | "none";
}

const accentMap: Record<string, string> = {
  brand: "before:bg-gradient-brand",
  ocean: "before:bg-gradient-ocean",
  sunrise: "before:bg-gradient-sunrise",
  berry: "before:bg-gradient-berry",
  none: "",
};

export default function Card({
  children,
  hover = false,
  accent = "none",
  className = "",
  ...props
}: CardProps) {
  const accentCls =
    accent !== "none"
      ? `relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 ${accentMap[accent]}`
      : "";

  return (
    <div
      className={`bg-white rounded-2xl shadow-card p-6 ${accentCls} ${
        hover ? "transition-all duration-200 hover:shadow-glow-brand hover:-translate-y-0.5" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
