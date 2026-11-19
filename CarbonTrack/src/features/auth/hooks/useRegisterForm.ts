"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { errorMessage } from "@/utils/error";
import { validateNewPassword } from "../validation";
import { register } from "../services/auth.service";

export function useRegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = validateNewPassword(password, confirm);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/home");
    } catch (err) {
      setError(errorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return { name, setName, email, setEmail, password, setPassword, confirm, setConfirm, error, loading, submit };
}
