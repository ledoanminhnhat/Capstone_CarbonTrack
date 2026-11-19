"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import UserChallenges from "@/features/challenges/components/UserChallenges";
import AdminChallengeManager from "@/features/challenges/components/AdminChallengeManager";

export default function ChallengesPage() {
  const user = useCurrentUser();
  if (!user) return null;
  return user.role === "ADMIN" ? <AdminChallengeManager /> : <UserChallenges />;
}
