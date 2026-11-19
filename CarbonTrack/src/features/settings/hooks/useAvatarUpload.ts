"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/error";
import { validateImage } from "@/utils/image";
import type { UserProfile } from "@/types";
import { uploadImage } from "@/services/upload.service";
import { updateAvatar } from "@/services/user.service";

/** Chọn ảnh -> crop -> upload Cloudinary -> lưu avatar; xóa avatar. */
export function useAvatarUpload(onUpdated: (p: UserProfile) => void) {
  const toast = useToast();
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = (file: File | undefined) => {
    if (!file) return;
    const err = validateImage(file);
    if (err) toast.error(err);
    else setCropFile(file);
  };

  const run = async (action: () => Promise<UserProfile>, success: string) => {
    setBusy(true);
    try {
      onUpdated(await action());
      toast.success(success);
    } catch (e) {
      toast.error(errorMessage(e, "Avatar update failed"));
    } finally {
      setBusy(false);
      setCropFile(null);
    }
  };

  const saveCropped = (cropped: File) =>
    run(async () => updateAvatar(await uploadImage(cropped, "avatar")), "Avatar updated");

  const remove = () => run(() => updateAvatar(null), "Avatar removed");

  return { cropFile, cancelCrop: () => setCropFile(null), pick, saveCropped, remove, busy };
}
