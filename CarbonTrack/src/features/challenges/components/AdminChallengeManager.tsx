"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useAdminChallenges } from "../hooks/useAdminChallenges";
import CreateChallengeForm from "./CreateChallengeForm";
import AdminChallengeTable from "./AdminChallengeTable";
import AdminChallengeDetailModal from "./AdminChallengeDetailModal";
import AdminChallengeFilterBar, {
  EMPTY_FILTERS,
  applyChallengeFilters,
  type ChallengeFilters,
} from "./AdminChallengeFilterBar";
import type { AdminChallenge } from "../types";

/**
 * Trang Challenges của admin: màn chính là danh sách,
 * nút "New challenge" góc phải mở form tạo, bấm 1 dòng để xem chi tiết + người tham gia.
 */
export default function AdminChallengeManager() {
  const a = useAdminChallenges();
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [viewing, setViewing] = useState<AdminChallenge | null>(null);
  const [filters, setFilters] = useState<ChallengeFilters>(EMPTY_FILTERS);

  const submit = async () => {
    if (await a.create()) setCreatingOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Challenge Management"
        subtitle="Create and manage challenges for users."
        actions={
          <Button variant="gradient" onClick={() => setCreatingOpen(true)} className="gap-2">
            <FaPlus size={13} /> New challenge
          </Button>
        }
      />

      <AdminChallengeTable
        challenges={applyChallengeFilters(a.challenges, filters)}
        total={a.challenges.length}
        loading={a.loading}
        onDelete={a.remove}
        onSelect={setViewing}
        toolbar={<AdminChallengeFilterBar filters={filters} onChange={setFilters} />}
      />

      <Modal
        open={creatingOpen}
        onClose={() => setCreatingOpen(false)}
        title="Create new challenge"
        maxWidth="max-w-[640px]"
        locked={a.creating}
      >
        <CreateChallengeForm
          form={a.form}
          onChange={a.updateForm}
          onMatchTypeChange={a.setMatchType}
          error={a.formError}
          creating={a.creating}
          onSubmit={submit}
        />
      </Modal>

      <AdminChallengeDetailModal challenge={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
