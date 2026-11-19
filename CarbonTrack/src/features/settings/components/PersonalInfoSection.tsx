import { FaUser } from "react-icons/fa6";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import FormField from "@/components/ui/FormField";
import SettingsSection from "./SettingsSection";

export default function PersonalInfoSection({
  name,
  email,
  onNameChange,
  error,
  saving,
  onSave,
}: {
  name: string;
  email: string;
  onNameChange: (v: string) => void;
  error: string;
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <SettingsSection icon={<FaUser size={18} />} iconCls="text-brand-600 bg-brand-50" title="Personal Information">
      <FormField label="Name">
        <Input type="text" value={name} onChange={(e) => onNameChange(e.target.value)} />
      </FormField>
      <FormField label="Email">
        <Input type="email" value={email} readOnly className="bg-gray-50 text-muted cursor-not-allowed" />
      </FormField>
      <Alert>{error}</Alert>
      <Button variant="gradient" size="full" className="mt-auto" onClick={onSave} disabled={saving}>
        {saving ? "Saving..." : "Save changes"}
      </Button>
    </SettingsSection>
  );
}
