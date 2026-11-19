"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from "react";
import { MdClose, MdZoomIn, MdZoomOut } from "react-icons/md";
import Button from "./Button";

const VIEW = 280;   // kích thước khung crop (px)
const OUTPUT = 512; // kích thước ảnh xuất ra (px)

interface AvatarCropperProps {
  file: File;
  onCancel: () => void;
  onDone: (cropped: File) => void;
  busy?: boolean;
}

/**
 * Crop ảnh vuông cho avatar: kéo để di chuyển, thanh trượt / lăn chuột để zoom.
 * Khung tròn chỉ là hiển thị; ảnh xuất ra là hình vuông OUTPUT×OUTPUT.
 */
export default function AvatarCropper({ file, onCancel, onDone, busy = false }: AvatarCropperProps) {
  const [src, setSrc] = useState("");
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // vị trí tâm ảnh so với tâm khung
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // zoom = 1: cạnh ngắn của ảnh vừa khít khung
  const baseScale = natural.w && natural.h ? VIEW / Math.min(natural.w, natural.h) : 1;
  const scale = baseScale * zoom;
  const dispW = natural.w * scale;
  const dispH = natural.h * scale;

  // Không cho kéo ảnh lộ khoảng trống trong khung
  const clamp = (x: number, y: number) => {
    const maxX = Math.max(0, (dispW - VIEW) / 2);
    const maxY = Math.max(0, (dispH - VIEW) / 2);
    return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
  };

  useEffect(() => {
    setOffset((o) => clamp(o.x, o.y));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, natural.w, natural.h]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const d = drag.current;
    setOffset(clamp(d.ox + e.clientX - d.x, d.oy + e.clientY - d.y));
  };
  const onPointerUp = () => {
    drag.current = null;
  };
  const onWheel = (e: React.WheelEvent) => {
    setZoom((z) => Math.min(3, Math.max(1, z - e.deltaY * 0.001)));
  };

  const save = () => {
    const img = imgRef.current;
    if (!img || !natural.w) return;
    // Vùng khung (VIEW×VIEW) quy đổi về toạ độ ảnh gốc
    const size = VIEW / scale;
    const sx = natural.w / 2 - (VIEW / 2 + offset.x) / scale;
    const sy = natural.h / 2 - (VIEW / 2 + offset.y) / scale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, sx, sy, size, size, 0, 0, OUTPUT, OUTPUT);
    canvas.toBlob(
      (blob) => {
        if (blob) onDone(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-card w-full max-w-[380px] overflow-hidden">
        <div className="h-2 bg-gradient-brand" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="m-0 text-ink text-[1.1rem] font-bold">Crop your photo</h3>
            <button onClick={onCancel} disabled={busy} className="text-muted hover:text-ink" aria-label="Close">
              <MdClose size={24} />
            </button>
          </div>

          <div
            className="relative mx-auto overflow-hidden rounded-2xl bg-gray-900 touch-none select-none cursor-grab active:cursor-grabbing"
            style={{ width: VIEW, height: VIEW }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
          >
            {src && (
              <img
                ref={imgRef}
                src={src}
                alt=""
                draggable={false}
                onLoad={(e) =>
                  setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
                }
                className="absolute max-w-none pointer-events-none"
                style={{
                  width: dispW || undefined,
                  height: dispH || undefined,
                  left: VIEW / 2 - dispW / 2 + offset.x,
                  top: VIEW / 2 - dispH / 2 + offset.y,
                  visibility: natural.w ? "visible" : "hidden",
                }}
              />
            )}
            {/* Lớp phủ tối quanh vòng tròn */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full"
              style={{ boxShadow: "0 0 0 999px rgba(0,0,0,0.5)", border: "2px solid rgba(255,255,255,0.8)" }}
            />
          </div>

          <div className="flex items-center gap-3 mt-5">
            <MdZoomOut size={20} className="text-muted" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-brand-500"
              aria-label="Zoom"
            />
            <MdZoomIn size={20} className="text-muted" />
          </div>
          <p className="text-muted text-xs text-center mt-2 mb-5">Drag to reposition · scroll or slide to zoom</p>

          <div className="flex gap-3">
            <Button variant="outline" size="full" onClick={onCancel} disabled={busy}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              size="full"
              onClick={save}
              disabled={busy || !natural.w}
              className="disabled:opacity-60"
            >
              {busy ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
