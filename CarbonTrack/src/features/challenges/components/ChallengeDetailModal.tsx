import { FaStar, FaTrophy } from "react-icons/fa6";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import type { ChallengeView } from "../types";
import { isCompleted, whatCounts } from "../utils";
import ActivityIconBox from "@/features/activities/components/ActivityIconBox";

/** Chi tiết 1 challenge: luật đếm + tiến độ / nút tham gia. */
export default function ChallengeDetailModal({
  c,
  joining,
  onJoin,
  onClose,
}: {
  c: ChallengeView | null;
  joining: boolean;
  onJoin: () => void;
  onClose: () => void;
}) {
  if (!c) return null;
  const done = isCompleted(c);

  return (
    <Modal open onClose={onClose} accent={done ? "sunrise" : "brand"}>
      <div className="flex items-center gap-4 mb-4">
        <ActivityIconBox value={c.matchValue} size="lg" />
        <div>
          <h3 className="m-0 font-bold text-xl text-ink pr-8">{c.title}</h3>
          <Badge tone="brand" icon={<FaStar size={14} />} className="mt-1">
            +{c.points} pts
          </Badge>
        </div>
      </div>

      <p className="text-muted text-[0.95rem] mb-5">{c.description}</p>

      <div className="bg-gray-50 rounded-xl p-4 mb-5 flex flex-col gap-2 text-sm">
        {[
          ["What counts", whatCounts(c)],
          ["Goal", `${c.target} times`],
          ["Reward", `${c.points} points`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-muted">{k}</span>
            <span className="text-ink font-semibold">{v}</span>
          </div>
        ))}
      </div>

      {c.joined ? (
        <>
          <div className="flex justify-between text-sm font-semibold mb-2">
            <span className="text-muted">Progress</span>
            <span className={done ? "text-amber-600" : "text-brand-600"}>
              {c.progress}/{c.target}
              {done && (
                <span className="inline-flex items-center gap-1 ml-1">
                  · <FaTrophy size={12} /> Completed
                </span>
              )}
            </span>
          </div>
          <ProgressBar value={c.progress} max={c.target} done={done} />
          {!done && (
            <p className="text-muted text-xs mt-3 mb-0">Log matching activities from the Dashboard to make progress.</p>
          )}
        </>
      ) : (
        <Button variant="gradient" size="full" onClick={onJoin} disabled={joining}>
          {joining ? "Joining..." : "Join Challenge"}
        </Button>
      )}
    </Modal>
  );
}
