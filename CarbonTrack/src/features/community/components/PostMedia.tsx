"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useDoubleTapLike } from "../hooks/useDoubleTapLike";

/** Tim trắng bật lên giữa ảnh khi double-click. */
function HeartBurst({ k }: { k: number }) {
  if (k === 0) return null;
  return (
    <span
      key={k}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ animation: "heart-pop 0.9s ease-out forwards" }}
    >
      <FaHeart size={90} className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)]" />
    </span>
  );
}

/** Ảnh dạng carousel vuông: mũi tên, chấm vị trí, double-click để like. */
export function ImageCarousel({ urls, liked, onLike }: { urls: string[]; liked: boolean; onLike: () => void }) {
  const [i, setI] = useState(0);
  const { heartKey, handlers } = useDoubleTapLike(liked, onLike);
  const many = urls.length > 1;

  return (
    <div className="relative aspect-square bg-gray-100 overflow-hidden select-none" {...handlers}>
      <div className="flex h-full transition-transform duration-300" style={{ transform: `translateX(-${i * 100}%)` }}>
        {urls.map((url) => (
          <img key={url} src={url} alt="" draggable={false} className="w-full h-full object-cover shrink-0" />
        ))}
      </div>

      {many && (
        <>
          <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            {i + 1}/{urls.length}
          </span>
          {i > 0 && (
            <button
              onClick={() => setI(i - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 text-ink flex items-center justify-center shadow hover:bg-white"
              aria-label="Previous image"
            >
              <FaChevronLeft size={12} />
            </button>
          )}
          {i < urls.length - 1 && (
            <button
              onClick={() => setI(i + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 text-ink flex items-center justify-center shadow hover:bg-white"
              aria-label="Next image"
            >
              <FaChevronRight size={12} />
            </button>
          )}
        </>
      )}

      <HeartBurst k={heartKey} />

      {many && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {urls.map((url, idx) => (
            <button
              key={url}
              onClick={() => setI(idx)}
              aria-label={`Image ${idx + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === i ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const TEXT_CLAMP = 280;

/** Bài chỉ có chữ: thẻ gradient vuông, chữ to ở giữa; dài quá thì "Read more" để mở hết. */
export function TextPostCard({ content, liked, onLike }: { content: string; liked: boolean; onLike: () => void }) {
  const [open, setOpen] = useState(false);
  const { heartKey, handlers } = useDoubleTapLike(liked, onLike);
  const long = content.length > TEXT_CLAMP;
  const size = content.length < 80 ? "text-2xl" : content.length < 180 ? "text-xl" : "text-lg";

  return (
    <div
      className={`relative bg-gradient-brand text-white flex flex-col items-center justify-center px-8 py-10 select-none ${
        open ? "min-h-[320px]" : "aspect-square"
      }`}
      {...handlers}
    >
      <p
        className={`m-0 ${size} font-bold leading-snug text-center whitespace-pre-wrap break-words ${
          open ? "" : "line-clamp-[9]"
        }`}
      >
        {content}
      </p>
      {long && (
        <button onClick={() => setOpen((v) => !v)} className="mt-4 text-white/90 text-sm font-semibold underline">
          {open ? "Show less" : "Read more"}
        </button>
      )}
      <HeartBurst k={heartKey} />
    </div>
  );
}
