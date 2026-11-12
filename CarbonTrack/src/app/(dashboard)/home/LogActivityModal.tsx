import React, { useState } from 'react';
import { MdOutlineDirectionsCar, MdOutlineEco, MdOutlineBolt, MdOutlineShoppingBag, MdClose } from 'react-icons/md';

import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { logActivity } from "@/lib/activities";

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const tabConfig = {
  Transport: {
    subCategories: [
      { label: 'Motorbike', value: 'Motorbike' },
      { label: 'Car', value: 'Car' },
      { label: 'Bus', value: 'Bus' },
      { label: 'Plane', value: 'Plane' }
    ],
    amountLabel: 'Distance (km)',
  },
  Food: {
    subCategories: [
      { label: 'Red Meat', value: 'Red Meat' },
      { label: 'White Meat / Seafood', value: 'White Meat' },
      { label: 'Vegetarian / Vegan', value: 'Vegetarian' },
    ],
    amountLabel: 'Amount (kg)',
  },
  Energy: {
    subCategories: [
      { label: 'Electricity', value: 'Electricity' },
      { label: 'Natural Gas', value: 'Gas' },
      { label: 'Water', value: 'Water' },
    ],
    amountLabel: 'Amount (kWh / m3)',
  },
  Shopping: {
    subCategories: [
      { label: 'Clothing & Footwear', value: 'Clothing' },
      { label: 'Electronics', value: 'Electronics' },
      { label: 'Furniture', value: 'Furniture' },
    ],
    amountLabel: 'Amount (Items)',
  }
};

const tabs = [
  { id: 'Transport', icon: <MdOutlineDirectionsCar size={24} />, label: 'Transport' },
  { id: 'Food', icon: <MdOutlineEco size={24} />, label: 'Food' },
  { id: 'Energy', icon: <MdOutlineBolt size={24} />, label: 'Energy' },
  { id: 'Shopping', icon: <MdOutlineShoppingBag size={24} />, label: 'Shopping' },
];

// Mỗi category 1 màu riêng
const tabColors: Record<string, { active: string; icon: string }> = {
  Transport: { active: 'border-sky-500 bg-sky-50 text-sky-700', icon: 'text-sky-500' },
  Food: { active: 'border-orange-500 bg-orange-50 text-orange-700', icon: 'text-orange-500' },
  Energy: { active: 'border-amber-500 bg-amber-50 text-amber-700', icon: 'text-amber-500' },
  Shopping: { active: 'border-violet-500 bg-violet-50 text-violet-700', icon: 'text-violet-500' },
};

// Đơn vị hiển thị bên phải ô nhập số
const tabUnit: Record<string, string> = {
  Transport: 'km',
  Food: 'kg',
  Energy: 'kWh / m³',
  Shopping: 'items',
};

export default function LogActivityModal({ isOpen, onClose, onSaved }: LogActivityModalProps) {
  const [activeTab, setActiveTab] = useState('Transport');
  const [subCategory, setSubCategory] = useState(tabConfig.Transport.subCategories[0].value);
  const [amount, setAmount] = useState('10');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSubCategory(tabConfig[tabId as keyof typeof tabConfig].subCategories[0].value);
    setAmount('');
    setError('');
  };

  const handleSave = async () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await logActivity({ category: activeTab, subCategory, amount: value });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const currentConfig = tabConfig[activeTab as keyof typeof tabConfig];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-[520px] overflow-hidden shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header gradient */}
        <div className="bg-gradient-brand px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-bold m-0">Log New Activity</h2>
            <p className="text-white/80 text-sm m-0">Track what you did and see its CO₂.</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Category tabs */}
          <label className="block mb-2 text-sm font-semibold text-ink">Category</label>
          <div className="grid grid-cols-4 gap-2 mb-5">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const colors = tabColors[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                    active ? colors.active : "border-gray-200 text-muted hover:bg-gray-50"
                  }`}
                >
                  <span className={colors.icon}>{tab.icon}</span>
                  <span className="text-xs font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-category */}
          <label className="block mb-2 text-sm font-semibold text-ink">Sub-category</label>
          <div className="mb-5">
            <Select value={subCategory} onChange={setSubCategory} options={currentConfig.subCategories} />
          </div>

          {/* Amount */}
          <label className="block mb-2 text-sm font-semibold text-ink">{currentConfig.amountLabel}</label>
          <div className="mb-5 relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              step="any"
              className="w-full border border-gray-200 rounded-xl py-3 pl-4 pr-24 text-lg font-semibold text-ink outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm font-medium pointer-events-none">
              {tabUnit[activeTab]}
            </span>
          </div>

          {error && <p className="text-rose-600 text-sm mb-3">{error}</p>}

          <Button variant="gradient" size="full" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Calculate & Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
