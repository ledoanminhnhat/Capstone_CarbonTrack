"use client";

import { useEffect, useState } from "react";
import { MdDelete, MdClose } from "react-icons/md";
import { getUser } from "@/lib/auth";
import Select from "@/components/ui/Select";
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

  if (loading) {
    return <p className="text-[#999] py-10 text-center">Loading challenges...</p>;
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <h2 className="text-3xl font-bold text-ink">Challenges and Hints</h2>

      <section>
        <p className="font-semibold text-[#555] mb-4">Challenges in progress</p>
        {inProgress.length === 0 ? (
          <p className="text-[#999] text-sm">No challenge in progress. Join one below!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {inProgress.map((c) => (
              <JoinedCard key={c.id} c={c} onClick={() => setSelected(c)} />
            ))}
          </div>
        )}
      </section>

      {completed.length > 0 && (
        <section>
          <p className="font-semibold text-[#555] mb-4">Completed 🎉</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {completed.map((c) => (
              <JoinedCard key={c.id} c={c} onClick={() => setSelected(c)} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-2xl font-bold text-ink mb-4">More Challenges</h3>
        {available.length === 0 ? (
          <p className="text-[#999] text-sm">You&apos;ve joined all available challenges!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {available.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                className="bg-white p-6 rounded-2xl shadow-card flex flex-col cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#e0f2e9] rounded-full flex items-center justify-center text-2xl">
                    {c.emoji}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-ink">{c.title}</h3>
                    <span className="text-[#a8d5ba] text-sm font-semibold">+{c.points} pts</span>
                  </div>
                </div>
                <p className="text-[#555] mb-6 flex-1">{c.description}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoin(c.id);
                  }}
                  disabled={joiningId === c.id}
                  className="w-full py-3 bg-gradient-brand text-white font-bold rounded-xl shadow-glow-brand hover:brightness-105 transition-colors mt-auto disabled:opacity-60"
                >
                  {joiningId === c.id ? "Joining..." : "Join Challenge"}
                </button>
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

function JoinedCard({ c, onClick }: { c: ChallengeView; onClick?: () => void }) {
  const pct = Math.min(100, Math.round((c.progress / c.target) * 100));
  const done = c.status === "COMPLETED";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-card flex flex-col cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className={`h-20 relative flex justify-center ${done ? "bg-gradient-sunrise" : "bg-gradient-leaf"}`}>
        <div className="absolute -bottom-6 w-16 h-16 bg-[#e0f2e9] rounded-full flex items-center justify-center border-4 border-white text-2xl">
          {c.emoji}
        </div>
      </div>
      <div className="pt-10 pb-6 px-6 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-center mb-4 text-ink">{c.title}</h3>
        <div className="mb-2">
          <div className="h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${done ? "bg-gradient-sunrise" : "bg-gradient-leaf"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-sm font-semibold mb-6">
          <span className="text-[#555]">{c.progress}/{c.target}</span>
          <span className="text-[#a8d5ba]">+{c.points} pts</span>
        </div>
        <div
          className={`mt-auto w-full py-2 text-center font-bold rounded-lg ${
            done ? "bg-[#fff3e0] text-[#b7791f]" : "bg-[#f5f9f5] text-[#0ea960]"
          }`}
        >
          {done ? "✓ Completed" : "In progress"}
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
      ? `Any "${c.matchValue}" activity you log`
      : `Logging "${c.matchValue}" activities`;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-[460px] p-6 relative shadow-[0_10px_25px_rgba(0,0,0,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-black"
          aria-label="Close"
        >
          <MdClose size={24} />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-[#e0f2e9] rounded-full flex items-center justify-center text-3xl">
            {c.emoji}
          </div>
          <div>
            <h3 className="font-bold text-xl text-ink">{c.title}</h3>
            <span className="text-[#0ea960] font-semibold">+{c.points} pts</span>
          </div>
        </div>

        <p className="text-[#555] mb-5">{c.description}</p>

        {/* Thông tin luật */}
        <div className="bg-[#f5f9f5] rounded-lg p-4 mb-5 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">What counts</span>
            <span className="text-ink font-medium">{whatCounts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Goal</span>
            <span className="text-ink font-medium">{c.target} times</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Reward</span>
            <span className="text-ink font-medium">{c.points} points</span>
          </div>
        </div>

        {/* Tiến độ nếu đã tham gia */}
        {c.joined ? (
          <>
            <div className="flex justify-between text-sm font-semibold mb-1">
              <span className="text-[#555]">Progress</span>
              <span className={done ? "text-[#b7791f]" : "text-[#0ea960]"}>
                {c.progress}/{c.target} {done && "· Completed 🎉"}
              </span>
            </div>
            <div className="h-2 bg-[#e5e7eb] rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full ${done ? "bg-gradient-sunrise" : "bg-gradient-leaf"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {!done && (
              <p className="text-[#999] text-xs">
                Log matching activities from the Dashboard to make progress.
              </p>
            )}
          </>
        ) : (
          <button
            onClick={onJoin}
            disabled={joining}
            className="w-full py-3 bg-gradient-brand text-white font-bold rounded-xl shadow-glow-brand hover:brightness-105 transition-colors disabled:opacity-60"
          >
            {joining ? "Joining..." : "Join Challenge"}
          </button>
        )}
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

  const inputCls = "border border-[#ccc] rounded-md px-3 py-2 outline-none focus:border-[#0ea960]";

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="text-3xl font-bold text-ink">Challenge Management</h2>
        <p className="text-muted text-sm mt-1">Create and manage challenges for users.</p>
      </div>

      {/* Create form */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="font-bold text-lg text-ink mb-4">Create new challenge</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs">Title</label>
            <input
              placeholder="e.g. Take the bus 5 times"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs">Description</label>
            <input
              placeholder="Short description shown to users"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs">Match type</label>
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
          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs">Match value</label>
            <Select
              value={form.matchValue}
              onChange={(v) => setForm({ ...form, matchValue: v })}
              options={(form.matchType === "CATEGORY" ? CATEGORIES : SUBCATEGORIES).map((v) => ({
                label: v,
                value: v,
              }))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs">Target (times)</label>
            <input
              type="number"
              min={1}
              value={form.target}
              onChange={(e) => setForm({ ...form, target: Number(e.target.value) })}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-muted text-xs">Points</label>
            <input
              type="number"
              min={1}
              value={form.points}
              onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
              className={inputCls}
            />
          </div>
        </div>
        {formMsg && <p className="text-red-600 text-sm mt-3">{formMsg}</p>}
        <button
          onClick={handleCreate}
          disabled={creating}
          className="mt-4 px-6 py-2 bg-gradient-brand text-white font-bold rounded-xl shadow-glow-brand hover:brightness-105 transition-colors disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create Challenge"}
        </button>
      </div>

      {/* Challenge list */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="font-bold text-lg text-ink mb-4">All challenges ({challenges.length})</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0]">Challenge</th>
              <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0]">Rule</th>
              <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0]">Target</th>
              <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0]">Points</th>
              <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0]">Actions</th>
            </tr>
          </thead>
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {challenges.map((c) => (
              <tr key={c.id}>
                <td className="py-4 border-b border-[#f0f0f0] text-[#555] font-medium">
                  {c.emoji} {c.title}
                </td>
                <td className="py-4 border-b border-[#f0f0f0] text-[#555] text-sm">
                  {c.matchType === "CATEGORY" ? "category" : "activity"} = {c.matchValue}
                </td>
                <td className="py-4 border-b border-[#f0f0f0] text-[#555]">{c.target}</td>
                <td className="py-4 border-b border-[#f0f0f0] text-[#555]">{c.points}</td>
                <td className="py-4 border-b border-[#f0f0f0]">
                  <button
                    onClick={() => handleDelete(c)}
                    className="flex items-center gap-1 text-[#c53030] hover:text-[#9b2c2c]"
                  >
                    <MdDelete size={20} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
