"use client";

import Link from "next/link";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import SocialLogin from "@/features/auth/components/SocialLogin";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { FaHand } from "react-icons/fa6";

export default function LoginPage() {
  const f = useLoginForm();

  return (
    <div className="w-full">
      <h1 className="text-3xl font-extrabold text-ink mb-1 flex items-center gap-3">
        Welcome back <FaHand className="text-amber-400" size={26} />
      </h1>
      <p className="text-muted mb-8">Sign in to continue tracking your footprint.</p>

      <form className="flex flex-col" onSubmit={f.submit}>
        <label className="text-sm font-medium text-ink mb-1">Email</label>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={f.email}
            onChange={(e) => f.setEmail(e.target.value)}
            required
          />
        </div>

        <label className="text-sm font-medium text-ink mb-1">Password</label>
        <div className="mb-3">
          <PasswordInput
            placeholder="••••••••"
            value={f.password}
            onChange={(e) => f.setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between mb-5 text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-muted select-none">
            <input
              type="checkbox"
              checked={f.remember}
              onChange={(e) => f.setRemember(e.target.checked)}
              className="w-4 h-4 accent-brand-600"
            />
            Remember me
          </label>
          <Link href="#" className="text-brand-600 font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <Alert className="mb-3">{f.error}</Alert>

        <Button type="submit" variant="gradient" size="full" disabled={f.loading}>
          {f.loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <SocialLogin label="Sign in with Google" />

      <p className="text-center mt-8 text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brand-600 font-semibold hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
