"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, remember);
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-extrabold text-ink mb-1">Welcome back 👋</h1>
      <p className="text-muted mb-8">Sign in to continue tracking your footprint.</p>

      <form className="flex flex-col" onSubmit={handleLogin}>
        <label className="text-sm font-medium text-ink mb-1">Email</label>
        <div className="mb-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <label className="text-sm font-medium text-ink mb-1">Password</label>
        <div className="mb-3">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            iconPosition="right"
            icon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-[#999] hover:text-[#555] flex items-center"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between mb-5 text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-muted select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-brand-600"
            />
            Remember me
          </label>
          <Link href="#" className="text-brand-600 font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-rose-600 text-sm mb-3">{error}</p>}

        <Button type="submit" variant="gradient" size="full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-muted">or</span>
        <span className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={() => alert("Google sign-in coming soon")}
        className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl font-semibold text-ink hover:bg-gray-50 transition-colors"
      >
        <FcGoogle size={22} /> Sign in with Google
      </button>

      <p className="text-center mt-8 text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brand-600 font-semibold hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
