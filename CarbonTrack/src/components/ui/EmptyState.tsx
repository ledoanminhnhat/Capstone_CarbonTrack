import React from "react";

/** Khung trống: "chưa có dữ liệu". */
export default function EmptyState({
  icon,
  children,
  action,
  dashed = false,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  /** viền nét đứt (dùng trong 1 section) thay vì card trắng */
  dashed?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-8 text-center text-muted text-[0.9rem] flex flex-col items-center gap-3 ${
        dashed ? "bg-white/60 border border-dashed border-gray-200" : "bg-white shadow-card"
      }`}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-4xl">{icon}</div>
      )}
      <div>{children}</div>
      {action}
    </div>
  );
}

/** Dòng "Loading..." thống nhất. */
export function Loading({ text = "Loading..." }: { text?: string }) {
  return <p className="text-muted text-center py-10 m-0">{text}</p>;
}
