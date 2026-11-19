"use client";
/* eslint-disable @next/next/no-img-element */

import { MdZoomIn, MdZoomOut } from "react-icons/md";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import { MAX_ZOOM, MIN_ZOOM, useImageCrop } from "../hooks/useImageCrop";

const VIEW = 280; // khung crop (px)
const OUTPUT = 512; // ảnh xuất ra (px)

/** Hộp thoại crop avatar: kéo để di chuyển, lăn chuột / thanh trượt để zoom. */
export default function AvatarCropper({
  file,
  busy = false,
  onCancel,
  onDone,
}: {
  file: File | null;
  busy?: boolean;
  onCancel: () => void;
  onDone: (cropped: File) => void;
}) {
  const src = useObjectUrl(file);
  const crop = useImageCrop(VIEW, OUTPUT);

  const save = async () => {
    const out = await crop.exportFile();
    if (out) onDone(out);
  };

  return (
    <Modal open={!!file} onClose={onCancel} title="Crop your photo" maxWidth="max-w-[380px]" locked={busy}>
      <div
        className="relative mx-auto overflow-hidden rounded-2xl bg-gray-900 touch-none select-none cursor-grab active:cursor-grabbing"
        style={{ width: VIEW, height: VIEW }}
        {...crop.handlers}
      >
        {src && (
          <img
            ref={crop.imgRef}
            src={src}
            alt=""
            draggable={false}
            onLoad={crop.onImageLoad}
            className="absolute max-w-none pointer-events-none"
            style={crop.imageStyle}
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
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.01}
          value={crop.zoom}
          onChange={(e) => crop.setZoom(Number(e.target.value))}
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
        <Button variant="gradient" size="full" onClick={save} disabled={busy || !crop.ready}>
          {busy ? "Saving..." : "Save"}
        </Button>
      </div>
    </Modal>
  );
}
