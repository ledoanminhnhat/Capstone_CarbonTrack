"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { getChallenges, type ChallengeView } from "@/lib/challenges";
import {
  getRecommendations,
  applyRecommendation,
  type RecommendationResponse,
  type Recommendation,
} from "@/lib/recommendations";

const CATEGORY_COLORS: Record<string, string> = {
  Transport: "#0ea960",
  Food: "#f97316",
  Energy: "#6366f1",
  Shopping: "#eab308",
};

const DIFFICULTY_STYLE: Record<Recommendation["difficulty"], string> = {
  EASY: "bg-[#e6f7ee] text-[#0c9052]",
  MEDIUM: "bg-[#fff4e0] text-[#b45309]",
  HARD: "bg-[#fde8e8] text-[#b91c1c]",
};

type SortKey = "saving" | "difficulty";
const DIFF_ORDER = { EASY: 0, MEDIUM: 1, HARD: 2 };

function currentMonth() {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function RecommendationsPage() {
  const [userName, setUserName] = useState("");
  const [period, setPeriod] = useState<"month" | "all">("month");
  const [sortBy, setSortBy] = useState<SortKey>("saving");
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [challenges, setChallenges] = useState<ChallengeView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyingId, setApplyingId] = useState("");

  useEffect(() => {
    setUserName(getUser()?.name ?? "");
  }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [rec, chs] = await Promise.all([
        getRecommendations(period === "month" ? currentMonth() : undefined),
        getChallenges(),
      ]);
      setData(rec);
      setChallenges(chs);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const handleApply = async (rec: Recommendation) => {
    setApplyingId(rec.id);
    try {
      await applyRecommendation(rec.id);
      setChallenges(await getChallenges());
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to start challenge");
    } finally {
      setApplyingId("");
    }
  };

  // Challenge đang tham gia, khớp theo sub-category đếm
  const challengeFor = (rec: Recommendation) =>
    rec.challengeMatch
      ? challenges.find(
          (c) => c.joined && c.matchType === "SUBCATEGORY" && c.matchValue === rec.challengeMatch
        )
      : undefined;

  const sorted = useMemo(() => {
    const list = [...(data?.recommendations ?? [])];
    if (sortBy === "difficulty") {
      list.sort(
        (a, b) =>
          DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty] ||
          b.estimatedSavingKg - a.estimatedSavingKg
      );
    }
    return list; // backend đã sắp xếp theo saving
  }, [data, sortBy]);

  // Donut: conic-gradient từ breakdown
  const donut = useMemo(() => {
    let acc = 0;
    const stops = (data?.breakdown ?? []).map((b) => {
      const start = acc;
      acc += b.percent * 3.6;
      return `${CATEGORY_COLORS[b.category] ?? "#999"} ${start}deg ${acc}deg`;
    });
    return stops.length ? `conic-gradient(${stops.join(", ")})` : "#eee";
  }, [data]);

  const top = data?.breakdown[0];
  const savingPct =
    data && data.totalCo2 > 0 ? Math.round((data.totalPotentialSaving / data.totalCo2) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
        <h2 className="text-3xl font-bold text-[#333]">Recommendation</h2>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "month" | "all")}
            className="bg-white border border-[#ccc] rounded-md px-3 py-2 text-sm font-semibold text-[#555]"
          >
            <option value="month">This month</option>
            <option value="all">All time</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="bg-white border border-[#ccc] rounded-md px-3 py-2 text-sm font-semibold text-[#555]"
          >
            <option value="saving">Sort by: Biggest saving</option>
            <option value="difficulty">Sort by: Easiest first</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-[#fde8e8] text-[#b91c1c] p-4 rounded-lg text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-[#888]">Loading...</div>
      ) : data && data.totalCo2 === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm text-center flex flex-col items-center gap-4">
          <div className="text-5xl">🌱</div>
          <p className="text-[#555]">
            No activities {period === "month" ? "this month" : "yet"}. Log some activities to get
            personalized recommendations.
          </p>
          {period === "month" && (
            <button
              onClick={() => setPeriod("all")}
              className="py-2 px-4 border border-[#0ea960] text-[#0ea960] font-bold rounded-lg"
            >
              View all time
            </button>
          )}
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Footprint Drivers */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
            <h3 className="text-sm font-bold text-[#888] tracking-wider mb-4">
              YOUR FOOTPRINT DRIVERS ({period === "month" ? "THIS MONTH" : "ALL TIME"})
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#aed9b8] flex items-center justify-center text-2xl font-bold text-[#0c9052]">
                {userName.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <h4 className="font-bold text-xl text-[#333]">{userName}</h4>
                <p className="text-sm text-[#888]">{data.totalCo2} kg CO₂e total</p>
              </div>
            </div>

            <div className="flex gap-6 items-center mb-6">
              <div className="w-28 h-28 relative shrink-0">
                <div className="absolute inset-0 rounded-full" style={{ background: donut }} />
                <div className="absolute inset-5 bg-white rounded-full" />
              </div>
              <div className="flex-1 text-sm font-semibold flex flex-col gap-2">
                {data.breakdown.map((b) => (
                  <div key={b.category} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span
                          className="text-lg leading-none"
                          style={{ color: CATEGORY_COLORS[b.category] ?? "#999" }}
                        >
                          ■
                        </span>
                        {b.category}
                      </span>
                      <span className="text-[#888]">
                        {b.co2} kg · {b.percent}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between pl-5 text-xs text-[#888]">
                      <span>↳ {b.topSub}</span>
                      <span>{b.topSubPercent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {top && (
              <p className="text-sm text-[#555] mb-6">
                <b>{top.category}</b> is your biggest source ({top.percent}%), mostly from{" "}
                <b>{top.topSub}</b>.
              </p>
            )}

            <Link
              href="/history"
              className="w-full py-3 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors mt-auto text-center block"
            >
              See Data
            </Link>
          </div>

          {/* Potential saving summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-[#888] tracking-wider">POTENTIAL SAVINGS</h3>
            <p className="text-sm text-[#555]">
              Following the plan below could cut about{" "}
              <b className="text-[#0c9052]">{data.totalPotentialSaving} kg CO₂e</b> (
              {savingPct}% of your footprint).
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold text-[#333]">
                <span>Now: {data.totalCo2} kg</span>
                <span>
                  After: {Math.round((data.totalCo2 - data.totalPotentialSaving) * 100) / 100} kg
                </span>
              </div>
              <div className="h-4 w-full bg-[#eee] rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-[#0ea960]"
                  style={{ width: `${100 - savingPct}%` }}
                />
                <div className="h-full bg-[#aed9b8]" style={{ width: `${savingPct}%` }} />
              </div>
              <div className="flex gap-4 text-xs text-[#888]">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#0ea960] inline-block" /> Remaining
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#aed9b8] inline-block" /> Can be saved
                </span>
              </div>
            </div>
            <Link
              href="/challenges"
              className="w-full py-3 border border-[#0ea960] text-[#0ea960] font-bold rounded-lg hover:bg-[#e6f7ee] transition-colors mt-auto text-center block"
            >
              View My Challenges
            </Link>
          </div>

          {/* Action plan */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-[#888] tracking-wider">
              PERSONALIZED REDUCTION ACTION PLAN
            </h3>
            {sorted.map((rec) => {
              const ch = challengeFor(rec);
              return (
                <div
                  key={rec.id}
                  className="bg-white p-5 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-[240px]">
                    <div className="text-4xl">{rec.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-[#333]">{rec.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_STYLE[rec.difficulty]}`}
                        >
                          {rec.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-[#555] mt-1">{rec.description}</p>
                      {ch && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 h-2 bg-[#eee] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0ea960]"
                              style={{ width: `${(ch.progress / ch.target) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#888]">
                            {ch.status === "COMPLETED"
                              ? "Completed 🎉"
                              : `${ch.progress}/${ch.target} ${rec.challengeMatch}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-xs text-[#888]">Save estimate</div>
                    <div className="font-bold text-[#333]">{rec.estimatedSavingKg} kg CO₂e</div>
                    {rec.challengeMatch &&
                      (ch ? (
                        <Link
                          href="/challenges"
                          className="py-2 px-4 border border-[#0ea960] text-[#0ea960] text-sm font-bold rounded-lg"
                        >
                          In Challenges
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleApply(rec)}
                          disabled={applyingId === rec.id}
                          className="py-2 px-4 bg-[#0ea960] text-white text-sm font-bold rounded-lg hover:bg-[#0c9052] transition-colors disabled:opacity-60"
                        >
                          {applyingId === rec.id ? "Starting..." : "Start Challenge"}
                        </button>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
