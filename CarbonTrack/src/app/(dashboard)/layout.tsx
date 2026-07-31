"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  MdDashboard, 
  MdOutlineEditNote, 
  MdHistory, 
  MdEmojiEvents, 
  MdPeopleOutline, 
  MdOutlineSettings, 
  MdLightbulbOutline 
} from "react-icons/md";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    router.push("/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/home", icon: <MdDashboard size={24} /> },
    { name: "History", href: "/history", icon: <MdHistory size={24} /> },
    { name: "Challenges", href: "#", icon: <MdEmojiEvents size={24} /> },
    { name: "Community", href: "#", icon: <MdPeopleOutline size={24} /> },
    { name: "Settings", href: "#", icon: <MdOutlineSettings size={24} /> },
    { name: "Recommendations", href: "#", icon: <MdLightbulbOutline size={24} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#dcebdc]">
      <aside className="w-[260px] bg-white flex flex-col py-8 px-6 shadow-[2px_0_10px_rgba(0,0,0,0.02)] sticky top-0 h-screen box-border">
        <div className="flex items-center gap-3 mb-12">
          <Image
            src="/assets/logo.png"
            alt="CarbonTrack"
            width={32}
            height={32}
          />
          <h1 className="text-xl font-bold text-[#333] m-0">CarbonTrack</h1>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center gap-4 px-4 py-3 rounded-lg no-underline font-semibold transition-all duration-200 ${
                  isActive 
                    ? "text-[#333] bg-[#f5f9f5]" 
                    : "text-[#666] hover:text-[#333] hover:bg-[#f5f9f5]"
                }`}
              >
                {link.icon} {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#eee]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#aed9b8] flex items-center justify-center overflow-hidden">
              <span style={{fontSize: "20px"}}>👨🏻</span>
            </div>
            <span className="font-semibold text-[#333]">Nhat 👋</span>
          </div>
          <button className="w-full p-3 border border-[#e0e0e0] bg-white rounded-lg font-semibold text-[#555] cursor-pointer transition-all duration-200 hover:bg-[#f9f9f9]" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
