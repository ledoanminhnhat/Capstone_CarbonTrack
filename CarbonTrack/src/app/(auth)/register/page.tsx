"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const eyeIcon = (shown: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="text-[#999] hover:text-[#555] flex items-center"
      aria-label={shown ? "Hide password" : "Show password"}
    >
      {shown ? <FiEyeOff size={18} /> : <FiEye size={18} />}
    </button>
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-extrabold text-ink mb-1">Create account 🌱</h1>
      <p className="text-muted mb-8">Start your journey to a smaller footprint.</p>

      <form className="flex flex-col" onSubmit={handleRegister}>
        <label className="text-sm font-medium text-ink mb-1">Name</label>
        <div className="mb-4">
          <Input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <label className="text-sm font-medium text-ink mb-1">Email</label>
        <div className="mb-4">
          <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <label className="text-sm font-medium text-ink mb-1">Password</label>
        <div className="mb-4">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            iconPosition="right"
            icon={eyeIcon(showPassword, () => setShowPassword((v) => !v))}
          />
        </div>

        <label className="text-sm font-medium text-ink mb-1">Confirm Password</label>
        <div className="mb-5">
          <Input
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            iconPosition="right"
            icon={eyeIcon(showConfirm, () => setShowConfirm((v) => !v))}
          />
        </div>

        {error && <p className="text-rose-600 text-sm mb-3">{error}</p>}

        <Button type="submit" variant="gradient" size="full" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-muted">or</span>
        <span className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={() => alert("Google sign-up coming soon")}
        className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl font-semibold text-ink hover:bg-gray-50 transition-colors"
      >
        <FcGoogle size={22} /> Sign up with Google
      </button>

      <p className="text-center mt-8 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-600 font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
