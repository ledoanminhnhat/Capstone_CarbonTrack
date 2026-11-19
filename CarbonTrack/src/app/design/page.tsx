import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import AvatarGroup from "@/components/ui/AvatarGroup";
import { MdAdminPanelSettings, MdStar } from "react-icons/md";

// Dùng chuỗi class đầy đủ để Tailwind quét được (không ghép động)
const brandScale = [
  { s: 50, cls: "bg-brand-50" },
  { s: 100, cls: "bg-brand-100" },
  { s: 200, cls: "bg-brand-200" },
  { s: 300, cls: "bg-brand-300" },
  { s: 400, cls: "bg-brand-400" },
  { s: 500, cls: "bg-brand-500" },
  { s: 600, cls: "bg-brand-600" },
  { s: 700, cls: "bg-brand-700" },
  { s: 800, cls: "bg-brand-800" },
  { s: 900, cls: "bg-brand-900" },
];
const accents = [
  { name: "emerald", cls: "bg-emerald-500" },
  { name: "cyan", cls: "bg-cyan-500" },
  { name: "sky", cls: "bg-sky-500" },
  { name: "violet", cls: "bg-violet-500" },
  { name: "amber", cls: "bg-amber-500" },
  { name: "rose", cls: "bg-rose-500" },
];
const gradients = [
  { name: "gradient-brand", cls: "bg-gradient-brand" },
  { name: "gradient-leaf", cls: "bg-gradient-leaf" },
  { name: "gradient-ocean", cls: "bg-gradient-ocean" },
  { name: "gradient-sunrise", cls: "bg-gradient-sunrise" },
  { name: "gradient-berry", cls: "bg-gradient-berry" },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen px-6 py-12 md:px-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <Badge tone="success" dot>
          Design System
        </Badge>
        <h1 className="text-5xl font-extrabold mt-3 text-gradient-brand">CarbonTrack UI</h1>
        <p className="text-muted mt-2 text-lg">
          Fresh, colorful & gradient-first — the building blocks for the app.
        </p>
      </div>

      {/* Colors */}
      <Section title="Brand color">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {brandScale.map((b) => (
            <div key={b.s}>
              <div className={`h-14 rounded-lg ${b.cls} shadow-soft`} />
              <p className="text-xs text-muted mt-1 text-center">{b.s}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Accent colors">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {accents.map((a) => (
            <div key={a.name}>
              <div className={`h-16 rounded-xl ${a.cls} shadow-soft`} />
              <p className="text-xs text-muted mt-1 text-center capitalize">{a.name}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Gradients */}
      <Section title="Gradients">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {gradients.map((g) => (
            <div key={g.name}>
              <div className={`h-20 rounded-xl ${g.cls} shadow-card`} />
              <p className="text-xs text-muted mt-1 text-center">{g.name}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="gradient">Gradient</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </Section>

      {/* Cards */}
      <Section title="Cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card accent="brand" hover>
            <h3 className="font-bold text-lg">Brand accent</h3>
            <p className="text-muted text-sm mt-1">Card with a gradient top border and hover lift.</p>
          </Card>
          <Card accent="ocean" hover>
            <h3 className="font-bold text-lg">Ocean accent</h3>
            <p className="text-muted text-sm mt-1">Great for secondary sections.</p>
          </Card>
          <Card accent="sunrise" hover>
            <h3 className="font-bold text-lg">Sunrise accent</h3>
            <p className="text-muted text-sm mt-1">Warm highlight for alerts or goals.</p>
          </Card>
        </div>
      </Section>

      {/* Stat tiles example */}
      <Section title="Stat tiles">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-brand text-white rounded-2xl p-5 shadow-glow-brand">
            <p className="text-white/80 text-sm">Total emissions</p>
            <p className="text-2xl font-bold mt-1">120.5 kg</p>
          </div>
          <Card>
            <p className="text-muted text-sm">Highest</p>
            <p className="text-2xl font-bold mt-1 text-ink">Transport</p>
          </Card>
          <Card>
            <p className="text-muted text-sm">Remaining</p>
            <p className="text-2xl font-bold mt-1 text-ink">25 kg</p>
          </Card>
          <div className="bg-gradient-ocean text-white rounded-2xl p-5 shadow-glow-ocean">
            <p className="text-white/80 text-sm">Score</p>
            <p className="text-2xl font-bold mt-1">1,200 pts</p>
          </div>
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges">
        <div className="flex flex-wrap gap-3">
          <Badge tone="success" dot>Low</Badge>
          <Badge tone="danger" dot>High</Badge>
          <Badge tone="warning">Pending</Badge>
          <Badge tone="info">Info</Badge>
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="brand">Brand</Badge>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          <Badge tone="brand" variant="solid" icon={<MdAdminPanelSettings size={14} />}>Admin</Badge>
          <Badge tone="brand" icon={<MdStar size={14} />}>+50</Badge>
          <Badge tone="warning" variant="outline" size="sm">MEDIUM</Badge>
          <Badge tone="neutral" variant="outline" size="sm">Coming soon</Badge>
          <Badge tone="danger" variant="solid" size="sm">HARD</Badge>
        </div>
      </Section>

      {/* Avatars */}
      <Section title="Avatars">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar id="a1" name="Lan" size="xs" />
          <Avatar id="a2" name="Minh" size="sm" status="success" statusLabel="Active" />
          <Avatar id="a3" name="Ngan" size="md" status="brand" statusLabel="Admin" />
          <Avatar id="a4" name="Bao" size="lg" />
          <AvatarGroup
            people={[
              { id: "a1", name: "Lan" },
              { id: "a2", name: "Minh" },
              { id: "a3", name: "Ngan" },
            ]}
            total={12}
            size="sm"
          />
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-ink">Heading 1 — extrabold</h1>
          <h2 className="text-2xl font-bold text-ink">Heading 2 — bold</h2>
          <p className="text-ink">Body text in ink color for comfortable reading.</p>
          <p className="text-muted text-sm">Muted small text for captions and hints.</p>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">{title}</h2>
      {children}
    </section>
  );
}
