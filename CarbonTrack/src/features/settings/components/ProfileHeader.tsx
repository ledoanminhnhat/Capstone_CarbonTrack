"use client";

import { useRef } from "react";
import { FaCamera } from "react-icons/fa6";
import Avatar from "@/components/ui/Avatar";
import { IMAGE_ACCEPT } from "@/constants/app";
import type { UserProfile } from "@/types";
import { useAvatarUpload } from "../hooks/useAvatarUpload";
import AvatarCropper from "./AvatarCropper";

/** Thẻ hồ sơ gradient: avatar (bấm để đổi), tên, email. */
export default function ProfileHeader({
  profile,
  onUpdated,
}: {
  profile?: UserProfile;
  onUpdated: (p: UserProfile) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const avatar = useAvatarUpload(onUpdated);
  const openPicker = () => fileRef.current?.click();

  return (
    <>
      <div className="bg-gradient-brand text-white rounded-2xl p-6 shadow-glow-brand flex flex-wrap items-center gap-5 mb-6">
        <button
          type="button"
          onClick={openPicker}
          disabled={avatar.busy}
          className="relative group rounded-full ring-4 ring-white/30 shrink-0"
          aria-label="Change avatar"
        >
          <Avatar id={profile?.id} name={profile?.name} avatarUrl={profile?.avatarUrl} size="xl" />
          <span
            className={`absolute inset-0 rounded-full bg-black/40 flex items-center justify-center transition-opacity ${
              avatar.busy ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {avatar.busy ? <span className="text-xs font-semibold">Uploading...</span> : <FaCamera size={28} />}
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={IMAGE_ACCEPT}
          hidden
          onChange={(e) => {
            avatar.pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <div className="min-w-0 flex-1">
          <h3 className="m-0 text-xl font-extrabold truncate">{profile?.name || "User"}</h3>
          <p className="m-0 text-white/80 text-sm truncate">{profile?.email}</p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={openPicker}
              disabled={avatar.busy}
              className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-semibold disabled:opacity-60"
            >
              {profile?.avatarUrl ? "Change photo" : "Upload photo"}
            </button>
            {profile?.avatarUrl && (
              <button
                type="button"
                onClick={avatar.remove}
                disabled={avatar.busy}
                className="px-3 py-1.5 rounded-lg hover:bg-white/15 text-sm font-semibold text-white/90 disabled:opacity-60"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <p className="m-0 text-white/70 text-xs basis-full md:basis-auto">JPG, PNG or WEBP · max 5MB</p>
      </div>

      {/* mount mới cho mỗi ảnh -> zoom / vị trí bắt đầu lại */}
      {avatar.cropFile && (
        <AvatarCropper
          key={`${avatar.cropFile.name}-${avatar.cropFile.lastModified}`}
          file={avatar.cropFile}
          busy={avatar.busy}
          onCancel={avatar.cancelCrop}
          onDone={avatar.saveCropped}
        />
      )}
    </>
  );
}
