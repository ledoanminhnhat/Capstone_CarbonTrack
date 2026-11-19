"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdPerson, MdLock, MdTrackChanges, MdNotifications, MdPhotoCamera } from "react-icons/md";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import AvatarCropper from "@/components/ui/AvatarCropper";
import PageHeader from "@/components/ui/PageHeader";
import { getProfile, updateName, updateAvatar, changePassword } from "@/lib/user";
import { uploadImage, validateImage } from "@/lib/community";

type Msg = { ok: boolean; text: string } | null;

// Khung 1 nhóm cài đặt: icon + tiêu đề + nội dung
function Section({
  icon,
  iconCls,
  title,
  badge,
  children,
}: {
  icon: React.ReactNode;
  iconCls: string;
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-card flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconCls}`}>
          {icon}
        </span>
        <h3 className="m-0 font-bold text-[1.1rem] text-ink">{title}</h3>
        {badge && <span className="ml-auto">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-muted text-[0.85rem] font-semibold">{label}</label>
      {children}
    </div>
  );
}

function Message({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <p
      className={`m-0 text-sm rounded-lg px-3 py-2 ${
        msg.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
      }`}
    >
      {msg.text}
    </p>
  );
}

export default function SettingsPage() {
  // ----- Personal Information -----
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<Msg>(null);

  // ----- Change password -----
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<Msg>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ----- Avatar -----
  const [userId, setUserId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getProfile()
      .then((p) => {
        setUserId(p.id);
        setName(p.name);
        setEmail(p.email);
        setAvatarUrl(p.avatarUrl);
      })
      .catch(() => {});
  }, []);

  // Chọn ảnh -> mở khung crop; crop xong mới upload
  const [cropFile, setCropFile] = useState<File | null>(null);

  const handleAvatarFile = (file: File | undefined) => {
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    const err = validateImage(file);
    if (err) {
      setAvatarMsg(err);
      return;
    }
    setAvatarMsg("");
    setCropFile(file);
  };

  const handleCropped = async (cropped: File) => {
    setAvatarBusy(true);
    setAvatarMsg("");
    try {
      const url = await uploadImage(cropped, "avatar");
      setAvatarUrl((await updateAvatar(url)).avatarUrl);
      setCropFile(null);
    } catch (e) {
      setAvatarMsg(e instanceof Error ? e.message : "Upload failed");
      setCropFile(null);
    } finally {
      setAvatarBusy(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarBusy(true);
    setAvatarMsg("");
    try {
      await updateAvatar(null);
      setAvatarUrl(null);
    } catch (e) {
      setAvatarMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setAvatarBusy(false);
    }
  };

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

  // Ô mật khẩu kèm nút hiện/ẩn
  const passwordField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    toggle: () => void
  ) => (
    <Field label={label}>
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        iconPosition="right"
        icon={
          <button
            type="button"
            onClick={toggle}
            className="text-[#999] hover:text-ink flex items-center"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        }
      />
    </Field>
  );

  const comingSoon = <Badge tone="neutral">Coming soon</Badge>;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile and account." />

      {/* Thẻ hồ sơ */}
      <div className="bg-gradient-brand text-white rounded-2xl p-6 shadow-glow-brand flex flex-wrap items-center gap-5 mb-6">
        {/* Bấm vào avatar để đổi ảnh */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={avatarBusy}
          className="relative group rounded-full ring-4 ring-white/30 shrink-0"
          aria-label="Change avatar"
        >
          <Avatar id={userId} name={name} avatarUrl={avatarUrl} size="xl" />
          <span
            className={`absolute inset-0 rounded-full bg-black/40 flex items-center justify-center transition-opacity ${
              avatarBusy ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            {avatarBusy ? (
              <span className="text-xs font-semibold">Uploading...</span>
            ) : (
              <MdPhotoCamera size={28} />
            )}
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(e) => handleAvatarFile(e.target.files?.[0])}
        />
        <div className="min-w-0 flex-1">
          <h3 className="m-0 text-xl font-extrabold truncate">{name || "User"} 👋</h3>
          <p className="m-0 text-white/80 text-sm truncate">{email}</p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={avatarBusy}
              className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-semibold disabled:opacity-60"
            >
              {avatarUrl ? "Change photo" : "Upload photo"}
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={avatarBusy}
                className="px-3 py-1.5 rounded-lg hover:bg-white/15 text-sm font-semibold text-white/90 disabled:opacity-60"
              >
                Remove
              </button>
            )}
          </div>
          {avatarMsg && (
            <p className="m-0 mt-2 text-sm bg-white/90 text-rose-600 rounded-lg px-3 py-1.5 inline-block">
              {avatarMsg}
            </p>
          )}
        </div>
        <p className="m-0 text-white/70 text-xs basis-full md:basis-auto">JPG, PNG or WEBP · max 5MB</p>
      </div>

      {cropFile && (
        <AvatarCropper
          file={cropFile}
          busy={avatarBusy}
          onCancel={() => setCropFile(null)}
          onDone={handleCropped}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section
          icon={<MdPerson size={22} />}
          iconCls="text-brand-600 bg-brand-50"
          title="Personal Information"
        >
          <Field label="Name">
            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={email}
              readOnly
              className="bg-gray-50 text-muted cursor-not-allowed"
            />
          </Field>
          <Message msg={nameMsg} />
          <Button variant="gradient" size="full" className="mt-auto" onClick={handleSaveName} disabled={savingName}>
            {savingName ? "Saving..." : "Save changes"}
          </Button>
        </Section>

        <Section icon={<MdLock size={22} />} iconCls="text-sky-600 bg-sky-50" title="Change Password">
          {passwordField("Current password", currentPw, setCurrentPw, showCurrent, () =>
            setShowCurrent((v) => !v)
          )}
          {passwordField("New password", newPw, setNewPw, showNew, () => setShowNew((v) => !v))}
          {passwordField("Confirm new password", confirmPw, setConfirmPw, showConfirm, () =>
            setShowConfirm((v) => !v)
          )}
          <Message msg={pwMsg} />
          <Button variant="gradient" size="full" className="mt-auto" onClick={handleChangePassword} disabled={savingPw}>
            {savingPw ? "Changing..." : "Change password"}
          </Button>
        </Section>

        {/* Tracking (giao diện - chưa nối backend) */}
        <Section
          icon={<MdTrackChanges size={22} />}
          iconCls="text-amber-500 bg-amber-50"
          title="Tracking"
          badge={comingSoon}
        >
          <div className="flex flex-col gap-4 opacity-60 pointer-events-none">
            <Field label="Year target">
              <Input type="text" defaultValue="1.2 ton CO2e" />
            </Field>
            <Field label="Family members">
              <Input type="text" defaultValue="4 people" />
            </Field>
            <Field label="Main transport">
              <select className="w-full py-3 px-4 border border-[#ccc] rounded-lg text-[0.95rem] bg-white">
                <option>Motorbike</option>
                <option>Car</option>
                <option>Public Transit</option>
                <option>Bicycle</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* Reminder (giao diện - chưa nối backend) */}
        <Section
          icon={<MdNotifications size={22} />}
          iconCls="text-rose-500 bg-rose-50"
          title="Reminders"
          badge={comingSoon}
        >
          <div className="flex flex-col gap-4 opacity-60 pointer-events-none">
            {[
              ["Daily reminder for challenges and tips", true],
              ["Notify me when a challenge is completed", false],
              ["Announce new challenges", false],
            ].map(([label, checked]) => (
              <label key={label as string} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  defaultChecked={checked as boolean}
                  className="w-5 h-5 accent-brand-500"
                />
                <span className="text-ink text-[0.95rem]">{label}</span>
              </label>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
