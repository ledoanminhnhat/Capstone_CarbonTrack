"use client";

import React, { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  /** "bar" = dải gradient mỏng trên cùng, "header" = header gradient có tiêu đề trắng */
  variant?: "bar" | "header";
  accent?: "brand" | "sunrise";
  maxWidth?: string;
  /** chặn đóng khi đang xử lý */
  locked?: boolean;
}

/** Hộp thoại dùng chung: nền mờ, bấm ra ngoài / Esc để đóng. */
export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  variant = "bar",
  accent = "brand",
  maxWidth = "max-w-[460px]",
  locked = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !locked && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, locked, onClose]);

  if (!open) return null;
  const gradient = accent === "sunrise" ? "bg-gradient-sunrise" : "bg-gradient-brand";
  const close = () => !locked && onClose();

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`bg-white rounded-3xl w-full ${maxWidth} overflow-hidden relative shadow-card`}
        onClick={(e) => e.stopPropagation()}
      >
        {variant === "header" ? (
          <div className={`${gradient} px-6 py-5 flex items-center justify-between`}>
            <div>
              {title && <h2 className="text-white text-xl font-bold m-0">{title}</h2>}
              {subtitle && <p className="text-white/80 text-sm m-0">{subtitle}</p>}
            </div>
            <button onClick={close} className="text-white/80 hover:text-white" aria-label="Close">
              <FaXmark size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className={`h-2 ${gradient}`} />
            <button onClick={close} className="absolute top-5 right-5 text-muted hover:text-ink z-10" aria-label="Close">
              <FaXmark size={18} />
            </button>
            {title && (
              <div className="px-6 pt-5">
                <h3 className="m-0 text-ink text-[1.1rem] font-bold pr-8">{title}</h3>
                {subtitle && <p className="m-0 mt-1 text-muted text-sm">{subtitle}</p>}
              </div>
            )}
          </>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
