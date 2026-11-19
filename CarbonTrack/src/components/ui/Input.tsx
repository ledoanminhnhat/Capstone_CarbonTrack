import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function Input({ className = "", icon, iconPosition = "left", ...props }: InputProps) {
  const padding = icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "";
  return (
    <div className="relative flex items-center w-full">
      {icon && iconPosition === "left" && (
        <div className="absolute left-3 text-muted flex items-center justify-center">{icon}</div>
      )}
      <input
        className={`w-full py-3 px-4 border border-gray-200 rounded-xl text-[0.95rem] text-ink outline-none transition-colors bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 box-border ${padding} ${className}`}
        {...props}
      />
      {icon && iconPosition === "right" && (
        <div className="absolute right-3 text-muted flex items-center justify-center">{icon}</div>
      )}
    </div>
  );
}
