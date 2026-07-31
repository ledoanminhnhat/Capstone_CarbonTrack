import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaXTwitter } from "react-icons/fa6";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  return (
    <form className="flex flex-col w-full">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Name"
          required
        />
      </div>
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
      <div className="mb-4">
        <Input
          type="password"
          placeholder="Confirm Password"
          required
        />
      </div>
      <Button type="submit" variant="secondary" size="full" className="mt-2">
        Register
      </Button>

      <div className="mt-8 text-center">
        <div className="text-sm text-[#666] mb-4">Create account using...</div>
        <div className="flex justify-center gap-6">
          <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white no-underline transition-transform hover:scale-110">
            <FaFacebook size={32} color="#1877F2" />
          </Link>
          <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white no-underline transition-transform hover:scale-110">
            <FcGoogle size={32} />
          </Link>
          <Link href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white no-underline transition-transform hover:scale-110">
            <FaXTwitter size={32} color="#000000" />
          </Link>
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-[#666]">
        Already have an account? <Link href="/login" className="text-[#888] no-underline hover:underline">Log in</Link>
      </div>
    </form>
  );
}
