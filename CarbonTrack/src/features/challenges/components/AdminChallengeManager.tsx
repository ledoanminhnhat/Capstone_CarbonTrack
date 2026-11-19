"use client";

import PageHeader from "@/components/ui/PageHeader";
import { useAdminChallenges } from "../hooks/useAdminChallenges";
import CreateChallengeForm from "./CreateChallengeForm";
import AdminChallengeTable from "./AdminChallengeTable";

/** Trang Challenges của admin: tạo + quản lý. */
export default function AdminChallengeManager() {
  const a = useAdminChallenges();
  return (
    <div>
      <PageHeader title="Challenge Management" subtitle="Create and manage challenges for users." />
      <CreateChallengeForm
        form={a.form}
        onChange={a.updateForm}
        onMatchTypeChange={a.setMatchType}
        error={a.formError}
        creating={a.creating}
        onSubmit={a.create}
      />
      <AdminChallengeTable challenges={a.challenges} loading={a.loading} onDelete={a.remove} />
    </div>
  );
}
