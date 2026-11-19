"use client";

import { useRef, useState } from "react";

/**
 * Double-click / double-tap để like (kiểu Instagram): chỉ like, không bỏ like.
 * Trả về `heartKey` đổi mỗi lần -> dùng làm key để chạy lại hiệu ứng tim.
 */
export function useDoubleTapLike(liked: boolean, onLike: () => void) {
  const [heartKey, setHeartKey] = useState(0);
  const lastTap = useRef(0);

  const trigger = () => {
    setHeartKey((k) => k + 1);
    if (!liked) onLike();
  };

  return {
    heartKey,
    handlers: {
      onDoubleClick: trigger,
      // điện thoại: 2 lần chạm trong 300ms
      onTouchEnd: () => {
        const now = Date.now();
        if (now - lastTap.current < 300) trigger();
        lastTap.current = now;
      },
    },
  };
}
