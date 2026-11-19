"use client";

import { useCallback, useRef, useState } from "react";
import { FaEllipsis, FaEyeSlash, FaTrashCan } from "react-icons/fa6";
import { useClickOutside } from "@/hooks/useClickOutside";

/** Menu ••• của bài: xóa bài / ẩn người dùng. */
export default function PostMenu({
  canDelete,
  canHide,
  onDelete,
  onHide,
}: {
  canDelete: boolean;
  canHide: boolean;
  onDelete: () => void;
  onHide: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  if (!canDelete && !canHide) return null;

  const item = "w-full flex items-center gap-2 px-4 py-2 text-left text-[0.9rem]";
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:bg-gray-100"
        aria-label="More options"
      >
        <FaEllipsis size={18} />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-10 bg-white rounded-xl shadow-card border border-gray-100 py-1 w-44">
          {canDelete && (
            <button onClick={() => (close(), onDelete())} className={`${item} text-rose-600 hover:bg-rose-50`}>
              <FaTrashCan size={18} /> Delete post
            </button>
          )}
          {canHide && (
            <button onClick={() => (close(), onHide())} className={`${item} text-ink hover:bg-gray-50`}>
              <FaEyeSlash size={18} /> Hide user
            </button>
          )}
        </div>
      )}
    </div>
  );
}
