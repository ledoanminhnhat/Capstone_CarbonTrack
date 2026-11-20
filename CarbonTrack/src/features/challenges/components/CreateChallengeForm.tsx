import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import FormField from "@/components/ui/FormField";
import type { MatchType } from "../types";
import { matchValuesFor, type ChallengeForm } from "../hooks/useAdminChallenges";

const MATCH_TYPE_OPTIONS = [
  { label: "SUBCATEGORY (specific type)", value: "SUBCATEGORY" },
  { label: "CATEGORY (whole group)", value: "CATEGORY" },
];

/** Form tạo challenge (nằm trong modal "New challenge"). */
export default function CreateChallengeForm({
  form,
  onChange,
  onMatchTypeChange,
  error,
  creating,
  onSubmit,
}: {
  form: ChallengeForm;
  onChange: (patch: Partial<ChallengeForm>) => void;
  onMatchTypeChange: (t: MatchType) => void;
  error: string;
  creating: boolean;
  onSubmit: () => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Title">
          <Input placeholder="e.g. Take the bus 5 times" value={form.title} onChange={(e) => onChange({ title: e.target.value })} />
        </FormField>
        <FormField label="Description">
          <Input
            placeholder="Short description shown to users"
            value={form.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </FormField>
        <FormField label="Match type">
          <Select value={form.matchType} onChange={(v) => onMatchTypeChange(v as MatchType)} options={MATCH_TYPE_OPTIONS} />
        </FormField>
        <FormField label="Match value">
          <Select
            value={form.matchValue}
            onChange={(v) => onChange({ matchValue: v })}
            options={matchValuesFor(form.matchType).map((v) => ({ label: v, value: v }))}
          />
        </FormField>
        <FormField label="Target (times)">
          <Input type="number" min={1} value={form.target} onChange={(e) => onChange({ target: Number(e.target.value) })} />
        </FormField>
        <FormField label="Points">
          <Input type="number" min={1} value={form.points} onChange={(e) => onChange({ points: Number(e.target.value) })} />
        </FormField>
      </div>
      <Alert className="mt-4">{error}</Alert>
      <Button variant="gradient" onClick={onSubmit} disabled={creating} className="mt-5 w-full">
        {creating ? "Creating..." : "Create Challenge"}
      </Button>
    </div>
  );
}
