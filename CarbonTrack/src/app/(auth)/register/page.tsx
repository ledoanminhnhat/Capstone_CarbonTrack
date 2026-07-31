import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import styles from "../form.module.css";

export default function RegisterPage() {
  return (
    <form className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Name"
          className={styles.input}
          required
        />
      </div>
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
      <div className={styles.inputGroup}>
        <input
          type="password"
          placeholder="Confirm Password"
          className={styles.input}
          required
        />
      </div>
      <button type="submit" className={styles.button}>
        Register
      </button>

      <div className={styles.socialSection}>
        <div className={styles.socialText}>Create account using...</div>
        <div className={styles.socialIcons}>
          <Link href="#" className={styles.iconLink}>
            <FaFacebook size={32} color="#1877F2" />
          </Link>
          <Link href="#" className={styles.iconLink}>
            <FcGoogle size={32} />
          </Link>
          <Link href="#" className={styles.iconLink}>
            <FaXTwitter size={32} color="#000000" />
          </Link>
        </div>
      </div>

      <div className={styles.footerText}>
        Already have an account? <Link href="/login" className={styles.link}>Log in</Link>
      </div>
    </form>
  );
}
