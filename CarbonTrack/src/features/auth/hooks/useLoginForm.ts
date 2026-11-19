"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { errorMessage } from "@/utils/error";
import { login } from "../services/auth.service";

export function useLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, remember);
      router.push("/home");
    } catch (err) {
      setError(errorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, remember, setRemember, error, loading, submit };
}
