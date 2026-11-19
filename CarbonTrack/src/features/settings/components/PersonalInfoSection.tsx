import { FaUser, FaUserShield, FaStar, FaBullseye, FaCircleHalfStroke, FaIdCard } from "react-icons/fa6";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import FormField from "@/components/ui/FormField";
import { useTheme } from "@/providers/ThemeProvider";
import type { UserProfile } from "@/types";
import type { SettingsTab } from "../hooks/useSettingsTab";
import SettingsSection from "./SettingsSection";
import SettingsAside, { AsideRow, SettingsLayout } from "./SettingsAside";

const THEME_LABEL = { light: "Light", dark: "Dark", system: "Auto" } as const;

/** Tab Profile: form tên / email + thẻ tóm tắt tài khoản. */
export default function PersonalInfoSection({
  profile,
  name,
  onNameChange,
  error,
  saving,
  onSave,
  onGoTo,
}: {
  profile?: UserProfile;
  name: string;
  onNameChange: (v: string) => void;
  error: string;
  saving: boolean;
  onSave: () => void;
  onGoTo: (t: SettingsTab) => void;
}) {
  const { theme } = useTheme();
  const dirty = !!profile && name.trim() !== profile.name;

  return (
    <SettingsLayout
      main={
        <SettingsSection icon={<FaUser size={16} />} iconCls="text-brand-600 bg-brand-50" title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Display name">
              <Input type="text" value={name} onChange={(e) => onNameChange(e.target.value)} />
            </FormField>
            <FormField label="Email">
              <Input type="email" value={profile?.email ?? ""} readOnly className="bg-subtle text-muted cursor-not-allowed" />
            </FormField>
          </div>
          <p className="m-0 -mt-1 text-muted text-xs">
            Your display name is shown on Community posts, comments and the leaderboard. Email can&apos;t be changed.
          </p>
          <Alert>{error}</Alert>
          <div className="flex justify-end gap-3">
            <Button variant="outline" size="sm" onClick={() => profile && onNameChange(profile.name)} disabled={!dirty || saving}>
              Reset
            </Button>
            <Button variant="gradient" size="sm" className="px-6" onClick={onSave} disabled={saving || !dirty}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </SettingsSection>
      }
      aside={
        <SettingsAside title="Account overview" icon={<FaIdCard size={14} />}>
          <AsideRow label="Role">
            {profile?.role === "ADMIN" ? (
              <Badge tone="brand" variant="solid" size="sm" icon={<FaUserShield size={11} />}>
                Admin
              </Badge>
            ) : (
              <Badge tone="neutral" variant="outline" size="sm">
                User
              </Badge>
            )}
          </AsideRow>
          <AsideRow label="Challenge points">
            <span className="inline-flex items-center gap-1 text-brand-600">
              <FaStar size={12} /> {(profile?.points ?? 0).toLocaleString()}
            </span>
          </AsideRow>
          <AsideRow label="Yearly goal">
            <button onClick={() => onGoTo("tracking")} className="inline-flex items-center gap-1 hover:text-brand-600">
              <FaBullseye size={12} /> {(profile?.yearlyGoalKg ?? 0).toLocaleString()} kg
            </button>
          </AsideRow>
          <AsideRow label="Theme">
            <button onClick={() => onGoTo("appearance")} className="inline-flex items-center gap-1 hover:text-brand-600">
              <FaCircleHalfStroke size={12} /> {THEME_LABEL[theme]}
            </button>
          </AsideRow>
        </SettingsAside>
      }
    />
  );
}
