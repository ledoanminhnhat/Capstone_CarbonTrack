"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, perform authentication here
    router.push("/home");
  };

  return (
    <form className="flex flex-col w-full" onSubmit={handleLogin}>
      <div className="mb-4">
        <Input
          type="email"
          placeholder="Email"
          required
        />
      </div>
      <div className="mb-4">
        <Input
          type="password"
          placeholder="Password"
          required
        />
      </div>
      <Button type="submit" variant="secondary" size="full" className="mt-2">
        Login
      </Button>

      <div className="text-center mt-6 text-sm text-[#666]">
        Don't have an account? <Link href="/register" className="text-[#888] no-underline hover:underline">Register</Link>
      </div>
    </form>
  );
}
