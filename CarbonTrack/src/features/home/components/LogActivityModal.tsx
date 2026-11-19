"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Alert from "@/components/ui/Alert";
import { useToast } from "@/components/ui/Toast";
import { CATEGORIES, CATEGORY_CONFIG, CATEGORY_TAB_STYLE } from "@/constants/categories";
import { useLogActivityForm } from "../hooks/useLogActivityForm";
import CategoryIcon from "@/features/activities/components/CategoryIcon";

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function LogActivityModal({ isOpen, onClose, onSaved }: LogActivityModalProps) {
  const toast = useToast();
  const f = useLogActivityForm(onSaved);
  const config = CATEGORY_CONFIG[f.category];

  const handleSave = async () => {
    if (await f.save()) {
      toast.success("Activity logged!");
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      variant="header"
      title="Log New Activity"
      subtitle="Track what you did and see its CO₂."
      maxWidth="max-w-[520px]"
      locked={f.saving}
    >
      <label className="block mb-2 text-sm font-semibold text-ink">Category</label>
      <div className="grid grid-cols-4 gap-2 mb-5">
        {CATEGORIES.map((c) => {
          const active = f.category === c;
          const style = CATEGORY_TAB_STYLE[c];
          return (
            <button
              key={c}
              type="button"
              onClick={() => f.setCategory(c)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                active ? style.active : "border-gray-200 text-muted hover:bg-gray-50"
              }`}
            >
              <span className={style.icon}>
                <CategoryIcon value={c} size={20} />
              </span>
              <span className="text-xs font-semibold">{c}</span>
            </button>
          );
        })}
      </div>

      <label className="block mb-2 text-sm font-semibold text-ink">Sub-category</label>
      <div className="mb-5">
        <Select
          value={f.subCategory}
          onChange={f.setSubCategory}
          options={config.subCategories.map((s) => ({ label: s.label, value: s.value }))}
        />
      </div>

      <label className="block mb-2 text-sm font-semibold text-ink">{config.amountLabel}</label>
      <div className="mb-5 relative">
        <input
          type="number"
          value={f.amount}
          onChange={(e) => f.setAmount(e.target.value)}
          placeholder="0"
          min="0"
          step="any"
          className="w-full border border-gray-200 rounded-xl py-3 pl-4 pr-24 text-lg font-semibold text-ink outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm font-medium pointer-events-none">
          {config.unit}
        </span>
      </div>

      <Alert className="mb-3">{f.error}</Alert>

      <Button variant="gradient" size="full" onClick={handleSave} disabled={f.saving}>
        {f.saving ? "Saving..." : "Calculate & Save"}
      </Button>
    </Modal>
  );
}
