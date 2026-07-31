import React, { useState } from 'react';
import { MdOutlineDirectionsCar, MdOutlineEco, MdOutlineBolt, MdOutlineShoppingBag, MdClose } from 'react-icons/md';

import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function LogActivityModal({ isOpen, onClose }: LogActivityModalProps) {
  const [activeTab, setActiveTab] = useState('Transport');
  const [subCategory, setSubCategory] = useState(tabConfig.Transport.subCategories[0].value);
  const [amount, setAmount] = useState('10');

  if (!isOpen) return null;

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSubCategory(tabConfig[tabId as keyof typeof tabConfig].subCategories[0].value);
    setAmount('');
  };

  const tabs = [
    { id: 'Transport', icon: <MdOutlineDirectionsCar size={32} />, label: 'Tranport' },
    { id: 'Food', icon: <MdOutlineEco size={32} />, label: 'Food' },
    { id: 'Energy', icon: <MdOutlineBolt size={32} />, label: 'Energy' },
    { id: 'Shopping', icon: <MdOutlineShoppingBag size={32} />, label: 'Shopping' },
  ];

  const currentConfig = tabConfig[activeTab as keyof typeof tabConfig];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
      <div className="flex w-[700px] h-[400px] bg-[#d2d2d2] rounded-lg relative shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
        {/* Close Button */}
        <button className="absolute top-4 right-4 bg-transparent border-none cursor-pointer text-[#555] z-10 hover:text-black transition-colors" onClick={onClose}>
          <MdClose size={24} />
        </button>

        {/* Sidebar */}
        <div className="w-[140px] bg-[#ebf3eb] flex flex-col py-8 items-center gap-2 rounded-l-lg">
          {tabs.map((tab) => (
            <div 
              key={tab.id}
              className="flex flex-col items-center cursor-pointer gap-2 mb-2"
              onClick={() => handleTabChange(tab.id)}
            >
              <div className={`w-[50px] h-[50px] rounded-full flex justify-center items-center text-[#178a48] ${activeTab === tab.id ? 'bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)]' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[0.75rem] font-bold text-[#111]">{tab.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#cecece] py-8 px-10 flex flex-col rounded-r-lg">
          <h2 className="m-0 mb-6 text-[1.75rem] text-[#2c3238] font-bold">Log New Activity</h2>
          
          <div className="mb-6">
            <label className="block mb-2 text-[#555] font-medium text-[1.05rem]">Sub-category</label>
            <Select 
              value={subCategory}
              onChange={setSubCategory}
              options={currentConfig.subCategories}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-[#555] font-medium text-[1.05rem]">{currentConfig.amountLabel}</label>
            <Input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="any"
            />
          </div>

          <Button className="mt-auto" onClick={onClose} size="full">
            Calculate & Save
          </Button>
        </div>
      </div>
    </div>
  );
}
