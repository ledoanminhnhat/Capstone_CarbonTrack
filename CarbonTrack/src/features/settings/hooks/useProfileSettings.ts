"use client";

import { useEffect, useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/error";
import type { UserProfile } from "@/types";
import { getProfile, updateName } from "@/services/user.service";

/** Hồ sơ + đổi tên. */
export function useProfileSettings() {
  const toast = useToast();
  const { data: profile, setData: setProfile } = useAsync<UserProfile>(getProfile, []);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setName(profile.name);
  }, [profile?.name]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveName = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    setSaving(true);
    setError("");
    try {
      setProfile(await updateName(name.trim()));
      toast.success("Name updated");
    } catch (e) {
      setError(errorMessage(e, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  return { profile, setProfile, name, setName, error, saving, saveName };
}
