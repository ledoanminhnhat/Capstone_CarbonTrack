"use client";

import { useEffect, useRef, useState } from "react";

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;

/**
 * Logic crop vuông: kéo để di chuyển, zoom, xuất ra File JPEG.
 * `view` = cạnh khung crop (px), `output` = cạnh ảnh xuất ra (px).
 */
export function useImageCrop(view: number, output: number) {
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [zoom, setZoomState] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // tâm ảnh so với tâm khung
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // zoom = 1: cạnh ngắn của ảnh vừa khít khung
  const baseScale = natural.w && natural.h ? view / Math.min(natural.w, natural.h) : 1;
  const scale = baseScale * zoom;
  const dispW = natural.w * scale;
  const dispH = natural.h * scale;

  // Không cho kéo ảnh lộ khoảng trống trong khung
  const clamp = (x: number, y: number) => {
    const maxX = Math.max(0, (dispW - view) / 2);
    const maxY = Math.max(0, (dispH - view) / 2);
    return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
  };

  useEffect(() => {
    setOffset((o) => clamp(o.x, o.y));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, natural.w, natural.h]);

  const setZoom = (z: number) => setZoomState(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z)));

  const handlers = {
    onPointerDown: (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    },
    onPointerMove: (e: React.PointerEvent) => {
      const d = drag.current;
      if (d) setOffset(clamp(d.ox + e.clientX - d.x, d.oy + e.clientY - d.y));
    },
    onPointerUp: () => {
      drag.current = null;
    },
    onPointerCancel: () => {
      drag.current = null;
    },
    onWheel: (e: React.WheelEvent) => setZoom(zoom - e.deltaY * 0.001),
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) =>
    setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight });

  /** Vị trí / kích thước để vẽ ảnh trong khung. */
  const imageStyle: React.CSSProperties = {
    width: dispW || undefined,
    height: dispH || undefined,
    left: view / 2 - dispW / 2 + offset.x,
    top: view / 2 - dispH / 2 + offset.y,
    visibility: natural.w ? "visible" : "hidden",
  };

  /** Cắt vùng trong khung ra File JPEG output×output. */
  const exportFile = (): Promise<File | null> =>
    new Promise((resolve) => {
      const img = imgRef.current;
      if (!img || !natural.w) return resolve(null);
      const size = view / scale; // cạnh vùng cắt trên ảnh gốc
      const sx = natural.w / 2 - (view / 2 + offset.x) / scale;
      const sy = natural.h / 2 - (view / 2 + offset.y) / scale;

      const canvas = document.createElement("canvas");
      canvas.width = output;
      canvas.height = output;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, size, size, 0, 0, output, output);
      canvas.toBlob(
        (blob) => resolve(blob ? new File([blob], "avatar.jpg", { type: "image/jpeg" }) : null),
        "image/jpeg",
        0.9
      );
    });

  return { imgRef, zoom, setZoom, handlers, onImageLoad, imageStyle, ready: natural.w > 0, exportFile };
}
