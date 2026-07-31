import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function Input({
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}: InputProps) {
  const baseStyles = 'w-full py-3 px-4 border border-[#ccc] rounded-lg text-[0.95rem] outline-none transition-colors bg-white focus:border-[#3b9952] box-border';
  
  let paddingClass = '';
  if (icon) {
    if (iconPosition === 'left') {
      paddingClass = 'pl-10';
    } else {
      paddingClass = 'pr-10';
    }
  }

  return (
    <div className="relative flex items-center w-full">
      {icon && iconPosition === 'left' && (
        <div className="absolute left-3 text-[#999] flex items-center justify-center">
          {icon}
        </div>
      )}
      <input
        className={`${baseStyles} ${paddingClass} ${className}`}
        {...props}
      />
      {icon && iconPosition === 'right' && (
        <div className="absolute right-3 text-[#999] flex items-center justify-center">
          {icon}
        </div>
      )}
    </div>
  );
}
