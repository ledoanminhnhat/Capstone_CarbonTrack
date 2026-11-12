"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, isLoggedIn, logout, type AuthUser } from "@/lib/auth";
import {
  MdDashboard,
  MdHistory,
  MdEmojiEvents,
  MdPeopleOutline,
  MdOutlineSettings,
  MdLightbulbOutline,
  MdAdminPanelSettings
} from "react-icons/md";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  // Chặn truy cập: chưa đăng nhập thì đá về /login
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    setUser(getUser());
    setChecked(true);
  }, [router]);

  const handleLogout = () => {
    logout();            // xóa token + thông tin user
    router.replace("/login");
  };

  // Trong lúc kiểm tra đăng nhập thì chưa vẽ dashboard (tránh nháy nội dung)
  if (!checked) return null;

  const navLinks = [
    { name: "Dashboard", href: "/home", icon: <MdDashboard size={24} /> },
    { name: "History", href: "/history", icon: <MdHistory size={24} /> },
    { name: "Challenges", href: "/challenges", icon: <MdEmojiEvents size={24} /> },
    { name: "Community", href: "/community", icon: <MdPeopleOutline size={24} /> },
    { name: "Recommendations", href: "/recommendations", icon: <MdLightbulbOutline size={24} /> },
    { name: "Settings", href: "/settings", icon: <MdOutlineSettings size={24} /> },
    // Chỉ ADMIN mới thấy mục Admin
    ...(user?.role === "ADMIN"
      ? [{ name: "Admin", href: "/admin", icon: <MdAdminPanelSettings size={24} /> }]
      : []),
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-[260px] bg-white/80 backdrop-blur-sm flex flex-col py-8 px-6 shadow-soft sticky top-0 h-screen box-border">
        <div className="flex items-center gap-3 mb-12">
          <Image
            src="/assets/logo.png"
            alt="CarbonTrack"
            width={32}
            height={32}
          />
          <h1 className="text-xl font-extrabold text-gradient-brand m-0">CarbonTrack</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl no-underline font-semibold transition-all duration-200 ${isActive
                    ? "text-white bg-gradient-brand shadow-glow-brand"
                    : "text-[#666] hover:text-brand-700 hover:bg-brand-50"
                  }`}
              >
                {link.icon} {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#eee]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-brand text-white flex items-center justify-center font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="font-semibold text-[#333]">{user?.name ?? "User"} 👋</span>
          </div>
          <button className="w-full p-3 border border-[#e0e0e0] bg-white rounded-xl font-semibold text-[#555] cursor-pointer transition-all duration-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className={`flex-1 p-10 flex flex-col h-screen ${pathname === '/community' ? 'overflow-y-hidden' : 'overflow-y-auto'}`}>
        {children}
      </main>
    </div>
  );
}
