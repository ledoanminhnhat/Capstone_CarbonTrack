import React from "react";

/** Nhãn + ô nhập. */
export default function FormField({
  label,
  children,
  className = "",
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-muted text-[0.85rem] font-semibold">{label}</label>
      {children}
    </div>
  );
}
