"use client";

import { FaLock, FaShieldHalved, FaCircleCheck, FaRegCircle } from "react-icons/fa6";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import FormField from "@/components/ui/FormField";
import { MIN_PASSWORD_LENGTH } from "@/features/auth/validation";
import { useChangePassword } from "../hooks/useChangePassword";
import SettingsSection from "./SettingsSection";
import SettingsAside, { SettingsLayout } from "./SettingsAside";

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex items-center gap-2 text-[0.88rem] ${ok ? "text-emerald-600" : "text-muted"}`}>
      {ok ? <FaCircleCheck size={14} /> : <FaRegCircle size={14} />}
      {children}
    </li>
  );
}

/** Tab Password: form đổi mật khẩu + yêu cầu mật khẩu (tick theo thời gian thực). */
export default function ChangePasswordSection() {
  const f = useChangePassword();
  const longEnough = f.next.length >= MIN_PASSWORD_LENGTH;
  const matches = !!f.next && f.next === f.confirm;
  const different = !!f.next && f.next !== f.current;
  const canSubmit = !!f.current && longEnough && matches && different && !f.saving;

  return (
    <SettingsLayout
      main={
        <SettingsSection icon={<FaLock size={16} />} iconCls="text-sky-600 bg-sky-50" title="Change Password">
          <FormField label="Current password">
            <PasswordInput value={f.current} onChange={(e) => f.setCurrent(e.target.value)} autoComplete="current-password" />
          </FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="New password">
              <PasswordInput value={f.next} onChange={(e) => f.setNext(e.target.value)} autoComplete="new-password" />
            </FormField>
            <FormField label="Confirm new password">
              <PasswordInput value={f.confirm} onChange={(e) => f.setConfirm(e.target.value)} autoComplete="new-password" />
            </FormField>
          </div>
          <Alert>{f.error}</Alert>
          <div className="flex justify-end">
            <Button variant="gradient" size="sm" className="px-6" onClick={f.submit} disabled={!canSubmit}>
              {f.saving ? "Changing..." : "Change password"}
            </Button>
          </div>
        </SettingsSection>
      }
      aside={
        <SettingsAside title="Password requirements" icon={<FaShieldHalved size={14} />}>
          <ul className="m-0 p-0 list-none flex flex-col gap-2.5">
            <Check ok={longEnough}>At least {MIN_PASSWORD_LENGTH} characters</Check>
            <Check ok={matches}>New passwords match</Check>
            <Check ok={different}>Different from current password</Check>
          </ul>
          <p className="m-0 mt-4 pt-4 border-t border-line text-muted text-xs leading-relaxed">
            Tip: mix letters, numbers and symbols. After changing, use the new password next time you log in.
          </p>
        </SettingsAside>
      }
    />
  );
}
