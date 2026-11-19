import { Inter } from "next/font/google";
import AppProviders from "@/providers/AppProviders";
import { THEME_INIT_SCRIPT } from "@/providers/ThemeProvider";
import "./index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: class "dark" được gắn trước khi React chạy
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        {/* gắn theme trước khi vẽ trang -> không nháy trắng khi đang ở dark mode */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
