"use client";
/* eslint-disable @next/next/no-img-element */

import { FaArrowRight, FaLightbulb } from "react-icons/fa6";
import Badge from "@/components/ui/Badge";
import { UNSPLASH_UTM, tipImageUrl } from "../constants/dailyTips";
import { useDailyTip } from "../hooks/useDailyTip";

/** Thẻ mẹo mỗi ngày, có ảnh Unsplash + ghi credit tác giả. */
export default function DailyTip() {
  const { tip, position, total, next } = useDailyTip();

  return (
    <div className="bg-surface rounded-2xl shadow-card overflow-hidden flex flex-col">
      <div className="relative h-36 bg-soft">
        <img
          key={tip.photo.id}
          src={tipImageUrl(tip.photo.id)}
          alt={tip.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <Badge tone="brand" variant="solid" size="sm" icon={<FaLightbulb size={12} />} className="absolute top-3 left-3">
          Daily Tip
        </Badge>
        <a
          href={`${tip.photo.pageUrl}${UNSPLASH_UTM}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-3 text-[0.65rem] text-white/80 hover:text-white no-underline"
        >
          Photo: {tip.photo.author} / Unsplash
        </a>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="m-0 mb-2 text-ink text-[1.05rem] font-bold">{tip.title}</h3>
        <p className="m-0 text-muted text-[0.9rem] leading-relaxed flex-1">{tip.text}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-muted text-xs">
            {position}/{total}
          </span>
          <button
            onClick={next}
            className="flex items-center gap-1 text-brand-600 text-[0.85rem] font-semibold hover:underline"
          >
            Another tip <FaArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
