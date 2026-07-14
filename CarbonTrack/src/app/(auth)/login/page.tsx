"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../form.module.css";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, perform authentication here
    router.push("/home");
  };

  return (
    <form className={styles.form} onSubmit={handleLogin}>
      <div className={styles.inputGroup}>
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          required
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={styles.button}>
        Login
      </button>

      <div className={styles.footerText}>
        Don't have an account? <Link href="/register" className={styles.link}>Register</Link>
      </div>
    </form>
  );
}
