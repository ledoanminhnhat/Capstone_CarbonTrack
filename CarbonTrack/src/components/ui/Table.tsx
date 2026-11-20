import React from "react";

/** Bảng dùng chung: header xám nhạt, dòng có viền mảnh, hover nhẹ. */
export function Table({ children, minWidth = 600 }: { children: React.ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left text-muted font-semibold text-[0.85rem] pb-4 px-3 first:pl-0 last:pr-0 border-b border-line ${className}`}>
      {children}
    </th>
  );
}

/** Dòng bảng; có onClick thì cả dòng bấm được. */
export function Tr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={`hover:bg-subtle [&:last-child>td]:border-b-0 ${onClick ? "cursor-pointer" : ""}`}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`py-4 px-3 first:pl-0 last:pr-0 border-b border-line text-[0.9rem] ${className}`}>{children}</td>;
}

/** Dòng thông báo chiếm hết cột (đang tải / trống). */
export function TableMessage({ colSpan, children }: { colSpan: number; children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-10 text-center text-muted">
        {children}
      </td>
    </tr>
  );
}
