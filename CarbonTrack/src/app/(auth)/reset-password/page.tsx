"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowLeft, FaCircleCheck, FaLock, FaTriangleExclamation } from "react-icons/fa6";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { useAsync } from "@/hooks/useAsync";
import { errorMessage } from "@/utils/error";
import { MIN_PASSWORD_LENGTH, validateNewPassword } from "@/features/auth/validation";
import { resetPassword, validateResetToken } from "@/features/auth/services/auth.service";

/** Đặt lại mật khẩu từ link trong email (/reset-password?token=...). */
export default function ResetPasswordPage() {
  // useSearchParams cần nằm trong Suspense (Next.js App Router)
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  // kiểm tra link trước để báo sớm nếu đã hết hạn / đã dùng
  const check = useAsync(() => (token ? validateResetToken(token) : Promise.reject(new Error("missing"))), [token]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = validateNewPassword(password, confirm);
    if (invalid) {
      setError(invalid);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(errorMessage(err, "Couldn't reset your password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (check.loading) return <p className="text-muted">Checking your link...</p>;

  if (done) {
    return (
      <div className="w-full">
        <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-5">
          <FaCircleCheck size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-ink mb-2">Password updated</h1>
        <p className="text-muted mb-8">You can now log in with your new password.</p>
        <Link href="/login">
          <Button variant="gradient" size="full">
            Go to login
          </Button>
        </Link>
      </div>
    );
  }

  if (check.error) {
    return (
      <div className="w-full">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-5">
          <FaTriangleExclamation size={22} />
        </div>
        <h1 className="text-3xl font-extrabold text-ink mb-2">Link expired</h1>
        <p className="text-muted mb-8">
          This reset link is invalid, has already been used, or has expired. Please request a new one.
        </p>
        <Link href="/forgot-password">
          <Button variant="gradient" size="full">
            Request a new link
          </Button>
        </Link>
        <BackToLogin />
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-extrabold text-ink mb-1 flex items-center gap-3">
        Set a new password <FaLock className="text-amber-400" size={22} />
      </h1>
      <p className="text-muted mb-8">At least {MIN_PASSWORD_LENGTH} characters.</p>

      <form className="flex flex-col" onSubmit={submit}>
        <label className="text-sm font-medium text-ink mb-1">New password</label>
        <div className="mb-4">
          <PasswordInput
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
        </div>

        <label className="text-sm font-medium text-ink mb-1">Confirm new password</label>
        <div className="mb-5">
          <PasswordInput
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <Alert className="mb-3">{error}</Alert>

        <Button type="submit" variant="gradient" size="full" disabled={loading}>
          {loading ? "Saving..." : "Reset password"}
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
