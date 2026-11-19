"use client";

import { useState } from "react";
import { CATEGORY_CONFIG } from "@/constants/categories";
import { errorMessage } from "@/utils/error";
import type { Category } from "@/features/activities/types";
import { logActivity } from "@/features/activities/services/activity.service";

const firstSub = (c: Category) => CATEGORY_CONFIG[c].subCategories[0].value;

/** State + lưu cho modal Log Activity. */
export function useLogActivityForm(onSaved: () => void) {
  const [category, setCategoryState] = useState<Category>("Transport");
  const [subCategory, setSubCategory] = useState(firstSub("Transport"));
  const [amount, setAmount] = useState("10");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setCategory = (c: Category) => {
    setCategoryState(c);
    setSubCategory(firstSub(c));
    setAmount("");
    setError("");
  };

  const save = async (): Promise<boolean> => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      setError("Please enter a valid amount");
      return false;
    }
    setError("");
    setSaving(true);
    try {
      await logActivity({ category, subCategory, amount: value });
      onSaved();
      return true;
    } catch (e) {
      setError(errorMessage(e, "Save failed"));
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { category, setCategory, subCategory, setSubCategory, amount, setAmount, saving, error, save };
}
