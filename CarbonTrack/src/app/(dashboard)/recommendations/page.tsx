"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MdCloud, MdEco, MdLightbulb, MdTrendingDown } from "react-icons/md";
import { getUser } from "@/lib/auth";
import { getChallenges, type ChallengeView } from "@/lib/challenges";
import {
  getRecommendations,
  applyRecommendation,
  type RecommendationResponse,
  type Recommendation,
} from "@/lib/recommendations";
import { categoryColor } from "@/lib/categories";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PageHeader from "@/components/ui/PageHeader";
import StatTile from "@/components/ui/StatTile";

const DIFFICULTY_TONE = { EASY: "success", MEDIUM: "warning", HARD: "danger" } as const;
const DIFF_ORDER = { EASY: 0, MEDIUM: 1, HARD: 2 };

type SortKey = "saving" | "difficulty";
type Period = "month" | "all";

function currentMonth() {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

export default function RecommendationsPage() {
  const [userName, setUserName] = useState("");
  const [period, setPeriod] = useState<Period>("month");
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
    return list; // backend đã sắp theo saving
  }, [data, sortBy]);

  // Donut: conic-gradient từ breakdown
  const donut = useMemo(() => {
    let acc = 0;
    const stops = (data?.breakdown ?? []).map((b) => {
      const start = acc;
      acc += b.percent * 3.6;
      return `${categoryColor(b.category)} ${start}deg ${acc}deg`;
    });
    return stops.length ? `conic-gradient(${stops.join(", ")})` : "#f3f4f6";
  }, [data]);

  const top = data?.breakdown[0];
  const savingPct =
    data && data.totalCo2 > 0 ? Math.round((data.totalPotentialSaving / data.totalCo2) * 100) : 0;
  const after = data ? Math.round((data.totalCo2 - data.totalPotentialSaving) * 10) / 10 : 0;
  const periodLabel = period === "month" ? "this month" : "all time";

  return (
    <div>
      <PageHeader
        title="Recommendations"
        subtitle={`Personalized ways to cut your footprint, based on your activities ${periodLabel}.`}
        actions={
          <>
            <div className="w-[150px]">
              <Select
                value={period}
                onChange={(v) => setPeriod(v as Period)}
                options={[
                  { label: "This month", value: "month" },
                  { label: "All time", value: "all" },
                ]}
              />
            </div>
            <div className="w-[190px]">
              <Select
                value={sortBy}
                onChange={(v) => setSortBy(v as SortKey)}
                options={[
                  { label: "Biggest saving", value: "saving" },
                  { label: "Easiest first", value: "difficulty" },
                ]}
              />
            </div>
          </>
        }
      />

      {error && (
        <p className="text-sm rounded-xl px-4 py-3 bg-rose-50 text-rose-600 mb-6">{error}</p>
      )}

      {loading ? (
        <p className="text-muted py-10 text-center">Loading recommendations...</p>
      ) : data && data.totalCo2 === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-10 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-4xl">
            🌱
          </div>
          <p className="text-muted m-0">
            No activities {periodLabel}. Log some activities to get personalized recommendations.
          </p>
          {period === "month" && (
            <Button variant="outline" size="sm" onClick={() => setPeriod("all")}>
              View all time
            </Button>
          )}
        </div>
      ) : data ? (
        <>
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatTile
              variant="brand"
              label={`Footprint ${periodLabel}`}
              value={data.totalCo2.toFixed(1)}
              unit="kg CO₂e"
              icon={<MdCloud size={20} />}
            />
            <StatTile
              label="Can be saved"
              value={data.totalPotentialSaving.toFixed(1)}
              unit={`kg CO₂e · ${savingPct}%`}
              icon={<MdTrendingDown size={20} />}
              iconCls="text-brand-600 bg-brand-50"
            />
            <StatTile
              label="Biggest source"
              value={top?.category ?? "—"}
              unit={top ? `${top.percent}% · mostly ${top.topSub}` : undefined}
              icon={<MdEco size={20} />}
              iconCls="text-rose-500 bg-rose-50"
            />
            <StatTile
              variant="ocean"
              label="Actions for you"
              value={data.recommendations.length}
              unit="recommendations"
              icon={<MdLightbulb size={20} />}
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
            {/* Footprint drivers */}
            <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col self-start">
              <h3 className="m-0 mb-1 text-ink text-[1.1rem] font-bold">Footprint Drivers</h3>
              <p className="m-0 mb-6 text-muted text-[0.85rem]">
                {userName ? `${userName}'s` : "Your"} emissions by category
              </p>

              <div className="flex justify-center mb-6">
                <div className="w-40 h-40 relative">
                  <div className="absolute inset-0 rounded-full" style={{ background: donut }} />
                  <div className="absolute inset-[22%] bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-ink">{data.totalCo2.toFixed(0)}</span>
                    <span className="text-[0.7rem] text-muted">kg CO₂e</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {data.breakdown.map((b) => (
                  <div key={b.category}>
                    <div className="flex items-center justify-between text-[0.9rem]">
                      <span className="flex items-center gap-2 text-ink font-semibold">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: categoryColor(b.category) }}
                        />
                        {b.category}
                      </span>
                      <span className="text-muted">
                        {b.co2} kg · <span className="text-ink font-semibold">{b.percent}%</span>
                      </span>
                    </div>
                    <div className="pl-[18px] text-[0.8rem] text-muted">
                      ↳ {b.topSub} ({b.topSubPercent}%)
                    </div>
                  </div>
                ))}
              </div>

              {/* Hiện tại vs sau khi áp dụng */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex justify-between text-[0.8rem] font-semibold mb-2">
                  <span className="text-muted">Now {data.totalCo2.toFixed(1)} kg</span>
                  <span className="text-brand-600">After plan {after} kg</span>
                </div>
                <div className="h-2.5 w-full bg-brand-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-leaf" style={{ width: `${100 - savingPct}%` }} />
                </div>
              </div>

              <Link
                href="/history"
                className="mt-6 text-brand-600 text-[0.85rem] font-semibold no-underline hover:underline text-center"
              >
                See all data →
              </Link>
            </div>

            {/* Action plan */}
            <div className="flex flex-col gap-4">
              <h3 className="m-0 text-ink text-[1.1rem] font-bold">Your Action Plan</h3>
              {sorted.map((rec, i) => {
                const ch = challengeFor(rec);
                const done = ch?.status === "COMPLETED";
                const pct = ch ? Math.min(100, Math.round((ch.progress / ch.target) * 100)) : 0;
                return (
                  <div
                    key={rec.id}
                    className="bg-white rounded-2xl shadow-card p-5 flex flex-wrap items-center gap-5"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-3xl shrink-0 relative">
                      {rec.emoji}
                      {sortBy === "saving" && i === 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-sunrise text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">
                          TOP
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-[220px]">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="m-0 font-bold text-ink text-[1rem]">{rec.title}</h4>
                        <Badge tone={DIFFICULTY_TONE[rec.difficulty]} className="!text-[0.7rem] !py-0.5 !px-2">
                          {rec.difficulty}
                        </Badge>
                      </div>
                      <p className="m-0 text-muted text-[0.85rem]">{rec.description}</p>
                      <p className="m-0 mt-1 text-[0.8rem] flex items-center gap-1.5 text-muted">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: categoryColor(rec.category) }}
                        />
                        Based on your {rec.source} activities
                      </p>
                      {ch && (
                        <div className="mt-3">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${done ? "bg-gradient-sunrise" : "bg-gradient-leaf"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="m-0 mt-1 text-[0.75rem] text-muted">
                            {done
                              ? "Challenge completed 🎉"
                              : `Challenge: ${ch.progress}/${ch.target} ${rec.challengeMatch}`}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-auto">
                      <div className="text-right">
                        <div className="text-[0.75rem] text-muted">Save up to</div>
                        <div className="text-xl font-extrabold text-brand-600">
                          {rec.estimatedSavingKg}
                          <span className="text-[0.8rem] font-semibold text-muted"> kg CO₂e</span>
                        </div>
                      </div>
                      {rec.challengeMatch &&
                        (ch ? (
                          <Link href="/challenges" className="no-underline">
                            <Badge tone={done ? "warning" : "success"} dot>
                              {done ? "Completed" : "In challenges"}
                            </Badge>
                          </Link>
                        ) : (
                          <Button
                            variant="gradient"
                            size="sm"
                            onClick={() => handleApply(rec)}
                            disabled={applyingId === rec.id}
                            className="disabled:opacity-60"
                          >
                            {applyingId === rec.id ? "Starting..." : "Start Challenge"}
                          </Button>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}
