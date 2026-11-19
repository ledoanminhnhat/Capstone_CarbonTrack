"use client";

import { MdLock } from "react-icons/md";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import FormField from "@/components/ui/FormField";
import { useChangePassword } from "../hooks/useChangePassword";
import SettingsSection from "./SettingsSection";

export default function ChangePasswordSection() {
  const f = useChangePassword();
  return (
    <SettingsSection icon={<MdLock size={22} />} iconCls="text-sky-600 bg-sky-50" title="Change Password">
      <FormField label="Current password">
        <PasswordInput value={f.current} onChange={(e) => f.setCurrent(e.target.value)} />
      </FormField>
      <FormField label="New password">
        <PasswordInput value={f.next} onChange={(e) => f.setNext(e.target.value)} />
      </FormField>
      <FormField label="Confirm new password">
        <PasswordInput value={f.confirm} onChange={(e) => f.setConfirm(e.target.value)} />
      </FormField>
      <Alert>{f.error}</Alert>
      <Button variant="gradient" size="full" className="mt-auto" onClick={f.submit} disabled={f.saving}>
        {f.saving ? "Changing..." : "Change password"}
      </Button>
    </SettingsSection>
  );
}
