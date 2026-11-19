"use client";

import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { FaCircleCheck, FaCircleExclamation, FaCircleInfo, FaXmark } from "react-icons/fa6";
type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const STYLE: Record<ToastType, { icon: React.ReactNode; cls: string }> = {
  success: { icon: <FaCircleCheck size={16} />, cls: "text-emerald-600" },
  error: { icon: <FaCircleExclamation size={16} />, cls: "text-rose-600" },
  info: { icon: <FaCircleInfo size={16} />, cls: "text-sky-600" },
};

const DURATION = 3000;

/** Bọc ngoài app để dùng useToast() ở mọi nơi. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (type: ToastType, message: string) => {
      const id = ++nextId.current;
      setToasts((t) => [...t.slice(-3), { id, type, message }]); // tối đa 4 cái
      setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss]
  );

  const api = useRef<ToastApi>({
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m),
  }).current;

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-24 md:bottom-6 inset-x-4 md:inset-x-auto md:right-6 z-[2000] flex flex-col items-center md:items-end gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto bg-surface rounded-xl shadow-card border border-line pl-4 pr-3 py-3 flex items-center gap-3 min-w-[260px] max-w-[380px] animate-[toast-in_0.2s_ease-out]"
          >
            <span className={STYLE[t.type].cls}>{STYLE[t.type].icon}</span>
            <span className="flex-1 text-ink text-[0.9rem]">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-muted hover:text-ink" aria-label="Dismiss">
              <FaXmark size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
