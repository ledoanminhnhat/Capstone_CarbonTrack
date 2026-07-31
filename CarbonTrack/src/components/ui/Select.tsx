"use client";

import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        className="w-full appearance-none bg-[#ededed] border-none py-3.5 px-4 text-[1.1rem] text-[#444] rounded-sm outline-none cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span className="text-[0.8rem] text-black">▼</span>
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-[#ddd] rounded-md shadow-lg max-h-60 overflow-y-auto m-0 p-0 list-none">
          {options.map((option) => (
            <li
              key={option.value}
              className={`py-2.5 px-4 text-[1.05rem] cursor-pointer hover:bg-[#ebf3eb] hover:text-[#178a48] transition-colors ${
                option.value === value ? 'bg-[#ebf3eb] text-[#178a48] font-medium' : 'text-[#444]'
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
