"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const allowed = useRequireAuth();

  // Trong lúc kiểm tra đăng nhập thì chưa vẽ dashboard (tránh nháy nội dung)
  if (!allowed) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 flex flex-col h-screen overflow-y-auto">{children}</main>
    </div>
  );
}
