"use client";

import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/components/ui/Toast";

/** Dòng "or" + nút Google (chưa làm). */
export default function SocialLogin({ label }: { label: string }) {
  const toast = useToast();
  return (
    <>
      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-line-strong" />
        <span className="text-xs text-muted">or</span>
        <span className="flex-1 h-px bg-line-strong" />
      </div>
      <button
        type="button"
        onClick={() => toast.info("Google sign-in is coming soon")}
        className="w-full flex items-center justify-center gap-3 py-3 border border-line-strong rounded-xl font-semibold text-ink hover:bg-subtle transition-colors"
      >
        <FcGoogle size={22} /> {label}
      </button>
    </>
  );
}
