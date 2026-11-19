"use client";

import Link from "next/link";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import SocialLogin from "@/features/auth/components/SocialLogin";
import { useRegisterForm } from "@/features/auth/hooks/useRegisterForm";

export default function RegisterPage() {
  const f = useRegisterForm();

  return (
    <div className="w-full">
      <h1 className="text-3xl font-extrabold text-ink mb-1">Create account 🌱</h1>
      <p className="text-muted mb-8">Start your journey to a smaller footprint.</p>

      <form className="flex flex-col" onSubmit={f.submit}>
        <label className="text-sm font-medium text-ink mb-1">Name</label>
        <div className="mb-4">
          <Input type="text" placeholder="Your name" value={f.name} onChange={(e) => f.setName(e.target.value)} required />
        </div>

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
        <div className="mb-4">
          <PasswordInput
            placeholder="••••••••"
            value={f.password}
            onChange={(e) => f.setPassword(e.target.value)}
            required
          />
        </div>

        <label className="text-sm font-medium text-ink mb-1">Confirm Password</label>
        <div className="mb-5">
          <PasswordInput
            placeholder="••••••••"
            value={f.confirm}
            onChange={(e) => f.setConfirm(e.target.value)}
            required
          />
        </div>

        <Alert className="mb-3">{f.error}</Alert>

        <Button type="submit" variant="gradient" size="full" disabled={f.loading}>
          {f.loading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <SocialLogin label="Sign up with Google" />

      <p className="text-center mt-8 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-600 font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
