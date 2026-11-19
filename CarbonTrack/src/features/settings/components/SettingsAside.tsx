import React from "react";

/** Bố cục 1 mục Settings: nội dung chính bên trái + thẻ thông tin bên phải (xuống dưới khi màn hẹp). */
export function SettingsLayout({ main, aside }: { main: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className={`grid grid-cols-1 gap-6 items-start ${aside ? "xl:grid-cols-[minmax(0,1fr)_320px]" : ""}`}>
      <div className="min-w-0 flex flex-col gap-6">{main}</div>
      {aside && <div className="flex flex-col gap-6">{aside}</div>}
    </div>
  );
}

/** Thẻ thông tin phụ bên phải. */
export default function SettingsAside({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <aside className="bg-surface rounded-2xl shadow-card p-5">
      <h4 className="m-0 mb-4 text-ink text-[0.95rem] font-bold flex items-center gap-2">
        {icon && <span className="text-muted">{icon}</span>}
        {title}
      </h4>
      {children}
    </aside>
  );
}

/** 1 dòng "nhãn — giá trị" trong thẻ thông tin. */
export function AsideRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-line last:border-b-0 text-[0.88rem]">
      <span className="text-muted">{label}</span>
      <span className="text-ink font-semibold text-right">{children}</span>
    </div>
  );
}
