import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient" | "danger";
  size?: "sm" | "md" | "lg" | "full";
  children: React.ReactNode;
}

const variants = {
  primary: "bg-brand-600 hover:bg-brand-700 text-white border-none",
  secondary: "bg-brand-500 hover:bg-brand-600 text-white border-none",
  outline: "bg-white border border-gray-200 text-ink hover:bg-gray-50",
  ghost: "bg-transparent border-none text-muted hover:bg-gray-100 hover:text-ink",
  gradient: "bg-gradient-brand text-white border-none shadow-glow-brand hover:brightness-105 active:brightness-95",
  danger: "bg-rose-600 hover:bg-rose-700 text-white border-none",
};

const sizes = {
  sm: "py-2 px-3 text-sm",
  md: "py-3 px-4 text-[1.05rem]",
  lg: "py-4 px-6 text-lg",
  full: "w-full py-3 px-4 text-[1.05rem]",
};

export default function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-colors duration-200 outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
