"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { MdClose } from "react-icons/md";

/** Lưới 1–3 ảnh; bấm vào để xem lớn. */
export default function PostImages({ urls }: { urls: string[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (urls.length === 0) return null;

  const grid = urls.length === 1 ? "grid-cols-1" : urls.length === 2 ? "grid-cols-2" : "grid-cols-2 grid-rows-2";

  return (
    <>
      <div className={`grid ${grid} gap-2 mt-3 rounded-xl overflow-hidden ${urls.length > 1 ? "h-[320px]" : ""}`}>
        {urls.map((url, i) => (
          <button
            key={url}
            onClick={() => setOpen(url)}
            className={`block bg-gray-100 overflow-hidden ${urls.length === 3 && i === 0 ? "row-span-2" : ""}`}
          >
            <img
              src={url}
              alt=""
              className={`w-full ${urls.length === 1 ? "max-h-[480px] object-contain bg-gray-50" : "h-full object-cover"}`}
            />
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-6" onClick={() => setOpen(null)}>
          <img src={open} alt="" className="max-w-full max-h-full rounded-xl" />
          <button className="absolute top-5 right-5 text-white" onClick={() => setOpen(null)} aria-label="Close">
            <MdClose size={30} />
          </button>
        </div>
      )}
    </>
  );
}
