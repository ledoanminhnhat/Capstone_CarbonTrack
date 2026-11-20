"use client";

import { useState } from "react";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { CATEGORIES, SUBCATEGORIES } from "@/constants/categories";
import { errorMessage } from "@/utils/error";
import type { AdminChallenge, MatchType } from "../types";
import { createChallenge, deleteChallenge, getAdminChallenges } from "../services/challenge.service";

const EMPTY_FORM = {
  title: "",
  description: "",
  points: 100,
  matchType: "SUBCATEGORY" as MatchType,
  matchValue: "Bus",
  target: 3,
};
export type ChallengeForm = typeof EMPTY_FORM;

/** Giá trị hợp lệ cho matchValue theo matchType. */
export const matchValuesFor = (t: MatchType) => (t === "CATEGORY" ? (CATEGORIES as string[]) : SUBCATEGORIES);

/** Admin: danh sách + form tạo + xóa challenge. */
export function useAdminChallenges() {
  const toast = useToast();
  const confirm = useConfirm();
  const { data, setData, loading } = useAsync<AdminChallenge[]>(getAdminChallenges, [], []);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  const updateForm = (patch: Partial<ChallengeForm>) => setForm((f) => ({ ...f, ...patch }));

  const setMatchType = (matchType: MatchType) => updateForm({ matchType, matchValue: matchValuesFor(matchType)[0] });

  /** Trả về true nếu tạo thành công (để đóng modal). */
  const create = async (): Promise<boolean> => {
    if (!form.title.trim() || !form.description.trim() || !form.matchValue.trim()) {
      setFormError("Please fill title, description and match value");
      return false;
    }
    setCreating(true);
    setFormError("");
    try {
      const created = await createChallenge(form);
      setData((prev) => [...(prev ?? []), created]);
      setForm(EMPTY_FORM);
      toast.success(`Created "${created.title}"`);
      return true;
    } catch (e) {
      setFormError(errorMessage(e, "Create failed"));
      return false;
    } finally {
      setCreating(false);
    }
  };

  const remove = async (c: AdminChallenge) => {
    const ok = await confirm({
      title: "Delete challenge?",
      message: `"${c.title}" will be removed for all users.`,
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await deleteChallenge(c.id);
      setData((prev) => (prev ?? []).filter((x) => x.id !== c.id));
      toast.success("Challenge deleted");
    } catch (e) {
      toast.error(errorMessage(e, "Delete failed"));
    }
  };

  return { challenges: data ?? [], loading, form, updateForm, setMatchType, formError, creating, create, remove };
}
