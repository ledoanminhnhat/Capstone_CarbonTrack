"use client";

import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";
import MobileTopBar from "@/components/layout/MobileTopBar";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const allowed = useRequireAuth();

  // Trong lúc kiểm tra đăng nhập thì chưa vẽ dashboard (tránh nháy nội dung)
  if (!allowed) return null;

  return (
    <div className="flex min-h-screen">
      {/* Desktop / tablet: sidebar bên trái */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        {/* Mobile: thanh trên + thanh dưới đáy */}
        <MobileTopBar />
        <div className="flex-1 p-4 pb-28 md:p-10 md:pb-10">{children}</div>
      </main>

      <BottomNav />
    </div>
  );
}
