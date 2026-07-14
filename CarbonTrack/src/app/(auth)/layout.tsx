import Image from "next/image";
import styles from "./auth.module.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <Image
          src="/assets/background.png"
          alt="Forest background"
          fill
          priority
          sizes="35vw"
          unoptimized={true}
          className={styles.image}
        />
      </div>
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.logoSection}>
            <Image
              src="/assets/logo.png"
              alt="CarbonTrack Logo"
              width={64}
              height={64}
              className={styles.logo}
            />
            <h1 className={styles.title}>CarbonTrack</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
