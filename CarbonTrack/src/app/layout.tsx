import { Inter } from "next/font/google";
import AppProviders from "@/providers/AppProviders";
import "./index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
