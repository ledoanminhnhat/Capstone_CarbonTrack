"use client";

import React, { useCallback, useRef, useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useClickOutside } from '@/hooks/useClickOutside';

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

  const close = useCallback(() => setIsOpen(false), []);
  useClickOutside(containerRef, close, isOpen);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-xl py-2.5 px-3.5 text-sm text-ink cursor-pointer flex justify-between items-center gap-2 transition-colors ${
          isOpen ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={selectedOption ? 'text-ink truncate' : 'text-muted truncate'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <MdKeyboardArrowDown
          size={20}
          className={`text-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-card max-h-60 overflow-y-auto m-0 p-1 list-none">
          {options.map((option) => {
            const active = option.value === value;
            return (
              <li
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`py-2 px-3 text-sm rounded-lg cursor-pointer transition-colors ${
                  active
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-ink hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
