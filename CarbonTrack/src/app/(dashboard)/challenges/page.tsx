"use client";

import React, { useEffect, useState } from "react";
import { MdDelete, MdClose, MdBolt, MdEmojiEvents, MdStar, MdExplore } from "react-icons/md";
import { getUser } from "@/lib/auth";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import StatTile from "@/components/ui/StatTile";
import {
  getChallenges,
  joinChallenge,
  getAdminChallenges,
  createChallenge,
  deleteChallenge,
  type ChallengeView,
  type AdminChallenge,
} from "@/lib/challenges";

export default function ChallengesPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAdmin(getUser()?.role === "ADMIN");
  }, []);

  if (isAdmin === null) return null;
  return isAdmin ? <AdminChallengeManager /> : <UserChallenges />;
}

function SectionTitle({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <h3 className="m-0 mb-4 text-ink text-[1.1rem] font-bold flex items-center gap-2">
      {children}
      {count !== undefined && <Badge tone="neutral">{count}</Badge>}
    </h3>
  );
}

/* ================= USER VIEW: tham gia + tiến độ ================= */
function UserChallenges() {
  const [challenges, setChallenges] = useState<ChallengeView[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState("");
  const [selected, setSelected] = useState<ChallengeView | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      setChallenges(await getChallenges());
    } catch {
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id: string) => {
    setJoiningId(id);
    try {
      await joinChallenge(id);
      await load();
    } catch {
      /* ignore */
    } finally {
      setJoiningId("");
    }
  };

  const inProgress = challenges.filter((c) => c.joined && c.status !== "COMPLETED");
  const completed = challenges.filter((c) => c.joined && c.status === "COMPLETED");
  const available = challenges.filter((c) => !c.joined);
  const earned = completed.reduce((s, c) => s + c.points, 0);

  if (loading) {
    return <p className="text-muted py-10 text-center">Loading challenges...</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <PageHeader
          title="Challenges"
          subtitle="Join a challenge, log matching activities, and earn points automatically."
        />
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatTile
            variant="brand"
            label="In progress"
            value={inProgress.length}
            unit="challenges"
            icon={<MdBolt size={20} />}
          />
          <StatTile
            label="Completed"
            value={completed.length}
            unit="challenges"
            icon={<MdEmojiEvents size={20} />}
            iconCls="text-amber-500 bg-amber-50"
          />
          <StatTile
            label="Available"
            value={available.length}
            unit="to join"
            icon={<MdExplore size={20} />}
            iconCls="text-sky-600 bg-sky-50"
          />
          <StatTile
            variant="ocean"
            label="Points earned"
            value={earned.toLocaleString()}
            unit="from challenges"
            icon={<MdStar size={20} />}
          />
        </section>
      </div>

      <section>
        <SectionTitle count={inProgress.length}>In progress</SectionTitle>
        {inProgress.length === 0 ? (
          <EmptyState text="No challenge in progress yet. Pick one below to get started!" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {inProgress.map((c) => (
              <JoinedCard key={c.id} c={c} onClick={() => setSelected(c)} />
            ))}
          </div>
        )}
      </section>

      {completed.length > 0 && (
        <section>
          <SectionTitle count={completed.length}>Completed 🎉</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {completed.map((c) => (
              <JoinedCard key={c.id} c={c} onClick={() => setSelected(c)} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionTitle count={available.length}>More challenges</SectionTitle>
        {available.length === 0 ? (
          <EmptyState text="You've joined every available challenge. Nice work!" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {available.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                className="bg-white p-6 rounded-2xl shadow-card flex flex-col cursor-pointer transition-all duration-200 hover:shadow-glow-brand hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    {c.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="m-0 font-bold text-[1.05rem] text-ink">{c.title}</h4>
                    <p className="m-0 mt-1 text-muted text-[0.85rem]">
                      Goal: {c.target}× {c.matchValue}
                    </p>
                  </div>
                  <Badge tone="success">+{c.points} pts</Badge>
                </div>
                <p className="text-muted text-[0.9rem] mb-6 flex-1 m-0">{c.description}</p>
                <Button
                  variant="gradient"
                  size="full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoin(c.id);
                  }}
                  disabled={joiningId === c.id}
                  className="disabled:opacity-60"
                >
                  {joiningId === c.id ? "Joining..." : "Join Challenge"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <ChallengeDetailModal
          c={selected}
          joining={joiningId === selected.id}
          onJoin={async () => {
            await handleJoin(selected.id);
            setSelected(null);
          }}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="bg-white/60 border border-dashed border-gray-200 rounded-2xl p-8 text-center text-muted text-[0.9rem]">
      {text}
    </div>
  );
}

function ProgressBar({ pct, done }: { pct: number; done: boolean }) {
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${done ? "bg-gradient-sunrise" : "bg-gradient-leaf"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function JoinedCard({ c, onClick }: { c: ChallengeView; onClick?: () => void }) {
  const pct = Math.min(100, Math.round((c.progress / c.target) * 100));
  const done = c.status === "COMPLETED";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-card flex flex-col cursor-pointer transition-all duration-200 hover:shadow-glow-brand hover:-translate-y-0.5"
    >
      <div className={`h-20 relative flex justify-center ${done ? "bg-gradient-sunrise" : "bg-gradient-leaf"}`}>
        <div className="absolute -bottom-7 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-card text-2xl">
          {c.emoji}
        </div>
      </div>
      <div className="pt-10 pb-6 px-6 flex flex-col flex-1">
        <h4 className="m-0 font-bold text-[1.05rem] text-center mb-4 text-ink">{c.title}</h4>
        <ProgressBar pct={pct} done={done} />
        <div className="flex justify-between text-[0.85rem] font-semibold mt-2 mb-5">
          <span className="text-muted">
            {c.progress}/{c.target} · {pct}%
          </span>
          <span className="text-brand-600">+{c.points} pts</span>
        </div>
        <div className="mt-auto flex justify-center">
          <Badge tone={done ? "warning" : "success"} dot>
            {done ? "Completed" : "In progress"}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// Modal hiển thị chi tiết 1 challenge khi click vào
function ChallengeDetailModal({
  c,
  joining,
  onJoin,
  onClose,
}: {
  c: ChallengeView;
  joining: boolean;
  onJoin: () => void;
  onClose: () => void;
}) {
  const pct = Math.min(100, Math.round((c.progress / c.target) * 100));
  const done = c.status === "COMPLETED";
  const whatCounts =
    c.matchType === "CATEGORY"
      ? `Any "${c.matchValue}" activity`
      : `Logging "${c.matchValue}"`;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-[460px] overflow-hidden relative shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-2 ${done ? "bg-gradient-sunrise" : "bg-gradient-brand"}`} />
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-muted hover:text-ink"
            aria-label="Close"
          >
            <MdClose size={24} />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-3xl">
              {c.emoji}
            </div>
            <div>
              <h3 className="m-0 font-bold text-xl text-ink pr-8">{c.title}</h3>
              <Badge tone="success" className="mt-1">+{c.points} pts</Badge>
            </div>
          </div>

          <p className="text-muted text-[0.95rem] mb-5">{c.description}</p>

          {/* Thông tin luật */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">What counts</span>
              <span className="text-ink font-semibold">{whatCounts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Goal</span>
              <span className="text-ink font-semibold">{c.target} times</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Reward</span>
              <span className="text-ink font-semibold">{c.points} points</span>
            </div>
          </div>

          {/* Tiến độ nếu đã tham gia */}
          {c.joined ? (
            <>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-muted">Progress</span>
                <span className={done ? "text-amber-600" : "text-brand-600"}>
                  {c.progress}/{c.target} {done && "· Completed 🎉"}
                </span>
              </div>
              <ProgressBar pct={pct} done={done} />
              {!done && (
                <p className="text-muted text-xs mt-3 mb-0">
                  Log matching activities from the Dashboard to make progress.
                </p>
              )}
            </>
          ) : (
            <Button variant="gradient" size="full" onClick={onJoin} disabled={joining} className="disabled:opacity-60">
              {joining ? "Joining..." : "Join Challenge"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Các giá trị hợp lệ cho matchValue (phải khớp đúng dữ liệu activity)
const SUBCATEGORIES = [
  "Motorbike", "Car", "Bus", "Plane",
  "Red Meat", "White Meat", "Vegetarian",
  "Electricity", "Gas", "Water",
  "Clothing", "Electronics", "Furniture",
];
const CATEGORIES = ["Transport", "Food", "Energy", "Shopping"];

// Emoji tự gán theo matchValue để thẻ challenge vẫn có biểu tượng
const EMOJI_MAP: Record<string, string> = {
  Motorbike: "🏍️", Car: "🚗", Bus: "🚌", Plane: "✈️",
  "Red Meat": "🥩", "White Meat": "🍗", Vegetarian: "🥗",
  Electricity: "⚡", Gas: "🔥", Water: "💧",
  Clothing: "👕", Electronics: "📱", Furniture: "🪑",
  Transport: "🚌", Food: "🍽️", Energy: "⚡", Shopping: "🛍️",
};
const emojiFor = (matchValue: string) => EMOJI_MAP[matchValue] ?? "🌱";

/* ================= ADMIN VIEW: tạo + quản lý challenge ================= */
function AdminChallengeManager() {
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const emptyForm = {
    title: "",
    description: "",
    points: 100,
    matchType: "SUBCATEGORY" as "SUBCATEGORY" | "CATEGORY",
    matchValue: "Bus",
    target: 3,
  };
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [formMsg, setFormMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setChallenges(await getAdminChallenges());
    } catch {
      /* ignore */
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.matchValue.trim()) {
      setFormMsg("Please fill title, description and match value");
      return;
    }
    setCreating(true);
    setFormMsg("");
    try {
      await createChallenge({ ...form, emoji: emojiFor(form.matchValue) });
      setForm(emptyForm);
      await load();
    } catch (err) {
      setFormMsg(err instanceof Error ? err.message : "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (c: AdminChallenge) => {
    if (!confirm(`Delete challenge "${c.title}"?`)) return;
    try {
      await deleteChallenge(c.id);
      setChallenges((prev) => prev.filter((x) => x.id !== c.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const label = "text-muted text-[0.85rem] font-semibold";
  const th = "text-left text-muted font-semibold text-[0.85rem] pb-4 border-b border-gray-100";
  const td = "py-4 border-b border-gray-100 text-[0.9rem]";

  return (
    <div>
      <PageHeader title="Challenge Management" subtitle="Create and manage challenges for users." />

      {/* Create form */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <h3 className="m-0 mb-5 text-ink text-[1.1rem] font-bold">Create new challenge</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={label}>Title</label>
            <Input
              placeholder="e.g. Take the bus 5 times"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label}>Description</label>
            <Input
              placeholder="Short description shown to users"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label}>Match type</label>
            <Select
              value={form.matchType}
              onChange={(v) => {
                const matchType = v as "SUBCATEGORY" | "CATEGORY";
                const firstValue = matchType === "CATEGORY" ? CATEGORIES[0] : SUBCATEGORIES[0];
                setForm({ ...form, matchType, matchValue: firstValue });
              }}
              options={[
                { label: "SUBCATEGORY (specific type)", value: "SUBCATEGORY" },
                { label: "CATEGORY (whole group)", value: "CATEGORY" },
              ]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label}>Match value</label>
            <Select
              value={form.matchValue}
              onChange={(v) => setForm({ ...form, matchValue: v })}
              options={(form.matchType === "CATEGORY" ? CATEGORIES : SUBCATEGORIES).map((v) => ({
                label: `${emojiFor(v)} ${v}`,
                value: v,
              }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label}>Target (times)</label>
            <Input
              type="number"
              min={1}
              value={form.target}
              onChange={(e) => setForm({ ...form, target: Number(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={label}>Points</label>
            <Input
              type="number"
              min={1}
              value={form.points}
              onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
            />
          </div>
        </div>
        {formMsg && (
          <p className="text-sm rounded-lg px-3 py-2 bg-rose-50 text-rose-600 mt-4 mb-0">{formMsg}</p>
        )}
        <Button variant="gradient" onClick={handleCreate} disabled={creating} className="mt-5 disabled:opacity-60">
          {creating ? "Creating..." : "Create Challenge"}
        </Button>
      </div>

      {/* Challenge list */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="m-0 mb-5 text-ink text-[1.1rem] font-bold flex items-center gap-2">
          All challenges <Badge tone="neutral">{challenges.length}</Badge>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className={th}>Challenge</th>
                <th className={th}>Rule</th>
                <th className={th}>Target</th>
                <th className={th}>Points</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>td]:border-b-0">
              {challenges.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted">
                    No challenges yet.
                  </td>
                </tr>
              ) : (
                challenges.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60">
                    <td className={`${td} text-ink font-medium`}>
                      <span className="flex items-center gap-3">
                        <span className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center text-lg">
                          {c.emoji}
                        </span>
                        {c.title}
                      </span>
                    </td>
                    <td className={td}>
                      <Badge tone={c.matchType === "CATEGORY" ? "info" : "neutral"}>
                        {c.matchType === "CATEGORY" ? "Category" : "Activity"}: {c.matchValue}
                      </Badge>
                    </td>
                    <td className={`${td} text-ink`}>{c.target}×</td>
                    <td className={`${td} text-brand-600 font-semibold`}>+{c.points}</td>
                    <td className={`${td} text-right`}>
                      <button
                        onClick={() => handleDelete(c)}
                        className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 text-[0.85rem] font-semibold"
                      >
                        <MdDelete size={18} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
