"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaChevronDown } from "react-icons/fa6";

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

/** Chiều cao tối đa của danh sách (khớp max-h-60). */
const LIST_MAX_H = 240;
const GAP = 8;

/**
 * Dropdown dùng chung. Danh sách được render qua portal ra <body> (position: fixed)
 * để không bị cắt khi nằm trong khung có overflow (vd Modal); thiếu chỗ bên dưới thì lật lên trên.
 */
export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState<React.CSSProperties | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Tính vị trí danh sách theo nút bấm
  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return;
    const r = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < LIST_MAX_H + GAP && r.top > spaceBelow;
    setPos({
      position: 'fixed',
      left: r.left,
      width: r.width,
      ...(openUp ? { bottom: window.innerHeight - r.top + GAP } : { top: r.bottom + GAP }),
    });
  }, [isOpen]);

  // Đóng khi bấm ra ngoài (cả nút lẫn danh sách), cuộn trang, đổi kích thước, Esc
  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!buttonRef.current?.contains(t) && !listRef.current?.contains(t)) close();
    };
    const onScroll = (e: Event) => {
      if (!listRef.current?.contains(e.target as Node)) close(); // cuộn trong danh sách thì giữ
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('mousedown', onDown);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-surface border rounded-xl py-2.5 px-3.5 text-sm text-ink cursor-pointer flex justify-between items-center gap-2 transition-colors ${
          isOpen ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-line-strong hover:border-line-strong'
        }`}
      >
        <span className={selectedOption ? 'text-ink truncate' : 'text-muted truncate'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown
          size={12}
          className={`text-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && pos && createPortal(
        <ul
          ref={listRef}
          style={pos}
          data-select-list
          className="z-[1100] bg-surface border border-line rounded-xl shadow-card max-h-60 overflow-y-auto m-0 p-1 list-none"
        >
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
        </ul>,
        document.body,
      )}
    </div>
  );
}
