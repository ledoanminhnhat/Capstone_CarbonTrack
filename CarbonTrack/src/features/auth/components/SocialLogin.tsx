"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/utils/error";
import { loginWithGoogle } from "../services/auth.service";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

const BUTTON_CLASS =
  "w-full flex items-center justify-center gap-3 py-3 border border-line-strong rounded-xl font-semibold text-ink hover:bg-subtle transition-colors disabled:opacity-60";

/** Dòng "or" + nút đăng nhập Google. */
export default function SocialLogin({ label }: { label: string }) {
  return (
    <>
      <div className="flex items-center gap-3 my-6">
        <span className="flex-1 h-px bg-line-strong" />
        <span className="text-xs text-muted">or</span>
        <span className="flex-1 h-px bg-line-strong" />
      </div>
      {GOOGLE_CLIENT_ID ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleButton label={label} />
        </GoogleOAuthProvider>
      ) : (
        <NotConfiguredButton label={label} />
      )}
    </>
  );
}

function GoogleButton({ label }: { label: string }) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const start = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async ({ access_token }) => {
      try {
        await loginWithGoogle(access_token);
        router.push("/home");
      } catch (err) {
        toast.error(errorMessage(err, "Google sign-in failed"));
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google sign-in failed");
      setLoading(false);
    },
    // người dùng đóng popup
    onNonOAuthError: () => setLoading(false),
  });

  return (
    <button type="button" disabled={loading} onClick={() => { setLoading(true); start(); }} className={BUTTON_CLASS}>
      <FcGoogle size={22} /> {loading ? "Signing in…" : label}
    </button>
  );
}

/** Chưa set NEXT_PUBLIC_GOOGLE_CLIENT_ID. */
function NotConfiguredButton({ label }: { label: string }) {
  const toast = useToast();
  return (
    <button type="button" onClick={() => toast.info("Google sign-in is not configured")} className={BUTTON_CLASS}>
      <FcGoogle size={22} /> {label}
    </button>
  );
}
