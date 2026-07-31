import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 outline-none cursor-pointer';
  
  const variants = {
    primary: 'bg-[#2b9d5c] hover:bg-[#227c49] text-white border-none',
    secondary: 'bg-[#40a05b] hover:bg-[#328049] text-white border-none', // for auth buttons
    outline: 'bg-transparent border border-[#e0e0e0] text-[#555] hover:bg-[#f9f9f9]',
    ghost: 'bg-transparent border-none text-[#555] hover:bg-black hover:text-white',
  };

  const sizes = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-[1.05rem]',
    lg: 'py-4 px-6 text-lg',
    full: 'w-full py-3 px-4 text-[1.05rem]', // specific for full-width forms
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
