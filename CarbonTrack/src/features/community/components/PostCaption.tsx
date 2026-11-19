"use client";

import { useState } from "react";

const COLLAPSE_AT = 125;

/** Caption kiểu Instagram: tên đậm + nội dung, dài thì "... more". */
export default function PostCaption({ author, content }: { author: string; content: string }) {
  const [open, setOpen] = useState(false);
  if (!content) return null;
  const long = content.length > COLLAPSE_AT;

  return (
    <p className="m-0 text-ink text-[0.9rem] leading-relaxed whitespace-pre-wrap break-words">
      <span className="font-semibold mr-1.5">{author}</span>
      {long && !open ? content.slice(0, COLLAPSE_AT).trimEnd() : content}
      {long && !open && (
        <button onClick={() => setOpen(true)} className="text-muted ml-1">
          ... more
        </button>
      )}
    </p>
  );
}
