"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/error";
import { changePassword } from "@/services/user.service";
import { validateNewPassword } from "@/features/auth/validation";

export function useChangePassword() {
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
      await changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      toast.success("Password changed");
    } catch (e) {
      setError(errorMessage(e, "Change failed"));
    } finally {
      setSaving(false);
    }
  };

  return { current, setCurrent, next, setNext, confirm, setConfirm, error, saving, submit };
}
