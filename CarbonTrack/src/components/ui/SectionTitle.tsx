import React from "react";
import Badge from "./Badge";

/** Tiêu đề 1 khối nội dung, có thể kèm số đếm. */
export default function SectionTitle({
  children,
  count,
  subtitle,
  className = "mb-4",
}: {
  children: React.ReactNode;
  count?: number;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="m-0 text-ink text-[1.1rem] font-bold flex items-center gap-2">
        {children}
        {count !== undefined && <Badge tone="neutral" size="sm">{count}</Badge>}
      </h3>
      {subtitle && <p className="m-0 mt-1 text-muted text-[0.85rem]">{subtitle}</p>}
    </div>
  );
}
