"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  MdDashboard, 
  MdOutlineEditNote, 
  MdHistory, 
  MdEmojiEvents, 
  MdPeopleOutline, 
  MdOutlineSettings, 
  MdLightbulbOutline 
} from "react-icons/md";
import styles from "./dashboard.module.css";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logoSection}>
          <Image
            src="/assets/logo.png"
            alt="CarbonTrack"
            width={32}
            height={32}
          />
          <h1 className={styles.title}>CarbonTrack</h1>
        </div>

        <nav className={styles.nav}>
          <Link href="/home" className={`${styles.navItem} ${styles.navItemActive}`}>
            <MdDashboard size={24} /> Dashboard
          </Link>
          <Link href="#" className={styles.navItem}>
            <MdOutlineEditNote size={24} /> Log Activity
          </Link>
          <Link href="#" className={styles.navItem}>
            <MdHistory size={24} /> History
          </Link>
          <Link href="#" className={styles.navItem}>
            <MdEmojiEvents size={24} /> Challenges
          </Link>
          <Link href="#" className={styles.navItem}>
            <MdPeopleOutline size={24} /> Community
          </Link>
          <Link href="#" className={styles.navItem}>
            <MdOutlineSettings size={24} /> Settings
          </Link>
          <Link href="#" className={styles.navItem}>
            <MdLightbulbOutline size={24} /> Recommendations
          </Link>
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <span style={{fontSize: "20px"}}>👨🏻</span>
            </div>
            <span className={styles.userName}>Nhat 👋</span>
          </div>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
