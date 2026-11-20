"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaEnvelopeCircleCheck, FaKey } from "react-icons/fa6";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { errorMessage } from "@/utils/error";
import { forgotPassword } from "@/features/auth/services/auth.service";

/** Quên mật khẩu: nhập email → backend gửi link đặt lại (nếu email có tài khoản). */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(errorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full">
        <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
          <FaEnvelopeCircleCheck size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-ink mb-2">Check your email</h1>
        <p className="text-muted mb-2">
          If an account exists for <strong className="text-ink">{email.trim()}</strong>, we&apos;ve sent a link to
          reset your password. It expires in 30 minutes.
        </p>
        <p className="text-muted text-sm mb-8">Didn&apos;t get it? Check your spam folder, or try again in a minute.</p>
        <Button variant="outline" size="full" onClick={() => setSent(false)}>
          Use a different email
        </Button>
        <BackToLogin />
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-extrabold text-ink mb-1 flex items-center gap-3">
        Forgot password? <FaKey className="text-amber-400" size={24} />
      </h1>
      <p className="text-muted mb-8">Enter your email and we&apos;ll send you a link to reset it.</p>

      <form className="flex flex-col" onSubmit={submit}>
        <label className="text-sm font-medium text-ink mb-1">Email</label>
        <div className="mb-5">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <Alert className="mb-3">{error}</Alert>

        <Button type="submit" variant="gradient" size="full" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <BackToLogin />
    </div>
  );
}

function BackToLogin() {
  return (
    <p className="text-center mt-8 text-sm">
      <Link href="/login" className="text-brand-600 font-semibold hover:underline inline-flex items-center gap-1.5">
        <FaArrowLeft size={12} /> Back to login
      </Link>
    </p>
  );
}
