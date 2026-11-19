import { FaLeaf, FaTrophy } from "react-icons/fa6";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Author, LeaderboardEntry } from "../types";
import PresenceAvatar from "@/components/ui/PresenceAvatar";

const RANK_COLOR = ["text-amber-500", "text-gray-400", "text-orange-400"];

export function LeaderboardCard({ leaders, meId }: { leaders: LeaderboardEntry[]; meId?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h3 className="m-0 mb-4 text-ink text-[1.1rem] font-bold flex items-center gap-2">
        <FaTrophy className="text-amber-500" size={22} /> Leaderboard
      </h3>
      {leaders.length === 0 ? (
        <p className="text-muted text-sm m-0">No points yet. Complete challenges to rank!</p>
      ) : (
        <ol className="m-0 p-0 list-none flex flex-col gap-3">
          {leaders.map((l, i) => (
            <li key={l.id} className="flex items-center gap-3">
              <span className={`w-6 text-center font-extrabold ${RANK_COLOR[i] ?? "text-muted"}`}>{i + 1}</span>
              <PresenceAvatar {...l} size="sm" />
              <span className="flex-1 text-ink font-semibold text-[0.9rem] truncate">
                {l.name}
                {l.id === meId && <span className="text-muted font-normal"> (you)</span>}
              </span>
              <span className="text-brand-600 font-bold text-[0.85rem]">{l.points.toLocaleString()}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function GuidelinesCard() {
  return (
    <div className="bg-gradient-ocean text-white rounded-2xl p-6 shadow-glow-ocean">
      <h3 className="m-0 mb-2 text-[1.05rem] font-bold flex items-center gap-2">
        <FaLeaf size={16} /> Community guidelines
      </h3>
      <p className="m-0 text-white/90 text-[0.9rem] leading-relaxed">
        Be kind, share real experiences, and help each other live greener. Don&apos;t want to see someone? Use{" "}
        <b>Hide user</b> from the ••• menu.
      </p>
    </div>
  );
}

export function HiddenUsersCard({ muted, onUnhide }: { muted: Author[]; onUnhide: (a: Author) => void }) {
  if (muted.length === 0) return null;
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <SectionTitle count={muted.length}>Hidden users</SectionTitle>
      <ul className="m-0 p-0 list-none flex flex-col gap-3">
        {muted.map((m) => (
          <li key={m.id} className="flex items-center gap-3">
            <PresenceAvatar {...m} size="sm" />
            <span className="flex-1 text-ink text-[0.9rem] truncate">{m.name}</span>
            <button onClick={() => onUnhide(m)} className="text-brand-600 text-[0.8rem] font-semibold hover:underline">
              Unhide
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
