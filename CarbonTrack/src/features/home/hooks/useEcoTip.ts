"use client";

import { useEffect, useState } from "react";
import { ECO_TIPS } from "../constants/ecoTips";

/** Mỗi tip hiển thị trong 30 phút. */
const SLOT_MS = 30 * 60_000;

/** Số khung 30 phút đã trôi qua kể từ epoch, tính theo giờ địa phương của máy người dùng. */
function slotIndex(d = new Date()): number {
  const localMs = d.getTime() - d.getTimezoneOffset() * 60_000;
  return Math.floor(localMs / SLOT_MS);
}

/** Mẹo của khung 30 phút hiện tại (đổi mỗi :00 và :30) + xem mẹo kế tiếp. */
export function useEcoTip() {
  const [index, setIndex] = useState(0);

  // tính ở client để khớp giờ theo máy người dùng
  // + tự đổi tip đúng lúc sang khung mới khi tab vẫn đang mở
  // (kiểm tra định kỳ thay vì 1 setTimeout dài, vì trình duyệt có thể hoãn timer
  //  khi tab bị ẩn hoặc máy sleep; khi quay lại tab cũng kiểm tra ngay)
  useEffect(() => {
    let lastSlot = -1;
    const check = () => {
      const slot = slotIndex();
      if (slot !== lastSlot) {
        lastSlot = slot;
        setIndex(slot % ECO_TIPS.length);
      }
    };
    check();
    const timer = setInterval(check, 15_000);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("focus", check);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("focus", check);
    };
  }, []);

  return {
    tip: ECO_TIPS[index],
    position: index + 1,
    total: ECO_TIPS.length,
    next: () => setIndex((i) => (i + 1) % ECO_TIPS.length),
  };
}
