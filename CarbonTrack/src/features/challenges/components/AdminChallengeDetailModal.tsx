"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { Loading } from "@/components/ui/EmptyState";
import { useAsync } from "@/hooks/useAsync";
import { formatDate } from "@/utils/date";
import type { AdminChallenge, ChallengeStatus, Participant } from "../types";
import { getChallengeParticipants } from "../services/challenge.service";

type StatusFilter = "ALL" | ChallengeStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
];

/** Ô số liệu nhỏ trong phần thông tin. */
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-subtle rounded-xl px-3 py-2.5">
      <div className="text-[0.7rem] text-muted font-semibold uppercase tracking-wide">{label}</div>
      <div className="text-ink font-bold text-[1.05rem] mt-0.5">{value}</div>
    </div>
  );
}

/** Admin: chi tiết 1 challenge + ai đã tham gia và tiến độ từng người. */
export default function AdminChallengeDetailModal({
  challenge,
  onClose,
}: {
  challenge: AdminChallenge | null;
  onClose: () => void;
}) {
  const id = challenge?.id;
  const { data, loading, error } = useAsync<Participant[]>(
    () => (id ? getChallengeParticipants(id) : Promise.resolve([])),
    [id],
    [],
  );
  const [filter, setFilter] = useState<StatusFilter>("ALL");

  const all = data ?? [];
  const list = filter === "ALL" ? all : all.filter((p) => p.status === filter);
  const countOf = (f: StatusFilter) => (f === "ALL" ? all.length : all.filter((p) => p.status === f).length);

  const close = () => {
    setFilter("ALL");
    onClose();
  };

  return (
    <Modal
      open={!!challenge}
      onClose={close}
      title={challenge?.title}
      maxWidth="max-w-[560px]"
    >
      {challenge && (
        <div className="mb-6 flex flex-col gap-3">
          <p className="m-0 text-muted text-[0.9rem]">{challenge.description}</p>
          <div>
            <Badge tone={challenge.matchType === "CATEGORY" ? "info" : "brand"} size="sm">
              {challenge.matchType === "CATEGORY" ? "Category" : "Activity"}: {challenge.matchValue}
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Stat label="Target" value={`${challenge.target}×`} />
            <Stat label="Points" value={<span className="text-brand-600">+{challenge.points}</span>} />
            <Stat label="Joined" value={challenge.participants} />
            <Stat
              label="Completed"
              value={
                <>
                  {challenge.completed}
                  {challenge.participants > 0 && (
                    <span className="text-muted text-xs font-semibold ml-1">
                      {Math.round((challenge.completed / challenge.participants) * 100)}%
                    </span>
                  )}
                </>
              }
            />
          </div>
        </div>
      )}

      <h4 className="m-0 mb-3 text-ink text-[0.95rem] font-bold">Participants</h4>

      {/* Lọc theo trạng thái */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              filter === f.value
                ? "bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-50/10 dark:text-brand-400"
                : "bg-surface border-line-strong text-muted hover:text-ink"
            }`}
          >
            {f.label} <span className="opacity-70">({loading ? "…" : countOf(f.value)})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="m-0 py-8 text-center text-rose-500">{error}</p>
      ) : list.length === 0 ? (
        <p className="m-0 py-8 text-center text-muted">
          {all.length === 0 ? "No one has joined this challenge yet." : "No participants match this filter."}
        </p>
      ) : (
        <ul className="m-0 p-0 list-none flex flex-col">
          {list.map((p) => {
            const done = p.status === "COMPLETED";
            return (
              <li key={p.userId} className="py-3 border-b border-line last:border-b-0 flex items-center gap-3">
                <Avatar id={p.userId} name={p.name} avatarUrl={p.avatarUrl} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-ink font-semibold text-[0.9rem] truncate">{p.name}</span>
                    <Badge tone={done ? "success" : "warning"} size="sm">
                      {done ? "Completed" : "In progress"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <ProgressBar value={p.progress} max={p.target} done={done} className="h-1.5 flex-1" />
                    <span className="text-xs font-semibold text-ink tabular-nums shrink-0">
                      {p.progress}/{p.target}
                    </span>
                  </div>
                  <span className="text-[0.72rem] text-muted">Joined {formatDate(p.joinedDate)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
