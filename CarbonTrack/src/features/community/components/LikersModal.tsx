"use client";

import { FaHeart, FaPaperPlane } from "react-icons/fa6";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";
import { lastActiveLabel, isOnline } from "@/utils/presence";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLikers, type LikersTarget } from "../hooks/useLikers";
import AuthorAvatar from "./AuthorAvatar";

/** Modal "Likes" / "Shares": ai đã like bài / comment hoặc share bài (mới nhất trước), có chấm online. */
export default function LikersModal({ target, onClose }: { target: LikersTarget | null; onClose: () => void }) {
  const me = useCurrentUser();
  const { likers, loading, error } = useLikers(target);
  const isShares = target?.kind === "shares";
  const icon = isShares ? <FaPaperPlane className="text-brand-500" size={14} /> : <FaHeart className="text-rose-500" size={15} />;

  return (
    <Modal
      open={!!target}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          {icon} {isShares ? "Shares" : "Likes"}
          {!loading && <span className="text-muted font-normal text-[0.9rem]">· {likers.length}</span>}
        </span>
      }
      maxWidth="max-w-[400px]"
    >
      <Alert>{error}</Alert>
      {loading ? (
        <p className="m-0 py-6 text-center text-muted text-sm">Loading...</p>
      ) : likers.length === 0 ? (
        <p className="m-0 py-6 text-center text-muted text-sm">{isShares ? "No shares yet." : "No likes yet."}</p>
      ) : (
        <ul className="m-0 p-0 list-none max-h-[360px] overflow-y-auto -mx-2">
          {likers.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-subtle">
              <AuthorAvatar author={a} size="md" />
              <div className="flex-1 min-w-0">
                <div className="text-ink font-semibold text-[0.92rem] truncate">
                  {a.name}
                  {a.id === me?.id && <span className="text-muted font-normal"> (you)</span>}
                </div>
                <div className={`text-[0.78rem] ${isOnline(a.lastActiveAt) ? "text-emerald-600" : "text-muted"}`}>
                  {lastActiveLabel(a.lastActiveAt)}
                </div>
              </div>
              <span className="shrink-0">{icon}</span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
