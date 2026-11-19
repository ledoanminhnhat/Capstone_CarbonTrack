"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/error";
import { changePassword } from "@/services/user.service";
import { validateNewPassword } from "@/features/auth/validation";

/** hasPassword = false → đặt mật khẩu lần đầu (tài khoản Google), không cần mật khẩu hiện tại. */
export function useChangePassword(hasPassword: boolean, onPasswordSet?: () => void) {
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const invalid = validateNewPassword(next, confirm);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError("");
    setSaving(true);
    try {
      await changePassword(hasPassword ? current : "", next);
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success(hasPassword ? "Password changed" : "Password set");
      if (!hasPassword) onPasswordSet?.();
    } catch (e) {
      setError(errorMessage(e, "Change failed"));
    } finally {
      setSaving(false);
    }
  };

  return { current, setCurrent, next, setNext, confirm, setConfirm, error, saving, submit };
}
