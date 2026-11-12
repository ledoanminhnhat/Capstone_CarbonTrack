/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Màu thương hiệu (xanh eco), dùng bằng text-brand-500, bg-brand-600...
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        // Màu nền + chữ ngữ nghĩa
        ink: "#1f2937",
        muted: "#6b7280",
        surface: "#ffffff",
      },
      // Các gradient dùng chung: bg-gradient-brand, bg-gradient-sunrise...
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
        "gradient-leaf": "linear-gradient(135deg, #34d399 0%, #059669 100%)",
        "gradient-sunrise": "linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%)",
        "gradient-ocean": "linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)",
        "gradient-berry": "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
        "gradient-app": "linear-gradient(160deg, #f0fdf4 0%, #ecfeff 100%)",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(0,0,0,0.04)",
        card: "0 8px 30px rgba(0,0,0,0.06)",
        "glow-brand": "0 12px 25px -8px rgba(16,185,129,0.45)",
        "glow-ocean": "0 12px 25px -8px rgba(14,165,233,0.45)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
}
