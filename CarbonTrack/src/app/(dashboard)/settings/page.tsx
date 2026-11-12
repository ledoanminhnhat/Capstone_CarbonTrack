"use client";

import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { getProfile, updateName, changePassword } from "@/lib/user";

export default function SettingsPage() {
  // ----- Personal Information -----
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // ----- Account Setting (change password) -----
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    getProfile()
      .then((p) => {
        setName(p.name);
        setEmail(p.email);
      })
      .catch(() => {});
  }, []);

  const handleSaveName = async () => {
    if (!name.trim()) {
      setNameMsg({ ok: false, text: "Name cannot be empty" });
      return;
    }
    setSavingName(true);
    setNameMsg(null);
    try {
      await updateName(name.trim());
      setNameMsg({ ok: true, text: "Saved! Reload to update everywhere." });
    } catch (err) {
      setNameMsg({ ok: false, text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async () => {
    setPwMsg(null);
    if (newPw !== confirmPw) {
      setPwMsg({ ok: false, text: "New passwords do not match" });
      return;
    }
    if (newPw.length < 6) {
      setPwMsg({ ok: false, text: "New password must be at least 6 characters" });
      return;
    }
    setSavingPw(true);
    try {
      await changePassword(currentPw, newPw);
      setPwMsg({ ok: true, text: "Password changed successfully" });
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      setPwMsg({ ok: false, text: err instanceof Error ? err.message : "Change failed" });
    } finally {
      setSavingPw(false);
    }
  };

  const inputCls =
    "flex-1 border border-[#ccc] rounded-md px-3 py-2 outline-none focus:border-[#0ea960]";
  const btnCls =
    "w-full py-3 bg-gradient-brand text-white font-bold rounded-xl shadow-glow-brand hover:brightness-105 transition-colors disabled:opacity-60";

  // Ô mật khẩu kèm nút hiện/ẩn
  const passwordField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    toggle: () => void
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-[#555] text-sm">{label}</label>
      <div className="relative flex items-center">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-[#ccc] rounded-md px-3 py-2 pr-10 outline-none focus:border-[#0ea960]"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 text-[#999] hover:text-[#555] flex items-center"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-3xl font-bold text-ink mb-2">Setting</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Personal Information */}
        <div className="bg-white p-6 rounded-2xl shadow-card flex flex-col gap-5">
          <h3 className="font-bold text-xl text-ink">Personal Information</h3>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#aed9b8] flex items-center justify-center text-3xl font-bold text-[#178a48]">
              {name ? name.charAt(0).toUpperCase() : "👤"}
            </div>
            <h4 className="font-bold text-xl text-ink">{name || "User"} 👋</h4>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label className="text-[#555] font-semibold w-16">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-[#555] font-semibold w-16">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className={`${inputCls} bg-[#f5f5f5] text-[#888] cursor-not-allowed`}
              />
            </div>
          </div>

          {nameMsg && (
            <p className={`text-sm ${nameMsg.ok ? "text-[#0ea960]" : "text-red-600"}`}>
              {nameMsg.text}
            </p>
          )}

          <button className={`${btnCls} mt-2`} onClick={handleSaveName} disabled={savingName}>
            {savingName ? "Saving..." : "Save change"}
          </button>
        </div>

        {/* Account Setting */}
        <div className="bg-white p-6 rounded-2xl shadow-card flex flex-col gap-5">
          <h3 className="font-bold text-xl text-ink">Account Setting</h3>

          <div className="flex flex-col gap-4">
            {passwordField("Current Password", currentPw, setCurrentPw, showCurrent, () => setShowCurrent((v) => !v))}
            {passwordField("New Password", newPw, setNewPw, showNew, () => setShowNew((v) => !v))}
            {passwordField("Confirm New Password", confirmPw, setConfirmPw, showConfirm, () => setShowConfirm((v) => !v))}
          </div>

          {pwMsg && (
            <p className={`text-sm ${pwMsg.ok ? "text-[#0ea960]" : "text-red-600"}`}>
              {pwMsg.text}
            </p>
          )}

          <button className={`${btnCls} mt-auto`} onClick={handleChangePassword} disabled={savingPw}>
            {savingPw ? "Changing..." : "Change Password"}
          </button>
        </div>

        {/* Tracking Setting (giao diện - chưa nối backend) */}
        <div className="bg-white p-6 rounded-2xl shadow-card flex flex-col gap-5">
          <h3 className="font-bold text-xl text-ink">
            Tracking Setting <span className="text-xs font-normal text-[#999]">(coming soon)</span>
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label className="text-[#555] font-semibold w-32">Year Target</label>
              <input type="text" defaultValue="1.2 ton CO2e" className={inputCls} />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-[#555] font-semibold w-32">Family member</label>
              <input type="text" defaultValue="4 people" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <label className="text-[#555] font-semibold">Main Transport</label>
              <select className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 bg-white">
                <option>Motorbike</option>
                <option>Car</option>
                <option>Public Transit</option>
                <option>Bicycle</option>
              </select>
            </div>
          </div>

          <button className={`${btnCls} mt-auto opacity-60 cursor-not-allowed`} disabled>
            Save Setting
          </button>
        </div>

        {/* Reminder (giao diện - chưa nối backend) */}
        <div className="bg-white p-6 rounded-2xl shadow-card flex flex-col gap-5">
          <h3 className="font-bold text-xl text-ink">
            Reminder <span className="text-xs font-normal text-[#999]">(coming soon)</span>
          </h3>

          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0ea960]" />
              <span className="text-[#555]">Reminding challenges and information everyday</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-[#0ea960]" />
              <span className="text-[#555]">Let me know when done</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-[#0ea960]" />
              <span className="text-ink font-bold">Announce for new challenges</span>
            </label>
          </div>

          <button className={`${btnCls} mt-auto opacity-60 cursor-not-allowed`} disabled>
            Save Notifications
          </button>
        </div>

      </div>
    </div>
  );
}
